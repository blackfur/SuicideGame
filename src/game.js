var numFs = 1
,effects
,angle =0
,point
,scene
,spotlight
,line
,matrices
,gameProgram
,canvas
,f
,plane
,radius = 128
,gl
,rotation = [0,0,0]
,triangle
,imgtexture
;
window.onload = function(){
    canvas = document.getElementById("cv");
    Promise.all([
	ImgLoader('profusion.png')//320*1440
    ]).then((files)=>{
	onfileloaded(files);
    }).catch((err)=>{
	console.log(err);
	return;
    });
};
function onfileloaded(files){
    //fullscreen(canvas);
    ///////////////////// Initialization Code ////////////////////////////////
    const image_png = files[0];
    gl = canvas.getContext("webgl");
    if(!gl){
	alert('WebGL Not Supportted');
	return;
    }
    gameProgram = createGameProgram(gl);

    //scene = new Scene();
    //matrices = new Matrices();
    //spotlight = Spotlight(scene);
    //////////////////////////////buffer/////////////////////
    //f = F(gl,scene);
    //triangle = createTriangle(gl,scene);
    //m4.translate(triangle.worldMatrix,0,0,-256,triangle.worldMatrix)
    //imgtexture = createImgTex(gl,image_png,scene);
    //triangle.texture = imgtexture.texture;
    //triangle.texture = applyEffects(gl,image_png);
    //plane = Plane(gl,scene);
    //line = Line(gl,scene);
    point = Point(gl,scene);
    //m4.translate(point .worldMatrix,0,0,-256,point .worldMatrix)
    const points = [
	0,0,0, 0,0,1, 1,1,1
    ];
    point.vertexData(gl,points);
    //window.addEventListener('resize', onWindowResize, true);

    //////////////////////////////////render/////////////////////////////
    var then = 0,deltaTime,rotationSpeed = 4*Math.PI/180,PI2 = 2*Math.PI;
    (function _(now){
	now==undefined?now =0:now *= 0.001;
	deltaTime = now -then;
	then = now;
	rotation[1] =(rotation[1]+ rotationSpeed)%PI2;
	try{
	    drawScene(deltaTime );
	    return;
	}catch(err){
	    console.log(err);
	    return;
	}
	requestAnimationFrame(_);
    }());
}
function drawScene(deltaTime ){
    ////////////////////////////////////Config//////////////////////
    //webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    //gl.frontFace(gl.CW);
    //gl.frontFace(gl.CCW);
    // Tell it to use our program (pair of shaders)
    gl.useProgram(gameProgram.program);

    //scene.setMatrices(matrices);
    //spotlight position
    angle += deltaTime *64 * Math.PI /180 ;
    angle%=PI2;
    var x = Math.cos(angle) * radius;
    var z = Math.sin(angle) * radius
    //console.log(x,z);
    //spotlight.uniforms['u_lightWorldPosition'] = [x,64,z];
    //spotlight.uniforms['u_lightWorldPosition'] = matrices.cameraPosition;
    //point.vertexData(gl, [0,0,0,   0,0,1,   1,1,1,].concat([x,64,z]).concat([0,0,1,1,1,1]));
    //gameProgram.display(gl,scene);
    gameProgram.summon(gl,point);
}

/*function drawManyF(){
    const worldMatrix = f.worldMatrix;
    var x,y,angle;
    for (var ii = 0; ii < numFs; ++ii) {
	angle = ii * Math.PI * 2 / numFs;
	//var x = Math.cos(angle) * radius;
	x = 0;
	z = 0;
	y = 0;
	//y = Math.sin(angle) * radius
	m4.translate(worldMatrix,x, y, z,worldMatrix);
	m4.yRotate(worldMatrix,rotation[1],worldMatrix);

	gameProgram.summon(gl,f,spotlight,matrices);
    }
}*/
