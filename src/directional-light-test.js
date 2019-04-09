import DirectionalLight from './lib/directional-light.js'
import GlProgramFactory,{COLOR,DIRECTIONAL_LIGHT,WORLD_VIEW_PROJECT} from './lib/GlProgramFactory.js'
import fullscreen from './lib/fullscreen.js'
import Axis from './lib/axis.js'
import Plane from './lib/plane.js'
import PerspectiveScene from './lib/PerspectiveScene.js'
import {lookAroundByKeyboard} from './lib/Observer.js'
import GameTimer from './lib/timer.js'
import {FPS} from './lib/constants.js'
import {render} from './lib/utils.js'
import Cube from './lib/cube.js'

window.addEventListener('load',onload);
function onload(){
   const canvas = document.getElementById("cv");
   const gl = canvas.getContext("webgl");

   fullscreen(gl);
   const tm = new GameTimer(FPS);

   var features = COLOR|WORLD_VIEW_PROJECT;
   const prog = GlProgramFactory(gl,features);

   features = COLOR|DIRECTIONAL_LIGHT|WORLD_VIEW_PROJECT;
   const sun_light_prog = GlProgramFactory(gl,features);

   const scene = PerspectiveScene(gl); 
   scene.useProgram(prog);

   const axis = Axis(gl);
   scene.addSprite(axis);

   const ground= Plane(gl);
   scene.addSprite(ground);

   const lit = new DirectionalLight([1,-1,-1]);
   lit.useProgram(sun_light_prog);
   scene.addSprite(lit);

   const cb = new Cube(gl);
   cb.enable(DIRECTIONAL_LIGHT);
   cb.useProgram(sun_light_prog);
   scene.addSprite(cb);

   lookAroundByKeyboard(scene);

   tm.loop(function(){
      render(gl,scene);
   });
}
