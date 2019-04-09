import fullscreen from './lib/fullscreen.js'
import GameTimer from './lib/timer.js'
import SourceLoader from './lib/src-loader.js'
import ImgLoader from './lib/img-loader.js'
//import {} from './lib/m4.js'
import control from './lib/control.js'
import createSusan from './susan-model.js'
import createScene from './createScene.js'
import GlProgramFactory from './lib/GlProgramFactory.js'
import * as C from './lib/constants.js'

window.addEventListener('load',onload);
function onload(){
    Promise.all([
        SourceLoader('Susan.json')
        ,ImgLoader('SusanTexture.png')
    ]).then((files)=>{
        onfileloaded(files);
    }).catch((err)=>{
        console.log(err);
        return;
    });
}
function onfileloaded(files){
    const SusanModel = JSON.parse(files[0]);
    const SusanImage = files[1];

    const canvas = document.getElementById("cv");
    const gl = canvas.getContext("webgl");
    if(!gl){
        alert('WebGL Not Supportted');
        return;
    }
    fullscreen(gl);
    //const tm = new GameTimer(C.FPS);
    var features = GlProgramFactory.WORLD_VIEW_PROJECT|GlProgramFactory.TEXTURE ;
    const prog = GlProgramFactory(gl,features);

    const scene = new createScene(gl);
    control.lookAroundByKeyboard(scene);
    const susan = createSusan(gl,SusanModel,SusanImage);
    scene.addSprite(susan);
    scene.focus(susan);
    //const cameraMatrix = scene.getTranslateMatrix();
    //translate(cameraMatrix,0,0,8,cameraMatrix);

    const tm = new GameTimer(C.FPS);
    tm.loop(function(){
        prog.display(gl,scene);
    });
}
