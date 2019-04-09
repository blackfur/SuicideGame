import {transformPoint} from './m4.js'
import {getMatrix} from './utils.js'
import Param from './param.js'
import Ghost from './ghost.js'

//PointLight
export default (function(){
   function PointLight(){
      this._uniforms={} ;
      this._uniforms['u_shininess']=64 ;
   }
   PointLight.prototype = Object.create(Param.prototype);
   Object.assign(PointLight.prototype.__proto__,Object.create(Ghost.prototype.__proto__));
   PointLight.constructor = PointLight;
   PointLight.prototype.getUniforms = function(){
      const position = [0,0,0];
      transformPoint(this.getWorldMatrix(),position,position);
      this._uniforms['u_lightWorldPosition'] = position;

      const translateMatrix = this._scene.getTranslateMatrix();
      this._uniforms['u_viewWorldPosition'] = [translateMatrix[12],translateMatrix[13],translateMatrix[14]];

      return this._uniforms;
   };
   return PointLight;
}());
