import Vector from './vector.js'
import {dotProduct,cross} from './game-math.js'

export default function Quaternion(axis_normal,radian){
    if(arguments.length ==0)return;

    //const rotated_point = new Vector();
    this.w = Math.cos(radian/2);

    this.v = new Vector();
    this.v.x = axis_normal.x * Math.sin(radian/2);
    this.v.y = axis_normal.y * Math.sin(radian/2);
    this.v.z = axis_normal.z * Math.sin(radian/2);
};
Quaternion.prototype.inverse = function(){
    const q = new Quaternion();
    q.w = this.w;
    q.x = -this.v.x;
    q.y = -this.v.y;
    q.z = -this.v.z;
    return q;
};
Quaternion.prototype.multiplyQ = function(q){
    const r = new Quaternion();

    r.w = this.w * q.w - dotProduct(this.v,q.v);
    r.v = this.v.multiply(q.w).add(q.v.multiply(this.w)).add(cross(this.v,q.v));

    return r;
};
Quaternion.prototype.multiplyV = function(v){
    const p = new Quaternion();
    p.w = 0
    p.v = v;

    const vcV = cross(this.v,v);
    return v.add(vcV.multiply(2*this.w)).add(cross(this.v,vcV).multiply(2));
};
// Spherical linear interpolation of a quaternion
//Quaternion.prototype.slerp(other, )
