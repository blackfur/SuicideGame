const Light = function(){
    function Light(uniforms){
	this.defaultUniforms = uniforms;
	if(this.defaultUniforms['u_enableLight']==null){
	    this.defaultUniforms['u_enableLight'] = 1;
	}
    }
    Light.prototype.uniforms = function(){
	return this.defaultUniforms; 
    };
    return Light;
}();
