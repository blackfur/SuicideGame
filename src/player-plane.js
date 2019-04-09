const createPlayerPlane= function(){
    function _(gl){
	const clauses = {
	    'drawArrays':[gl.TRIANGLES,0,defaultVertexes.length/6]
	};
	const s= new Player(gl,defaultAttribs,null,clauses);
	return s;
    }
    const defaultVertexes = [
	//position                      color
	-2,0,-2,                    0.8,0.1,0.4,
	2,0,2,                     0.8,0.1,0.4,
	2,0,-2,                   0.8,0.1,0.4,

	2,0,2,                     0.8,0.1,0.4,
	-2,0,-2,                   0.8,0.1,0.4,
	-2,0,2,                    0.8,0.1,0.4,
    ];
    const defaultAttribs= {
	'a_position':[3,"FLOAT",false,6*Float32Array.BYTES_PER_ELEMENT,0,defaultVertexes],
	'a_color':[3,"FLOAT",false,6*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT,defaultVertexes],
    };
    return _;
}();
