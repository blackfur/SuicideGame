import fullscreen from './lib/fullscreen.js'
import Cube from './lib/cube.js'
import PointLight from './lib/point-light.js'
import m4 from './lib/m4.js'
import PerspectiveScene from './lib/PerspectiveScene.js'
import GlProgramFactory,{COLOR,POINT_LIGHT,WORLD_VIEW_PROJECT} from './lib/GlProgramFactory.js'

window.addEventListener('load',onload);
function onload(){
    const canvas = document.getElementById("cv");
    const gl = canvas.getContext("webgl");
    if(!gl){
        alert('WebGL Not Supportted');
        return;
    }

    fullscreen(gl);

    const features = COLOR|POINT_LIGHT|WORLD_VIEW_PROJECT;
    const prog = GlProgramFactory(gl,features);

    const scene = PerspectiveScene(gl); 

    const lit = new PointLight(gl);
    const litWorldMatrix = lit.getWorldMatrix();
    m4.translate(litWorldMatrix,0,3,-3,litWorldMatrix);
    scene.addSprite(lit);

    const cube = new Cube(gl);
    const cubeWorldMatrix = cube.getWorldMatrix();
    m4.translate(cubeWorldMatrix,0,1,0,cubeWorldMatrix);
    scene.addSprite(cube);

    prog.display(gl,scene);
}
