import Param from './param.js'

//DirectionalLight
export default (function(){
    function DirectionalLight(direction){
       this._direction = direction;
       //this._uniforms = Object.assign({},defaultUniforms);
       this._uniforms = {'u_reverseLightDirection':[-this._direction[1],-this._direction[1],-this._direction[2]]};
    }
    DirectionalLight.prototype = Object.create(Param.prototype);
    DirectionalLight.constructor = DirectionalLight;
    /*DirectionalLight.prototype.getUniforms = function(){
        this._uniforms['u_reverseLightDirection'] = [-this._direction[1],-this._direction[1],-this._direction[2]];
        return this._uniforms;
    };*/
    //const defaultUniforms = {};
    return DirectionalLight;
}());
