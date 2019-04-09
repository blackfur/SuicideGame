import {multiply,identity,inverse} from './m4.js'
import * as v2 from './v2.js'

export function degToRad(d) {
   return d * Math.PI / 180;
}
export function radToDeg(r) {
   return r * 180 / Math.PI;
}
// Returns a random integer from 0 to range - 1.
export function randomInt(range) {
   return Math.floor(Math.random() * range);
}

export function vertex2pixel(gl,x,y,z,worldViewProjectionMatrix){
   // compute a clipspace position
   // using the matrix we computed for the F
   var clipspace = transformVector(worldViewProjectionMatrix, [x,y,z,1]);

   // divide X and Y by W just like the GPU does.
   clipspace[0] /= clipspace[3];
   clipspace[1] /= clipspace[3];

   // convert from clipspace to pixels
   var pixelX = (clipspace[0] *  0.5 + 0.5) * gl.canvas.width;
   var pixelY = (clipspace[1] * -0.5 + 0.5) * gl.canvas.height;

   return {x:Math.floor(pixelX),
      y:Math.floor(pixelY)
   };
}

//convolution kernel
export function computeKernelWeight(kernel) {
   var weight = kernel.reduce(function(prev, curr) {
      return prev + curr;
   });
   return weight <= 0 ? 1 : weight;
}

export function extendNotOverride(target,defaults){
   if(defaults==undefined)
      return;
   for(var key in defaults){
      if(target[key]==undefined){
         target[key] = defaults[key];
      }
   }
}
export function getMatrix(name){
   if(this[name]==undefined){
      this[name] = identity();
   }
   return this[name];
}
const defaultShaderType = [
   "VERTEX_SHADER",
   "FRAGMENT_SHADER",
];
/**
 * Creates a program from 2 sources.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext
 *        to use.
 * @param {string[]} shaderSourcess Array of sources for the
 *        shaders. The first is assumed to be the vertex shader,
 *        the second the fragment shader.
 * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
 * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
 * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console
 *        on error. If you want something else pass an callback. It's passed an error message.
 * @return {WebGLProgram} The created program.
 * @memberOf module:webgl-utils
 */
export function createProgramFromSources(
   gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback) {
   var shaders = [];
   for (var ii = 0; ii < shaderSources.length; ++ii) {
      shaders.push(loadShader(
         gl, shaderSources[ii], gl[defaultShaderType[ii]], opt_errorCallback));
   }
   return createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
}
/**
 * Loads a shader.
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
 * @param {string} shaderSource The shader source.
 * @param {number} shaderType The type of shader.
 * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors.
 * @return {WebGLShader} The created shader.
 */
function loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
   //console.log(shaderSource);
   var errFn = opt_errorCallback || console.error;
   // Create the shader object
   var shader = gl.createShader(shaderType);

   // Load the shader source
   gl.shaderSource(shader, shaderSource);

   // Compile the shader
   gl.compileShader(shader);

   // Check the compile status
   var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
   if (!compiled) {
      console.error(shaderSource);
      // Something went wrong during compilation; get the error
      var lastError = gl.getShaderInfoLog(shader);
      errFn("*** Error compiling shader '" + shader + "':" + lastError);
      gl.deleteShader(shader);
      return null;
   }

   return shader;
}
/**
 * Creates a program, attaches shaders, binds attrib locations, links the
 * program and calls useProgram.
 * @param {WebGLShader[]} shaders The shaders to attach
 * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
 * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
 * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console
 *        on error. If you want something else pass an callback. It's passed an error message.
 * @memberOf module:webgl-utils
 */
function createProgram(
   gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
   var errFn = opt_errorCallback || console.error;
   var program = gl.createProgram();
   shaders.forEach(function(shader) {
      gl.attachShader(program, shader);
   });
   if (opt_attribs) {
      opt_attribs.forEach(function(attrib, ndx) {
         gl.bindAttribLocation(
            program,
            opt_locations ? opt_locations[ndx] : ndx,
            attrib);
      });
   }
   gl.linkProgram(program);

   // Check the link status
   var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
   if (!linked) {
      // something went wrong with the link
      var lastError = gl.getProgramInfoLog(program);
      errFn("Error in program linking:" + lastError);

      gl.deleteProgram(program);
      return null;
   }
   return program;
}
export function render(gl,scene){
   scene.updateGlobalMatrix();
   summon(gl,scene);
}
function summon(gl,sprite){
   const prog = sprite._program || sprite._scene._program;
   prog.summon(gl,sprite);
   const children = sprite.getChildren();
   for(var i=0,l=children.length;i<l;i++){
      summon(gl,children[i]);
   }
}
export function clone_array(arr){
   const new_arr = [];
   for(var i=0,l=arr.length;i<l;i++){
      new_arr.push(arr[i]);
   }
   return new_arr;
}

export function off(kid,merry_go_round){
   if(kid._parent == undefined)
      return;
   kid._parent = undefined;
   kid.getWorldMatrix = kid.getLocalMatrix;
}
// INTERSECTION TESTS IN 2D
//AABB vs AABB, two sprites
export function intersect2D(a,b){
   const translateA = a.getTranslateMatrix();
   const AABBa = a.getAABB();
   const boxA = {pos:{x:translateA[12] ,y:translateA[14]},
      half:{x:Math.abs(AABBa._max[0] - AABBa._min[0])*0.5,
         y:Math.abs(AABBa._max[2] - AABBa._min[2])*0.5}};

   const translateB = b.getTranslateMatrix();
   const AABBb = b.getAABB();
   const boxB = {pos:{x:translateB[12] ,y:translateB[14]},
      half:{x:Math.abs(AABBb._max[0] - AABBb._min[0])*0.5,
         y:Math.abs(AABBb._max[2] - AABBb._min[2])*0.5}};

   const dx = boxA.pos.x - boxB.pos.x;
   const px = (boxA.half.x + boxB.half.x) - Math.abs(dx);
   if (px <= 0) {
      return false;
   }

   const dy = boxA.pos.y - boxB.pos.y;
   const py = (boxA.half.y + boxB.half.y) - Math.abs(dy);
   if (py <= 0) {
      return false;
   }
   return true;
}

// Separating Axis Theorem

// 3d modeling
// Bezier Curve
function getPointOnBezierCurve(points, offset, t) {
  const invT = (1 - t);
  return v2.add(v2.mult(points[offset + 0], invT * invT * invT),
                v2.mult(points[offset + 1], 3 * t * invT * invT),
                v2.mult(points[offset + 2], 3 * invT * t * t),
                v2.mult(points[offset + 3], t * t  *t));
}
