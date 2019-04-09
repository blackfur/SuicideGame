import Sprite,{SHINY} from './sprite.js'
//import {} from './m4.js'
import {defaultUniforms,defaultAttribs,defaultVertexes,defaultNormals} from './cube-model.js'
import Vector from './vector.js'

//Cube
export default (function(){
    function Cube(gl){
        const clauses = {
            'drawArrays':[gl.TRIANGLES,0,defaultVertexes.length/3]
        };
        const attribs = Object.assign({},defaultAttribs);
        //delete attribs['a_color'];
        Sprite.call(this,gl,attribs,defaultUniforms,clauses);
        //this.enable(SHINY);
    }
    Cube.prototype = Object.create(Sprite.prototype);
    Cube.constructor = Cube;

    return Cube;
}());
