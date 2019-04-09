import Sprite from './lib/sprite.js'
import Vector from './lib/vector.js'
import * as C from './lib/constants.js'

//createCube
export default (function(){
    function _(gl){
        //const vertexes = [{vertexes:defaultVertexes,attribs:defaultAttribs}];
        const clauses = {
            'drawArrays':[gl.TRIANGLES,0,defaultVertexes.length/6]
        };
        const cb = new Sprite(gl,defaultAttribs,defaultUniforms,clauses);
        //cb.setAABB(new Vector(0,0,-1));
        return cb;
    }

    const defaultUniforms = {
        //'u_color':[1,0,0,1]
    };
    const defaultVertexes = [
        //front
        -1,-1,0,     1,1,0,
        1,-1,0,      1,1,0,     
        -1,1,0,     1,1,0,

        -1,1,0,     1,0,0,
        1,-1,0,     1,0,0,
        1,1,0,     1,0,0,
        //right
        1,1,0,     0,0,1,
        1,-1,0,     0,0,1,
        1,-1,-2,     0,0,1,

        1,-1,-2,     0,0,1,
        1,1,-2,     0,0,1,
        1,1,0,     0,0,1,
        //back
        1,-1,-2,     1,0,0,
        -1,-1,-2,     1,0,0,
        1,1,-2,     1,0,0,

        1,1,-2,     1,0,0,
        -1,-1,-2,     1,0,0,
        -1,1,-2,     1,0,0,
        //left
        -1,1,-2,     0,0,1,
        -1,-1,-2,     0,0,1,
        -1,-1,0,     0,0,1,

        -1,-1,0,     0,0,1,
        -1,1,0,     0,0,1,
        -1,1,-2,     0,0,1,
        //top
        -1,1,-2,     0,1,0,
        -1,1,0,     0,1,0,
        1,1,0,     0,1,0,

        1,1,0,     0,1,0,
        1,1,-2,     0,1,0,
        -1,1,-2,     0,1,0,
        //bottom
        -1,-1,0,     0,0,1,
        -1,-1,-2,     0,0,1,
        1,-1,0,     0,0,1,

        1,-1,0,     0,0,1,
        -1,-1,-2,     0,0,1,
        1,-1,-2,     0,0,1,
    ];
    const defaultAttribs = {
        'a_position':[3,C.FLOAT,false,6*Float32Array.BYTES_PER_ELEMENT,0,defaultVertexes],
        'a_color':[3,C.FLOAT,false,6*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT,defaultVertexes],
    };
    return _;
}());
