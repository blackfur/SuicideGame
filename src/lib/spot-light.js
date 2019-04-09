import PointLight from './point-light.js'

export default function SpotLight(direction,innerRadian,outerRadian){
   PointLight.call(this);
   //this._direction = direction;
   //this._radian = radian;
   Object.assign(this._uniforms ,{'u_lightDirection':direction,'u_outerLimit':Math.cos(outerRadian),'u_innerLimit':Math.cos(innerRadian)});
}
SpotLight.prototype = Object.create(PointLight.prototype);
SpotLight.constructor = SpotLight;
