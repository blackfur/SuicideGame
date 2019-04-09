import PerspectiveTextureScene from './lib/perspective-texture-scene.js'
import GlProgramFactory,{COLOR,TEXTURE,WORLD_VIEW_PROJECT} from './lib/GlProgramFactory.js'
import TexCube from './lib/tex-cube.js'
import {xRotate,yRotate,zRotate,translation} from './lib/m4.js'
import fullscreen from './lib/fullscreen.js'
import Axis from './lib/axis.js'
import Plane from './lib/plane.js'
import PerspectiveScene from './lib/PerspectiveScene.js'
import {lookAroundByKeyboard} from './lib/Observer.js'
import GameTimer from './lib/timer.js'
import {render} from './lib/utils.js'
import {FPS} from './lib/constants.js'

const canvas = document.getElementById("cv");
const gl = canvas.getContext("webgl");

fullscreen(gl);

const tm = new GameTimer(FPS);
var features = TEXTURE|WORLD_VIEW_PROJECT;
const tex_prog = GlProgramFactory(gl,features);

features = COLOR|WORLD_VIEW_PROJECT;
const color_prog= GlProgramFactory(gl,features);

const texscene = new PerspectiveTextureScene(gl);
texscene.setTranslateMatrix(translation( 0, 4, 6));
texscene.useProgram(color_prog);

const axis_ = Axis(gl);
texscene.addSprite(axis_);
axis_.useProgram(color_prog);

const scene = PerspectiveScene(gl); 
scene.setTranslateMatrix(translation( 0, 4, 6));
scene.useProgram(color_prog);

const tex = texscene.getTexture();
scene.addSprite(tex);
tex.useProgram(tex_prog);

const axis = Axis(gl);
scene.addSprite(axis);
axis.useProgram(color_prog);

const ground= Plane(gl);
scene.addSprite(ground);
ground.useProgram(color_prog);

const texcube = new TexCube(gl);
scene.addSprite(texcube);
texcube.useProgram(tex_prog);

lookAroundByKeyboard(scene);

const step = 16/180*Math.PI;

tm.loop(function(time){
   const ar = axis_.getRotateMatrix();
   xRotate(ar,step,ar);
   yRotate(ar,step,ar);
   zRotate(ar,step,ar);

   render(gl,texscene);

   /*const tr = texcube.getRotateMatrix();
   xRotate(tr,step,tr);*/
   render(gl,scene);
});
