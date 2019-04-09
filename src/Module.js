const Module = function(){
    function _(gl,vertexes,uniforms,clauses,prefs){
	Sprite.call(this,gl,vertexes,uniforms,clauses,prefs);
	this.worldMatrix = m4.identity();
	this.uniforms['u_world'] = this.worldMatrix;
	this.viewProjectionMatrix = m4.identity();
	this.uniforms['u_worldInverseTranspose']=m4.transpose(m4.inverse(this.worldMatrix));
    };
    _.prototype = Object.create(Sprite.prototype);
    _.prototype.constructor = _;
    _.prototype.setViewProjectionMatrix =function(viewProjectionMatrix ){
	this.viewProjectionMatrix = viewProjectionMatrix;
	this.worldViewProjectionMat=m4.multiply(this.viewProjectionMatrix,this.worldMatrix);
	this.uniforms['u_worldViewProjection'] = this.worldViewProjectionMat;
    };
    _.prototype.setWorldMatrix=function(worldMatrix){
	this.worldMatrix= worldMatrix;
	this.uniforms['u_worldInverseTranspose']=m4.transpose(m4.inverse(this.worldMatrix));
	this.worldViewProjectionMat=m4.multiply(this.viewProjectionMatrix,this.worldMatrix);
	this.uniforms['u_world'] = this.worldMatrix;
	this.uniforms['u_worldViewProjection'] = this.worldViewProjectionMat;
    };
    return _;
}();
