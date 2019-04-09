import Player from './player.js'
import {SHINY} from './sprite.js'
//import {} from './m4.js'
import {defaultUniforms,defaultAttribs,defaultVertexes,defaultNormals} from './cube-model.js'

//CubePlayer
export default (function(){
    function CubePlayer(gl,ghost){
        const clauses = {
            'drawArrays':[gl.TRIANGLES,0,defaultVertexes.length/3]
        };
        const attribs = Object.assign({},defaultAttribs);
        delete attribs['a_color'];
        Player.call(this,gl,attribs,defaultUniforms,clauses,ghost);
        this.enable(SHINY);
    }
    CubePlayer.prototype = Object.create(Player.prototype);
    CubePlayer.constructor = CubePlayer;
    /*CubePlayer.prototype.getWorldMatrix = function(){
        const worldMatrix = Player.prototype.getWorldMatrix.call(this);
        m4.translate(worldMatrix,0,0,1,worldMatrix);
        return worldMatrix;
    }*/
    return CubePlayer;
}());
