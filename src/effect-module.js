const createEffectModule = function(){
    function _(gl,scene,img){
	const stride = 4, drawMethod = Arrays, drawMode = TRIANGLES;
	const s = new Sprite(gl,vertexes,vertexAttribPointers,uniforms,drawMethod,drawMode,stride);
	if(scene !=undefined){
	    scene.addSprite(s);
	}
	return s;
    }
    const uniforms = {};
    const vertexAttribPointers = {
	'a_position':[2,FLOAT,false,4*Float32Array.BYTES_PER_ELEMENT,0],
	'a_texCoord':[2,FLOAT,false,4*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT],
    };
    const vertexes = [
	//position   //texture coordinate
    -1,-1,       0.0,0.0  ,
    1,-1,       1.0,0.0  ,
    -1,1,       0.0,1.0  ,

    -1,1,       0.0,1.0  ,
    1,-1,       1.0,0.0  ,
    1,1,       1.0,1.0  ,
    ];
    return _;
}();
