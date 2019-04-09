import Sprite from './sprite.js'
import {identity,multiply} from './m4.js'
import {getMatrix} from './utils.js'

export default (function(){
    function Player(gl,attribs,uniforms,clauses,ghost){
        Sprite.call(this,gl,attribs,uniforms,clauses);
        this._worldMatrix = identity();
        //translate(this._worldMatrix,0,0,-2,this._worldMatrix);
        this._ghost = ghost;
    }
    Player.prototype = Object.create(Sprite.prototype);
    Player.prototype.constructor = Player;
    Player.prototype.getTranslateMatrix = function(){
        return multiply(getMatrix.call(this,'_translateMatrix'),this._ghost.getWorldMatrix());
    };
    Player.prototype.getRotateMatrix = function(){
        return multiply(getMatrix.call(this,'_rotateMatrix'),this._scene.getRotateMatrix());
    };
    /*Player.prototype.getWorldMatrix = function(){
        this._rotateMatrix = this._scene.getRotateMatrix();
        this._translateMatrix = this._ghost.getWorldMatrix();
        return Sprite.prototype.getWorldMatrix.call(this);
    };*/
    return Player;
}());
