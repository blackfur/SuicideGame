const createGameProgram = function(){
    function _(gl){
	return new GlProgram(gl,vstxt,fstxt,param);
    }
    const
    param= {
	"u_lightWorldPosition":  ["vec3",UNIFORM]
	,"u_viewWorldPosition":["vec3",UNIFORM]
	,"u_world":["mat4",UNIFORM]
	,"u_worldViewProjection":["mat4",UNIFORM]
	,"u_worldInverseTranspose":["mat4",UNIFORM]
	,"u_outerLimit":["float",UNIFORM]
	,"u_color":["vec4",UNIFORM]
	,"u_shininess":["float",UNIFORM]
	,"u_lightColor":["vec3",UNIFORM]
	,"u_specularColor":["vec3",UNIFORM]
	,"u_lightDirection":["vec3",UNIFORM]
	,"u_innerLimit":["float",UNIFORM]
	,"a_position":["vec4",ATTRIB]
	,"a_normal":["vec3",ATTRIB]
	,"u_enableLight":['float',UNIFORM]
	,"u_image":['sampler2d',UNIFORM]
	,'a_texCoord':['vec2',ATTRIB]
	,'u_textureOnly':['float',UNIFORM]
	,'u_onePixel':['vec2',UNIFORM]
	,'u_kernel[0]':['float[]',UNIFORM]
	,'u_kernelWeight':['float',UNIFORM]
	,'u_enableConvolutionKernel':['float',UNIFORM]
    };
    const vstxt = " \
attribute vec4 a_position; \
attribute vec3 a_normal; \
  \
uniform vec3 u_lightWorldPosition; \
uniform vec3 u_viewWorldPosition; \
uniform mat4 u_world; \
uniform mat4 u_worldViewProjection; \
uniform mat4 u_worldInverseTranspose; \
  \
varying vec3 v_normal; \
varying vec3 v_surfaceToLight; \
varying vec3 v_surfaceToView; \
 \
attribute vec2 a_texCoord; \
varying vec2 v_texCoord; \
 \
void main() { \
  // Multiply the position by the matrix. \n\
  gl_Position = u_worldViewProjection * a_position; \
  gl_PointSize = 8.0; \
 \
 v_normal= mat3(u_worldInverseTranspose) *a_normal; \
  vec3 surfaceWorldPosition = (u_world * a_position).xyz; \
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition; \
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition; \
 \
   // pass the texCoord to the fragment shader \n\
   // The GPU will interpolate this value between points \n\
   v_texCoord = a_texCoord; \
} \
";
    const fstxt = " \
precision mediump float; \
 \
varying vec3 v_normal; \
varying vec3 v_surfaceToLight; \
varying vec3 v_surfaceToView; \
 \
uniform vec4 u_color; \
uniform float u_shininess; \
uniform vec3 u_lightColor; \
uniform vec3 u_specularColor; \
uniform vec3 u_lightDirection; \
uniform float u_innerLimit;     // in dot space \n\
uniform float u_outerLimit;     // in dot space \n\
uniform float u_enableLight; \
 \
uniform vec2 u_onePixel; \
uniform sampler2D u_image; \
uniform float u_textureOnly; \
varying vec2 v_texCoord; \
uniform float u_kernel[9]; \
uniform float u_kernelWeight; \
uniform float u_enableConvolutionKernel; \
 \
void main() { \
    if(u_textureOnly ==1.0){ \
	if(u_enableConvolutionKernel ==1.0){ \
	    vec4 colorSum = \
		texture2D(u_image, v_texCoord + u_onePixel * vec2(-1, -1)) * u_kernel[0] + \
		texture2D(u_image, v_texCoord + u_onePixel * vec2( 0, -1)) * u_kernel[1] + \
		texture2D(u_image, v_texCoord + u_onePixel * vec2( 1, -1)) * u_kernel[2] + \
		texture2D(u_image, v_texCoord + u_onePixel * vec2(-1,  0)) * u_kernel[3] + \
		texture2D(u_image, v_texCoord + u_onePixel * vec2( 0,  0)) * u_kernel[4] + \
		texture2D(u_image, v_texCoord + u_onePixel * vec2( 1,  0)) * u_kernel[5] + \
		texture2D(u_image, v_texCoord + u_onePixel * vec2(-1,  1)) * u_kernel[6] + \
		texture2D(u_image, v_texCoord + u_onePixel * vec2( 0,  1)) * u_kernel[7] + \
		texture2D(u_image, v_texCoord + u_onePixel * vec2( 1,  1)) * u_kernel[8] ; \
 \
	    // Divide the sum by the weight but just use rgb, we'll set alpha to 1.0 \n\
	    gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1.0); \
	}else{ \
	    //gl_FragColor = vec4(1.0,1.0,1.0,1.0); \n\
	    gl_FragColor = texture2D(u_image, v_texCoord); \
	} \
	return; \
    } \
   gl_FragColor = u_color; \
   if(u_enableLight == 0.0){ \
    return; \
    } \
   // because v_normal is a varying it's interpolated \n\
   // so it will not be a unit vector. Normalizing it \n\
   // will make it a unit vector again \n\
   vec3 normal = normalize(v_normal); \
 \
   vec3 surfaceToLightDirection = normalize(v_surfaceToLight); \
   vec3 surfaceToViewDirection = normalize(v_surfaceToView); \
   vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection); \
 \
   float light = 0.0; \
   float specular = 0.0; \
 \
   float dotFromDirection = dot(surfaceToLightDirection,-u_lightDirection); \
   // GLSL also has a function we could use to slightly simplify this. It's called smoothstep and like step it returns a value from 0 to 1 but it takes both an lower and upper bound and lerps between 0 and 1 between those bounds. \n\
   // smoothstep(lowerBound, upperBound, value) \n\
   float inLight = smoothstep(u_outerLimit, u_innerLimit, dotFromDirection); \
   light = inLight * dot(normal, surfaceToLightDirection); \
   specular = inLight * pow(dot(normal, halfVector), u_shininess); \
 \
   // Lets multiply just the color portion (not the alpha) by the light \n\
   gl_FragColor.rgb *= light * u_lightColor; \
   // Just add in the specular \n\
   gl_FragColor.rgb += specular * u_specularColor; \
} \
";
    return _;
}();
