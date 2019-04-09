import Scene from './scene.js'
import Param from './param.js'
import {perspective} from './m4.js'
import {degToRad} from './utils.js'

export default function PerspectiveTextureScene(gl){
   // create to render to
   const targetTextureWidth = 256;
   const targetTextureHeight = 256;
   const targetTexture = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D, targetTexture);
   this._texture = new Param();
   this._texture._clauses = [{
      'bindTexture':[gl.TEXTURE_2D, targetTexture]
   }];

   // define size and format of level 0
   const level = 0;
   const internalFormat = gl.RGBA;
   const border = 0;
   const format = gl.RGBA;
   const type = gl.UNSIGNED_BYTE;
   const data = null;
   gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, targetTextureWidth, targetTextureHeight, border, format, type, data);

   // set the filtering so we don't need mips
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   gl.bindTexture(gl.TEXTURE_2D, null);

   const framebuffer = gl.createFramebuffer();
   gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
   this._clauses = [
      {
         bindFramebuffer:[gl.FRAMEBUFFER,framebuffer],
         clearColor:[0.3333333333333333,0.8470588235294118,0.8627450980392157, 0.6],
         clear:gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT,
         enable:gl.DEPTH_TEST,
         viewport:[0, 0, targetTextureWidth, targetTextureHeight]
      },{
         enable:gl.CULL_FACE
      }
   ];
   // attach the texture as the first color attachment
   const attachmentPoint = gl.COLOR_ATTACHMENT0;
   gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level);

   // create a depth renderbuffer
   const depthBuffer = gl.createRenderbuffer();
   gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
   // make a depth buffer and the same size as the targetTexture
   gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, targetTextureWidth, targetTextureHeight);
   gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

   const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
   const zNear = 1;
   const zFar = -1024;
   const fieldOfViewRadians = degToRad(75);
   const projectionMatrix = perspective(fieldOfViewRadians, aspect, zNear, zFar);
   this._projectionMatrix = projectionMatrix;
}
PerspectiveTextureScene.prototype = Object.create(Scene.prototype);
PerspectiveTextureScene.prototype.constructor = PerspectiveTextureScene;
PerspectiveTextureScene.prototype.getTexture = function(){
   return this._texture;
}
