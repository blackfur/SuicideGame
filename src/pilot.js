const Pilot= function(){
    function _(gl,vertexes,uniforms,clauses){
	//Step forward to let camera can see the player
	this._worldMatrix =m4.identity();
	m4.translate(this._worldMatrix,0,-0.2,-2,this._worldMatrix);
	m4.scale(this._worldMatrix,0.1,0.1,0.1,this._worldMatrix);
	Sprite.call(this,gl,vertexes,uniforms,defaultClauses(gl).concat(clauses));
    }
    _.prototype = Object.create(Sprite.prototype);
    _.prototype.constructor = _;
    function getWorldMatrix(){
	return this._scene.getCameraMatrix();
    }
    function getSelfWorldMatrix(){
	return getMatrix.call(this,'_worldMatrix');
    }
    _.prototype.getSelfWorldMatrix = getSelfWorldMatrix;
    function attach(scene){
	this._scene = scene;
    }
    _.prototype.attach = attach;
    _.prototype.getWorldMatrix = getWorldMatrix;
    function getUniforms(){
	const m =this._scene.getProjectionMatrix();
	this.uniforms['u_worldProjection'] = m4.multiply(m,this._worldMatrix);
	return this.uniforms;
    }
    _.prototype.getUniforms = getUniforms;
    function defaultClauses(gl){
	return [
	    {
		enable:gl.DEPTH_TEST,
		viewport:[0, 0, gl.canvas.width, gl.canvas.height],
	    },{
		enable:gl.CULL_FACE
	    }
	]
    }
    return _;
}();
