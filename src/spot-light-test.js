import SpotLight from './lib/spot-light.js'
import {translate} from './lib/m4.js'
import GlProgramFactory,{COLOR,SPOT_LIGHT,WORLD_VIEW_PROJECT} from './lib/GlProgramFactory.js'
import fullscreen from './lib/fullscreen.js'
import Axis from './lib/axis.js'
import Plane from './lib/plane.js'
import PerspectiveScene from './lib/PerspectiveScene.js'
import {lookAroundByKeyboard} from './lib/Observer.js'
import GameTimer from './lib/timer.js'
import {FPS} from './lib/constants.js'
import {render} from './lib/utils.js'
import Cube from './lib/cube.js'
import {SHINY} from './lib/sprite.js'

window.addEventListener('load',onload);
function onload(){
   const canvas = document.getElementById("cv");
   const gl = canvas.getContext("webgl");

   fullscreen(gl);
   const tm = new GameTimer(FPS);

   var features = COLOR|WORLD_VIEW_PROJECT;
   const prog = GlProgramFactory(gl,features);

   features = COLOR|SPOT_LIGHT|WORLD_VIEW_PROJECT;
   const lit_prog = GlProgramFactory(gl,features);

   const scene = PerspectiveScene(gl); 
   scene.useProgram(prog);

   const axis = Axis(gl);
   scene.addSprite(axis);

   const ground= Plane(gl);
   scene.addSprite(ground);

   const lit = new SpotLight([1,-1,-1],45*Math.PI/180,90*Math.PI/180);
   const litWorldMatrix = lit.getWorldMatrix();
   translate(litWorldMatrix,0,4,4,litWorldMatrix);
   lit.useProgram(lit_prog);
   scene.addSprite(lit);

   const cb = new Cube(gl);
   cb.enable(SHINY);
   cb.useProgram(lit_prog);
   scene.addSprite(cb);

   lookAroundByKeyboard(scene);

   tm.loop(function(){
      render(gl,scene);
   });
}
