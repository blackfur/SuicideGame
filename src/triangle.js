const createTriangle = function(){
    function Triangle(gl,scene){
	const m = new Module(gl,vertexes,vertexAttribPointers,uniforms
			     ,null,null,5);
	if(scene!=null){
	    scene.addSprite(m);
	}
	return m;
    }
    const uniforms = {
	'u_textureOnly':1,
	'u_enableLight':0,
    };
    const vertexAttribPointers = {
	'a_position':[3,"FLOAT",false,5*Float32Array.BYTES_PER_ELEMENT,0],
	'a_texCoord':[2,'FLOAT',false,5*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT]
    };
    const vertexes = [
	//position      //texture coordinate
	512,0,  0,          1,0,
	0,  512,0,          0,1,
	0,  0,  0,          0,0,
    ];
    return Triangle;
}();
