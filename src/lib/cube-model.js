import {FLOAT} from './constants.js'

export function defaultClauses (gl){
   return { 'drawArrays':[gl.TRIANGLES,0,defaultVertexes.length/3] };
} 
export function defaultUniforms(){
   return { 'u_color':[1,0,0,1] };
};
export const defaultVertexes = [
   //front
   -0.5,-0.5,0.5,
   0.5,-0.5,0.5,
   -0.5,0.5,0.5,

   -0.5,0.5,0.5,
   0.5,-0.5,0.5,
   0.5,0.5,0.5,
   //right
   0.5,0.5,0.5,
   0.5,-0.5,0.5,
   0.5,-0.5,-0.5,  

   0.5,-0.5,-0.5,  
   0.5,0.5,-0.5,   
   0.5,0.5,0.5,
   //back
   0.5,-0.5,-0.5,  
   -0.5,-0.5,-0.5, 
   0.5,0.5,-0.5,   

   0.5,0.5,-0.5,   
   -0.5,-0.5,-0.5, 
   -0.5,0.5,-0.5,  
   //left
   -0.5,0.5,-0.5,  
   -0.5,-0.5,-0.5, 
   -0.5,-0.5,0.5,

   -0.5,-0.5,0.5,
   -0.5,0.5,0.5,
   -0.5,0.5,-0.5,  
   //top
   -0.5,0.5,-0.5,  
   -0.5,0.5,0.5,
   0.5,0.5,0.5,

   0.5,0.5,0.5,
   0.5,0.5,-0.5,   
   -0.5,0.5,-0.5,  
   //bottom
   -0.5,-0.5,0.5,
   -0.5,-0.5,-0.5, 
   0.5,-0.5,0.5,

   0.5,-0.5,0.5,
   -0.5,-0.5,-0.5, 
   0.5,-0.5,-0.5,  
];
export const defaultNormals = [
   //front
   0,0,1,
   0,0,1,
   0,0,1,

   0,0,1,
   0,0,1,
   0,0,1,
   //right
   1,0,0,
   1,0,0,
   1,0,0,

   1,0,0,
   1,0,0,
   1,0,0,
   //back
   0,0,-1,
   0,0,-1,
   0,0,-1,

   0,0,-1,
   0,0,-1,
   0,0,-1,
   //left
   -1,0,0,
   -1,0,0,
   -1,0,0,

   -1,0,0,
   -1,0,0,
   -1,0,0,
   //top
   0,1,0,
   0,1,0,
   0,1,0,

   0,1,0,
   0,1,0,
   0,1,0,
   //bottom
   0,-1,0,
   0,-1,0,
   0,-1,0,

   0,-1,0,
   0,-1,0,
   0,-1,0,
];
export const defaultTexcoords = [
   0, 0,
   0, 1,
   1, 0,
   0, 1,
   1, 1,
   1, 0,

   0, 0,
   0, 1,
   1, 0,
   1, 0,
   0, 1,
   1, 1,

   0, 0,
   0, 1,
   1, 0,
   0, 1,
   1, 1,
   1, 0,

   0, 0,
   0, 1,
   1, 0,
   1, 0,
   0, 1,
   1, 1,

   0, 0,
   0, 1,
   1, 0,
   0, 1,
   1, 1,
   1, 0,

   0, 0,
   0, 1,
   1, 0,
   1, 0,
   0, 1,
   1, 1
];
export const defaultColors = [
   1,1,0,
   1,1,0,
   1,1,0,

   1,0,0,
   1,0,0,
   1,0,0,

   0,0,1,
   0,0,1,
   0,0,1,

   0,0,1,
   0,0,1,
   0,0,1,

   1,0,0,
   1,0,0,
   1,0,0,

   1,0,0,
   1,0,0,
   1,0,0,

   0,0,1,
   0,0,1,
   0,0,1,

   0,0,1,
   0,0,1,
   0,0,1,

   0,1,0,
   0,1,0,
   0,1,0,

   0,1,0,
   0,1,0,
   0,1,0,

   0,0,1,
   0,0,1,
   0,0,1,

   0,0,1,
   0,0,1,
   0,0,1,
];
export function defaultAttribs(){
   return {
      'a_position':[3,FLOAT,false,3*Float32Array.BYTES_PER_ELEMENT,0,defaultVertexes],
      //'a_color':[3,FLOAT,false,3*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT,defaultColors],
      'a_normal':[3,FLOAT,false,3*Float32Array.BYTES_PER_ELEMENT,0,defaultNormals]
   };
}; 