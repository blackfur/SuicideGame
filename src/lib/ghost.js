import {copy,multiply,identity} from './m4.js'
import Graph from './graph.js'

export default function Ghost(){};
Ghost.prototype = Object.create(Graph.prototype);
Ghost.prototype.constructor = Ghost;
Ghost.prototype.getTranslateMatrix = function(){
   this._translateMatrix = this._translateMatrix || identity();
   return this._translateMatrix;
};
Ghost.prototype.getRotateMatrix = function(){
   this._rotateMatrix = this._rotateMatrix || identity();
   return this._rotateMatrix;
};
Ghost.prototype.getScaleMatrix = function(){
   this._scaleMatrix = this._scaleMatrix || identity();
   return this._scaleMatrix;
};
Ghost.prototype.setScaleMatrix = function(m){
   this._scaleMatrix = m;
};
// Realtime global matrix
Ghost.prototype.getWorldMatrix = function(){
   return multiply(multiply(multiply(this.getFollowMatrix(),this.getTranslateMatrix()),this.getRotateMatrix()),this.getScaleMatrix());
};
Ghost.prototype.getLocalMatrix = function(){
   return multiply(multiply(this.getTranslateMatrix(),this.getRotateMatrix()),this.getScaleMatrix());
};
// Static World Matrix
Ghost.prototype.getGlobalMatrix = function(){
   this._globalMatrix =this._globalMatrix || identity();
   return this._globalMatrix;
};
/*Ghost.prototype.getParentGlobalMatrix= function(){
   if(this._parent ==null)
      return identity();
   return this._parent._globalMatrix;
};*/
Ghost.prototype.getParentWorldMatrix= function(){
   if(this._parent ==null)
      return identity();
   return this._parent.getWorldMatrix();
};
Ghost.prototype.updateGlobalMatrix = function(parentGlobalMatrix){
   if(parentGlobalMatrix ==null)
      this.getLocalMatrix && copy(this.getLocalMatrix(),this.getGlobalMatrix());
   else
      multiply(multiply(parentGlobalMatrix,this._initParentInverseMatrix||identity()),
         this.getLocalMatrix(), this.getGlobalMatrix());
   const children = this.getChildren();
   for(var i=0,l= children.length;i<l;i++)
      children[i].updateGlobalMatrix(this.getGlobalMatrix());
};
// Follow parent, Real time.
Ghost.prototype.getFollowMatrix = function(){
   if(this._parent ==null)
      return identity();
   if(this._initParentInverseMatrix==null)
      return this._parent.getWorldMatrix();
   else
      return multiply(this._parent.getWorldMatrix(),this._initParentInverseMatrix);
};
