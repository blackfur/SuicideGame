const F = function(){
    function F(gl,scene){
	const f = new Module(gl,attribs,uniforms);
	if(scene!=null){
	    scene.addSprite(f);
	}
	return f;
    };
    const uniforms = {
	'u_color':[0.2, 1, 0.2, 1],
	//'u_enableLight':0,
    };
    const vertex = [
	//positon                  normal                   color
	// left column front         // left column front     // left column front
	0,   0,  0,                  0, 0, 1,                 200,  70, 120,
	0, 150,  0,                  0, 0, 1,                 200,  70, 120,
	30,   0,  0,                 0, 0, 1,                 200,  70, 120,
	0, 150,  0,                  0, 0, 1,                 200,  70, 120,
	30, 150,  0,                 0, 0, 1,                 200,  70, 120,
	30,   0,  0,                 0, 0, 1,                 200,  70, 120,

	// top rung front            // top rung front        // top rung front
	30,   0,  0,                 0, 0, 1,                 200,  70, 120,
	30,  30,  0,                 0, 0, 1,                 200,  70, 120,
	100,   0,  0,                0, 0, 1,                 200,  70, 120,
	30,  30,  0,                 0, 0, 1,                 200,  70, 120,
	100,  30,  0,                0, 0, 1,                 200,  70, 120,
	100,   0,  0,                0, 0, 1,                 200,  70, 120,

	// middle rung front         // middle rung front     // middle rung front
	30,  60,  0,                 0, 0, 1,                 200,  70, 120,
	30,  90,  0,                 0, 0, 1,                 200,  70, 120,
	67,  60,  0,                 0, 0, 1,                 200,  70, 120,
	30,  90,  0,                 0, 0, 1,                 200,  70, 120,
	67,  90,  0,                 0, 0, 1,                 200,  70, 120,
	67,  60,  0,                 0, 0, 1,                 200,  70, 120,

	// left column back          // left column back      // left column back
	0,   0,  30,                 0, 0, -1,                80, 70, 200,
	30,   0,  30,                0, 0, -1,                80, 70, 200,
	0, 150,  30,                 0, 0, -1,                80, 70, 200,
	0, 150,  30,                 0, 0, -1,                80, 70, 200,
	30,   0,  30,                0, 0, -1,                80, 70, 200,
	30, 150,  30,                0, 0, -1,                80, 70, 200,

	// top rung back             // top rung back         // top rung back
	30,   0,  30,                0, 0, -1,                80, 70, 200,
	100,   0,  30,               0, 0, -1,                80, 70, 200,
	30,  30,  30,                0, 0, -1,                80, 70, 200,
	30,  30,  30,                0, 0, -1,                80, 70, 200,
	100,   0,  30,               0, 0, -1,                80, 70, 200,
	100,  30,  30,               0, 0, -1,                80, 70, 200,

	// middle rung back          // middle rung back      // middle rung back
	30,  60,  30,                0, 0, -1,                80, 70, 200,
	67,  60,  30,                0, 0, -1,                80, 70, 200,
	30,  90,  30,                0, 0, -1,                80, 70, 200,
	30,  90,  30,                0, 0, -1,                80, 70, 200,
	67,  60,  30,                0, 0, -1,                80, 70, 200,
	67,  90,  30,                0, 0, -1,                80, 70, 200,

	// top                       // top                   // top
	0,   0,   0,                 0, 1, 0,                 70, 200, 210,
	100,   0,   0,               0, 1, 0,                 70, 200, 210,
	100,   0,  30,               0, 1, 0,                 70, 200, 210,
	0,   0,   0,                 0, 1, 0,                 70, 200, 210,
	100,   0,  30,               0, 1, 0,                 70, 200, 210,
	0,   0,  30,                 0, 1, 0,                 70, 200, 210,

	// top rung right            // top rung right        // top rung right
	100,   0,   0,               1, 0, 0,                 200, 200, 70,
	100,  30,   0,               1, 0, 0,                 200, 200, 70,
	100,  30,  30,               1, 0, 0,                 200, 200, 70,
	100,   0,   0,               1, 0, 0,                 200, 200, 70,
	100,  30,  30,               1, 0, 0,                 200, 200, 70,
	100,   0,  30,               1, 0, 0,                 200, 200, 70,

	// under top rung            // under top rung        // under top rung
	30,   30,   0,               0, -1, 0,                210, 100, 70,
	30,   30,  30,               0, -1, 0,                210, 100, 70,
	100,  30,  30,               0, -1, 0,                210, 100, 70,
	30,   30,   0,               0, -1, 0,                210, 100, 70,
	100,  30,  30,               0, -1, 0,                210, 100, 70,
	100,  30,   0,               0, -1, 0,                210, 100, 70,

	// between top rung and      // between top rung and m// between top rung and middle  iddle
	30,   30,   0,               1, 0, 0,                 210, 160, 70,
	30,   60,  30,               1, 0, 0,                 210, 160, 70,
	30,   30,  30,               1, 0, 0,                 210, 160, 70,
	30,   30,   0,               1, 0, 0,                 210, 160, 70,
	30,   60,   0,               1, 0, 0,                 210, 160, 70,
	30,   60,  30,               1, 0, 0,                 210, 160, 70,

	// top of middle rung        // top of middle rung    // top of middle rung
	30,   60,   0,               0, 1, 0,                 70, 180, 210,
	67,   60,  30,               0, 1, 0,                 70, 180, 210,
	30,   60,  30,               0, 1, 0,                 70, 180, 210,
	30,   60,   0,               0, 1, 0,                 70, 180, 210,
	67,   60,   0,               0, 1, 0,                 70, 180, 210,
	67,   60,  30,               0, 1, 0,                 70, 180, 210,

	// right of middle rung      // right of middle rung  // right of middle rung
	67,   60,   0,               1, 0, 0,                 100, 70, 210,
	67,   90,  30,               1, 0, 0,                 100, 70, 210,
	67,   60,  30,               1, 0, 0,                 100, 70, 210,
	67,   60,   0,               1, 0, 0,                 100, 70, 210,
	67,   90,   0,               1, 0, 0,                 100, 70, 210,
	67,   90,  30,               1, 0, 0,                 100, 70, 210,

	// bottom of middle rung     // bottom of middle rung.// bottom of middle rung.
	30,   90,   0,               0, -1, 0,                76, 210, 100,
	30,   90,  30,               0, -1, 0,                76, 210, 100,
	67,   90,  30,               0, -1, 0,                76, 210, 100,
	30,   90,   0,               0, -1, 0,                76, 210, 100,
	67,   90,  30,               0, -1, 0,                76, 210, 100,
	67,   90,   0,               0, -1, 0,                76, 210, 100,

	// right of bottom           // right of bottom       // right of bottom
	30,   90,   0,               1, 0, 0,                 140, 210, 80,
	30,  150,  30,               1, 0, 0,                 140, 210, 80,
	30,   90,  30,               1, 0, 0,                 140, 210, 80,
	30,   90,   0,               1, 0, 0,                 140, 210, 80,
	30,  150,   0,               1, 0, 0,                 140, 210, 80,
	30,  150,  30,               1, 0, 0,                 140, 210, 80,

	// bottom                    // bottom                // bottom
	0,   150,   0,               0, -1, 0,                90, 130, 110,
	0,   150,  30,               0, -1, 0,                90, 130, 110,
	30,  150,  30,               0, -1, 0,                90, 130, 110,
	0,   150,   0,               0, -1, 0,                90, 130, 110,
	30,  150,  30,               0, -1, 0,                90, 130, 110,
	30,  150,   0,               0, -1, 0,                90, 130, 110,

	// left side                 // left side             // left side
	0,   0,   0,                 -1, 0, 0,                160, 160, 220,
	0,   0,  30,                 -1, 0, 0,                160, 160, 220,
	0, 150,  30,                 -1, 0, 0,                160, 160, 220,
	0,   0,   0,                 -1, 0, 0,                160, 160, 220,
	0, 150,  30,                 -1, 0, 0,                160, 160, 220,
	0, 150,   0,                 -1, 0, 0,                160, 160, 220,
    ];
    const attribs= {
	'a_position':[3,FLOAT,false,9*Float32Array.BYTES_PER_ELEMENT,0],
	'a_normal':[3,FLOAT,false,9*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT],
    };
    return F;
}
();
