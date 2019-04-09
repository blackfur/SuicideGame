const Effects = function(){
    function _(gl,effectsToApply,image,textureUnit,unfiorms){
	const effectProgram = new GlProgram(gl,vstxt,fstxt,param);
	const rectangle = createEffectModule(gl);
	gl.useProgram(effectProgram.program);
	// Clear the canvas
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.enable(gl.CULL_FACE);
	effectProgram.prepareDraw(gl,rectangle);
	effectProgram.set(gl,'u_onePixel',[1.0/image.width,1.0/image.height]);
	// Create a texture and put the image in it.
	var originalImageTexture = createAndSetupTexture(gl);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	this.texture = drawFrameBuffer(gl,image,originalImageTexture,effectsToApply,effectProgram,rectangle);
	//this.texture =drawFrameBufferOnce(gl,originalImageTexture,image,effectProgram,rectangle);
	//return;
	// finally draw the result to the canvas.
	//gl.uniform1f(flipYLocation, -1);  // need to y flip for canvas
	// make this the framebuffer we are rendering to.
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	// Tell webgl the viewport setting needed for framebuffer.
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	// set the kernel
	//gl.uniform1fv(kernelLocation, kernels["normal"]);
	// Draw the rectangle.
	//gl.drawArrays(gl.TRIANGLES, 0, 6);
	gl.deleteProgram(effectProgram.program);
	//this.texture = originalImageTexture;
    }
    function drawFrameBufferOnce(gl,originalImageTexture,image,effectProgram,rectangle){
	//var texture = createAndSetupTexture(gl);
	//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	//var fbo = gl.createFramebuffer();
	//gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
	// Attach a texture to it.
	//gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);
	//gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
	gl.canvas.style.width = image.width +'px';
	gl.canvas.style.height= image.height+'px';
	const cw = gl.canvas.clientWidth;
	const ch = gl.canvas.clientHeight;
	gl.canvas.width = cw;
	gl.canvas.height = ch;
	gl.viewport(0, 0, image.width, image.height);
	const k = kernels['unsharpen'];
	effectProgram.set(gl,'u_kernel[0]',k);
	effectProgram.set(gl,'u_kernelWeight',computeKernelWeight(k));
	// Draw the rectangle.
	gl.drawArrays(gl.TRIANGLES, 0, rectangle.vertexCount);
	//return texture;
    }
    function drawFrameBuffer(gl,image,originalImageTexture,effectsToApply,effectProgram,rectangle){
	// create 2 textures and attach them to framebuffers.
	var textures = [];
	var framebuffers = [];
	for (var ii = 0; ii < 2; ++ii) {
	    var texture = createAndSetupTexture(gl);
	    textures.push(texture);
	    
	    // make the texture the same size as the image
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	    
	    // Create a framebuffer
	    var fbo = gl.createFramebuffer();
	    framebuffers.push(fbo);
	    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
	    
	    // Attach a texture to it.
	    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	}
	// start with the original image
	gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);
	
	// don't y flip images while drawing to the textures
	//gl.uniform1f(flipYLocation, 1);
	
	// loop through each effect we want to apply.
	for (var ii = 0; ii < effectsToApply.length; ++ii) {
	    // Setup to draw into one of the framebuffers.
	    // make this the framebuffer we are rendering to.
	    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[ii % 2]);
	    
	    // Tell webgl the viewport setting needed for framebuffer.
	    gl.viewport(0, 0, image.width, image.height);
	    
	    // set the kernel
	    const k = kernels[effectsToApply[ii]];
	    effectProgram.set(gl,'u_kernel[0]',k);
	    effectProgram.set(gl,'u_kernelWeight',computeKernelWeight(k));
	    
	    // Draw the rectangle.
	    gl.drawArrays(gl.TRIANGLES, 0, rectangle.vertexCount);
	    // for the next draw, use the texture we just rendered to.
	    gl.bindTexture(gl.TEXTURE_2D, textures[ii % 2]);
	}
	return textures[(ii-1)%2];
    }
    function createAndSetupTexture(gl) {
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	// Set up texture so we can render any size image and so we are
	// working with pixels.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
	return texture;
    }
    _.prototype.texture = function(){};
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
    const param = {
	"a_position":  ["vec2",ATTRIB]
	,"a_texCoord":["vec2",ATTRIB]
	,"u_image":["sampler2D",UNIFORM]
	,"u_onePixel":['vec2',UNIFORM]
	,"u_kernel[0]":['float[]',UNIFORM]
	,"u_kernelWeight":["float",UNIFORM]
    };
    const vstxt = "\
attribute vec2 a_position; \
attribute vec2 a_texCoord; \
 \
varying vec2 v_texCoord; \
 \
void main() { \
 \
   gl_Position = vec4(a_position, 0, 1); \
   v_texCoord = a_texCoord; \
}";
    const fstxt = "\
precision mediump float; \
 \
// our texture \n\
uniform sampler2D u_image; \
uniform vec2 u_onePixel; \
uniform float u_kernel[9]; \
uniform float u_kernelWeight; \
 \
// the texCoords passed in from the vertex shader. \n\
varying vec2 v_texCoord; \
 \
void main() { \
    //gl_FragColor =texture2D(u_image,v_texCoord); \n\
    //gl_FragColor =vec4(1.0,0,0,1.0); \n\
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
    return _;
}();
