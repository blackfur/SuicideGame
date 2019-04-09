import {yRotate} from './m4.js'

function Swirl(sprite,radian){
    this._rotateMatrix = sprite.getRotateMatrix();
    this._speed = radian;
    //this._radian= 0;
}
Swirl.prototype.do = function(rotate){
    //this._radian= (this._radian +this._speed) % (Math.PI*2);
    rotate(this._rotateMatrix,this._speed,this._rotateMatrix);
}
export function SwirlY(sprite,radian){
    Swirl.call(this,sprite,radian);
    this.do = Swirl.prototype.do.bind(this,yRotate);
}
