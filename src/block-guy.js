import PointLight from './lib/point-light.js'
import GlProgramFactory,{COLOR,POINT_LIGHT,WORLD_VIEW_PROJECT} from './lib/GlProgramFactory.js'
import fullscreen from './lib/fullscreen.js'
import Axis from './lib/axis.js'
import Plane from './lib/plane.js'
import PerspectiveScene from './lib/PerspectiveScene.js'
import {lookAroundByKeyboard} from './lib/Observer.js'
import GameTimer from './lib/timer.js'
import {render} from './lib/utils.js'
import {FPS} from './lib/constants.js'
import Model from './lib/model.js'
import {translation} from './lib/m4.js'
import BlockGuy from './block-guy-recipe.js'
import {SHINY}from './lib/light.js'

window.addEventListener('load',onload);
function onload(){
    const canvas = document.getElementById("cv");
    const gl = canvas.getContext("webgl");

    fullscreen(gl);

    const tm = new GameTimer(FPS);
    var features = COLOR|POINT_LIGHT|WORLD_VIEW_PROJECT;
    const lit_prog = GlProgramFactory(gl,features);

    features = COLOR|WORLD_VIEW_PROJECT;
    const color_prog= GlProgramFactory(gl,features);

    const scene = PerspectiveScene(gl); 
   scene.setTranslateMatrix(translation( 0, 4, 6));
    scene.useProgram(color_prog);

    const axis = Axis(gl);
    scene.addSprite(axis);
    axis.useProgram(color_prog);

    const ground= Plane(gl);
    scene.addSprite(ground);
    ground.useProgram(color_prog);

    const lit = new PointLight(gl);
    const litWorldMatrix = lit.getTranslateMatrix();
    translate(litWorldMatrix,0,16,8,litWorldMatrix);
    lit.useProgram(lit_prog);
    scene.addSprite(lit);

   const blockguy = new Model(gl,new BlockGuy(gl));
   scene.addSprite(blockguy);
   blockguy.useProgram(lit_prog);
   blockguy.enable(SHINY);

    lookAroundByKeyboard(scene);

    tm.loop(function(time){
        render(gl,scene);
       blockguy.run(time);
    });
}
