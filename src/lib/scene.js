"use strict"
import {multiply,inverse} from './m4.js'
import {getMatrix} from "./utils.js"
import Param from './param.js'
import Graph from './graph.js'
import Ghost from './ghost.js'

export default function Scene(gl,clauses){
   this.clauses = 
      [
         {
            bindFramebuffer:[gl.FRAMEBUFFER, null],
            clearColor:[0.3333333333333333,0.8470588235294118,0.8627450980392157, 0.6],
            clear:gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT,
            enable:gl.DEPTH_TEST,
            viewport:[0, 0, gl.canvas.width, gl.canvas.height]
         },{
            enable:gl.CULL_FACE
         }
      ].concat(clauses||[]);
}

Scene.prototype = Object.create(Param.prototype);
Object.assign(Scene.prototype.__proto__,Object.create(Graph.prototype).__proto__);
Object.assign(Scene.prototype.__proto__,Object.create(Ghost.prototype).__proto__);
Scene.prototype.constructor = Scene;

//Override
Scene.prototype.getLocalMatrix = null;
Scene.prototype.addSprite= function(sprite){
   this.adopt(sprite);
   sprite.setScene(this);
}
Scene.prototype.setTranslateMatrix = function(t){
   this._translateMatrix = t;
};
Scene.prototype.focus = function(sprite){
   this.getCameraMatrix = follow.bind(this,sprite);
   sprite._scene = this;
}
function follow(sprite){
   const cameraMatrix =multiply(sprite.getWorldMatrix(),this.getRotateMatrix());
   multiply(cameraMatrix,this.getTranslateMatrix(),cameraMatrix);
   //const target= [0, 0, 0];
   //const up = [0, 1, 0];
   return cameraMatrix;
   //return lookAt([ cameraMatrix[12], cameraMatrix[13], cameraMatrix[14], ],target,up);
}

Scene.prototype.setCameraMatrix = function(m){
   this._cameraMatrix = m;
}
function getCameraMatrix(){
   //return getMatrix.call(this,'_cameraMatrix');
   return multiply(this.getRotateMatrix(),this.getTranslateMatrix());
}
function getProjectionMatrix(){
   return getMatrix.call(this,'_projectionMatrix');
}
Scene.prototype.getProjectionMatrix = getProjectionMatrix;
// Check m4.js to figure out why, Camera's orientation can also be obtain from cameraMatrix like this but (8,9,10)
function getCameraPosition(){
   const cameraMatrix = getCameraMatrix.call(this);
   return [ cameraMatrix[12], cameraMatrix[13], cameraMatrix[14], ];
}
Scene.prototype.getCameraPosition = getCameraPosition;

Scene.prototype.getCameraMatrix = getCameraMatrix;
Scene.prototype.getViewProjectionMatrix = function(){
   //const cameraMatrix = getMatrix.call(this,'_cameraMatrix');
   const cameraMatrix = this.getCameraMatrix();
   const viewMatrix =inverse(cameraMatrix);
   const projectionMatrix = getMatrix.call(this,'_projectionMatrix');
   return multiply(projectionMatrix,viewMatrix );
   //return this._viewProjectionMatrix;
}
Scene.prototype.getClauses= Param.prototype.getClauses;
