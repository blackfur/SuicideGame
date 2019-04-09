import {identity} from 'm4.js'

export default function Atom(){};
Atom.prototype.getTranslateMatrix = function(){
   this._translateMatrix = this._translateMatrix || identity();
};
Atom.prototype.getRotateMatrix = function(){
   this._rotateMatrix = this._rotateMatrix || identity();
};
Atom.prototype.getScaleMatrix = function(){
   this._scaleMatrix = this._scaleMatrix || identity();
};
