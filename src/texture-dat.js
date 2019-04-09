import GlProgramFactory,{COLOR,TEXTURE,WORLD_VIEW_PROJECT} from './lib/GlProgramFactory.js'
import TexCube from './lib/tex-cube.js'
import {translation} from './lib/m4.js'
import DataTexture from './lib/DataTexture.js'
//import ImgTexture from './lib/ImgTexture.js'
import fullscreen from './lib/fullscreen.js'
import Axis from './lib/axis.js'
import Plane from './lib/plane.js'
import PerspectiveScene from './lib/PerspectiveScene.js'
import {lookAroundByKeyboard} from './lib/Observer.js'
import GameTimer from './lib/timer.js'
import {render} from './lib/utils.js'
import {FPS} from './lib/constants.js'
import ImgLoader from './lib/img-loader.js'

Promise.all([
   ImgLoader('profusion.png')
]).then((files)=>{
   onfileloaded(files);
}).catch((err)=>{
   console.log(err);
   return;
});
function onfileloaded(files){
   const canvas = document.getElementById("cv");
   const gl = canvas.getContext("webgl");

   fullscreen(gl);

   const tm = new GameTimer(FPS);
   var features = TEXTURE|WORLD_VIEW_PROJECT;
   const tex_prog = GlProgramFactory(gl,features);

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

   /*const imgtex = new ImgTexture(gl,files[0]);
   scene.addSprite(imgtex);
   imgtex.useProgram(tex_prog);*/

   const dattex = new DataTexture(gl,[
      128,  64, 128,
      0, 192,   0
   ]);
   scene.addSprite(dattex);
   dattex.useProgram(tex_prog);

   const texcube = new TexCube(gl);
   scene.addSprite(texcube);
   texcube.useProgram(tex_prog);

   lookAroundByKeyboard(scene);

   tm.loop(function(time){
      render(gl,scene);
   });
}
