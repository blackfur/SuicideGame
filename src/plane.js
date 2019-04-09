import Sprite from './lib/sprite.js'
export const createPlane= function(){
    function _(gl){
	const clauses = {
	    'drawArrays':[gl.TRIANGLES,0,defaultVertexes.length/6]
	};
	const s= new Sprite(gl,defaultAttribs,null,clauses);
	return s;
    }
    const defaultVertexes = [
	//position                      color
	-16,0,-16,                    0.2,0.1,0.4,
	16,0,16,                     0.2,0.1,0.4,
	16,0,-16,                   0.2,0.1,0.4,

	16,0,16,                     0.2,0.1,0.4,
	-16,0,-16,                   0.2,0.1,0.4,
	-16,0,16,                    0.2,0.1,0.4,
    ];
    const defaultAttribs= {
	'a_position':[3,"FLOAT",false,6*Float32Array.BYTES_PER_ELEMENT,0,defaultVertexes],
	'a_color':[3,"FLOAT",false,6*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT,defaultVertexes],
    };
    return _;
}();
