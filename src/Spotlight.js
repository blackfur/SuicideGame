const Spotlight = function(){
    function Spotlight(scene){
	const l =new Light(uniforms);
	if(scene!=null){scene.addLight(l);}
	return l;
    }
    const uniforms = {
	'u_lightDirection':m4.normalize([0.5, 0.7, 1]),
	'u_innerLimit':Math.cos(degToRad(90)),
	'u_outerLimit':Math.cos(degToRad(180)),
	//'u_lightWorldPosition':[20, 100, 50],
	'u_shininess':64,
	'u_lightColor':m4.normalize([1, 0.6, 0.6]),
	'u_specularColor':m4.normalize([1, 0.6, 0.6]),
    };
    return Spotlight;
}();
