const glpf = createProgram;
window.addEventListener('load',onload);
function onload(){
    const canvas = document.getElementById("cv");
    gl = canvas.getContext("webgl");
    if(!gl){
	alert('WebGL Not Supportted');
	return;
    }
    fullscreen(gl);
    const tm = new GameTimer(8);
    const features = glpf.VERTEX_COLOR|glpf.WORLD_VIEW_PROJECT;
    const prog = createProgram(gl,features);
    const cb = createCube(gl);
    const li = createLine(gl);
    const po= createPoint(gl);
    const sc = createScene(gl); 
    const sprites = [li,po,cb];
    for(var i=0,l=sprites.length;i<l;i++){
	sc.addSprite(sprites[i]);
    }

    const wm = cb.getWorldMatrix();
    //m4.translate(wm,0,0,1,wm);
    const speedx = 8*Math.PI/180;
    const oneRadian = Math.PI/180;
    const speedy = speedx + 4*oneRadian;
    const speedz = speedy + 2*oneRadian;

    tm.loop(function(){
	//m4.yRotate(wm,speedy,wm);
	m4.xRotate(wm,speedx,wm);
	//m4.zRotate(wm,speedz,wm);
	prog.display(gl,sc);
    });
}
