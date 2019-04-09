window.addEventListener('load',onload);
function onload(){
    //to make the drawingbuffer(gl.canvas.width/height) match whatever size we has stretched the canvas by css style
    Promise.all([
	ImgLoader('profusion.png')//320*1440
    ]).then((files)=>{
	onfileloaded(files);
    }).catch((err)=>{
	console.log(err);
	return;
    });
}
function onfileloaded(files){
    
    const img_png = files[0];
    cv.style.width = img_png.width +'px';
    cv.style.height = img_png.height + 'px';
    const cw = cv.clientWidth;
    const ch = cv.clientHeight;
    cv.width = cw;
    cv.height = ch;

    const gl = cv.getContext("webgl");

    //console.log(gl.canvas.width);
    //console.log(gl.canvas.height);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img_png);

    const prog = new GlProgram(gl,vstxt,fstxt,param);
    const s = new Sprite(gl,vertexes,vertexAttribPointers,null,null,null,4);

    //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.viewport(0, 0, img_png.width, img_png.height);
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.useProgram(prog.program);
    const k = kernels['unsharpen'];
    prog.set(gl,'u_kernel[0]',k);
    //console.log(k);
    prog.set(gl,'u_kernelWeight',computeKernelWeight(k));
    prog.set(gl,'u_onePixel',[1.0/img_png.width,1.0/img_png.height])
    prog.prepareDraw(gl,s);
    gl.drawArrays(gl.TRIANGLES, 0, s.vertexCount);
    gl.deleteProgram(prog.program);
}
const param = {
    "a_position":  ["vec2",ATTRIB]
    ,"a_texCoord":["vec2",ATTRIB]
    ,"u_image":["sampler2D",UNIFORM]
    ,"u_onePixel":['vec2',UNIFORM]
    ,"u_kernel[0]":['float[]',UNIFORM]
    ,"u_kernelWeight":["float",UNIFORM]
};
const vertexAttribPointers = {
    'a_position':[2,FLOAT,false,4*Float32Array.BYTES_PER_ELEMENT,0]
    ,'a_texCoord':[2,FLOAT,false,4*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT]
};
const vertexes = [
    //position 
    -1,-1,       0.0,0.0  ,
    1,-1,       1.0,0.0  ,
    -1,1,       0.0,1.0  ,

    -1,1,       0.0,1.0  ,
    1,-1,       1.0,0.0  ,
    1,1,       1.0,1.0  ,
];
const vstxt = "\
attribute vec2 a_position; \
attribute vec2 a_texCoord; \
varying vec2 v_texCoord; \
 \
void main() { \
 \
   gl_Position = vec4(a_position, 0, 1); \
   v_texCoord = a_texCoord; \
}";
const fstxt = "\
precision mediump float; \
uniform sampler2D u_image; \
varying vec2 v_texCoord; \
uniform vec2 u_onePixel; \
uniform float u_kernel[9]; \
uniform float u_kernelWeight; \
 \
void main() { \
    //gl_FragColor =texture2D(u_image,v_texCoord); \n\
//gl_FragColor = vec4((texture2D(u_image, v_texCoord ) * u_kernel[4]).rgb,1); \n\
//return; \n\
   vec4 colorSum = \
       texture2D(u_image, v_texCoord + u_onePixel * vec2(-1, -1)) * u_kernel[0] + \
       texture2D(u_image, v_texCoord + u_onePixel * vec2( 0, -1)) * u_kernel[1] + \
       texture2D(u_image, v_texCoord + u_onePixel * vec2( 1, -1)) * u_kernel[2] + \
       texture2D(u_image, v_texCoord + u_onePixel * vec2(-1,  0)) * u_kernel[3] + \
       texture2D(u_image, v_texCoord + u_onePixel * vec2( 0,  0)) * u_kernel[4] + \
       texture2D(u_image, v_texCoord + u_onePixel * vec2( 1,  0)) * u_kernel[5] + \
       texture2D(u_image, v_texCoord + u_onePixel * vec2(-1,  1)) * u_kernel[6] + \
       texture2D(u_image, v_texCoord + u_onePixel * vec2( 0,  1)) * u_kernel[7] + \
       texture2D(u_image, v_texCoord + u_onePixel * vec2( 1,  1)) * u_kernel[8] ; \
   gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1); \
}";


const kernels = {
    normal: [
	0, 0, 0,
	0, 1, 0,
	0, 0, 0
    ],
    gaussianBlur: [
	0.045, 0.122, 0.045,
	0.122, 0.332, 0.122,
	0.045, 0.122, 0.045
    ],
    unsharpen: [
	-1, -1, -1,
	-1,  9, -1,
	-1, -1, -1
    ],
    emboss: [
	-2, -1,  0,
	-1,  1,  1,
	0,  1,  2
    ]
};
