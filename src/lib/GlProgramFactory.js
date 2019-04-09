import GlProgram from './GlProgram.js'
import {UNIFORM,ATTRIB} from './constants.js'
import {clone_array} from './utils.js'

export const TEXTURE = 0b1, COLOR = 0b10, WORLD_VIEW_PROJECT = 0b100, VERTEX_COLOR = 0b1000,WORLD_PROJECTION = 0b10000,POINT_LIGHT = 0b100000,DIRECTIONAL_LIGHT = 0b1000000,SPOT_LIGHT=0b10000000;

export default function GlProgramFactory(gl,bitmask){
   //const param = Object.assign({},defaultParam);
   // Copy
   const param = {};
   param['a_position'] = clone_array(defaultParam['a_position']);
   const vstxt = filterLine('v',
      defaultVertexVariables,defaultVertexStatements,param,bitmask,[0],[]);
   //console.log(vstxt);
   const fstxt = filterLine('f',
      defaultFragmentVariables,defaultFragmentStatements,param,bitmask,[0],[]);
   //console.log(fstxt);
   return new GlProgram(gl,vstxt,fstxt,param);
}

function filterLine(type,vlines,slines ,param,bitmask,defaultV,defaultS){
   const variable_code = [],statement_code =[];
   for(var i=0,l=defaultV.length;i<l;i++){
      variable_code.push(vlines[defaultV[i]]);
   }
   for(var i=0,l=defaultS.length;i<l;i++){
      statement_code.push(slines[defaultS[i]]);
   }

   for(var f in Features){
      //var deletekey;
      if(bitmask & f){//enable this feacture
         var idx = Features[f][type+'v+'];
         for(var i=0,l=idx==undefined?0:idx.length;i<l;i++){
            variable_code.push(vlines[idx[i]]);
         }
         idx = Features[f][type+'s+'];
         for(var i=0,l=idx==undefined?0:idx.length;i<l;i++){
            statement_code.push(slines[idx[i]]);
         }
         const p = Features[f]['p+'];
         for(var j=0,l=p==undefined?0:p.length;j<l;j++){
            param[p[j]] = clone_array(defaultParam[p[j]]);
         }
      }
   }
   return variable_code.join('\n')
      +'\nvoid main(){\n'
      +statement_code.join('\n')
      +'}';
}

//v:vertex,v:variables,s:statement,p:parameter,f:fragment
const Features = {};
Features[SPOT_LIGHT]={
   'vv+':[7,8,9,10,11,12,13,14],'vs+':[6,7,8,9],'fv+':[5,6,7,8,10,11,12],'fs+':[4,5,6,7,13,14,15,16,17,18,10,11],
   'p+':['u_viewWorldPosition','u_lightDirection','u_innerLimit','u_outerLimit','a_normal','u_world','u_lightWorldPosition','u_shininess','u_worldInverseTranspose'],
};
Features[WORLD_VIEW_PROJECT ]={
   'vv+':[3], 'vs+':[2], 
   'vs-':[0,5], 
   'p+':['u_worldViewProjection']
};
Features[POINT_LIGHT ]={
   'vv+':[7,8,9,10,11,12,13,14],
   'vs+':[6,7,8,9],
   'fv+':[5,6,7,8],
   'fs+':[4,5,6,7,8,9,10,11],
   //'fs-':[0,1,3], 
   'p+':['u_viewWorldPosition','a_normal','u_world','u_lightWorldPosition','u_shininess','u_worldInverseTranspose'],
};
Features[DIRECTIONAL_LIGHT ]={
   'vv+':[14,7,8], 'vs+':[9], 'fs+':[4,12,10],
   //'fs-':[8,12],
   'fv+':[9,6], 
   'p+':['a_normal','u_worldInverseTranspose','u_reverseLightDirection'],
   //'p-':['u_shininess'],
};
Features[TEXTURE ] = {
   'vv+':[1,2],'vs+':[1],
   'fv+':[1,2],'fs+':[0],
   'p+':['a_texCoord','u_image']
};
Features[COLOR ] = {
   'fv+':[3], 
   'fs+':[2], 
   'fs-':[0,1,3], 'vs-':[3],
   'p+':['u_color'],
   'p-':['u_image','v_texCoord']
};
Features[WORLD_PROJECTION] = {
   'vv+':[6],
   'vs+':[5],
   'vs-':[0,2],
   'p+':['u_worldProjection']
};
Features[VERTEX_COLOR ] = {
   'vv+':[4,5], 'vs+':[3], 'fv+':[4], 'fs+':[3], 
   'fs-':[0,1,2], 
   'p+':['a_color']
};
const defaultParam = {
   "a_position":  ["vec2",ATTRIB]
   ,"a_texCoord":["vec2",ATTRIB]
   ,"a_color":["vec2",ATTRIB]
   ,"u_image":["sampler2D",UNIFORM]
   ,"u_color":["vec4",UNIFORM]
   ,"u_worldViewProjection":["mat4",UNIFORM]
   ,"u_worldProjection":["mat4",UNIFORM]
   ,'u_lightWorldPosition':['vec3',UNIFORM]
   ,"u_world":["mat4",UNIFORM]
   ,"a_normal":["vec3",ATTRIB]
   ,'u_viewWorldPosition':["vec3",UNIFORM]
   ,'u_shininess':['float',UNIFORM]
   ,'u_worldInverseTranspose':['mat4',UNIFORM]
   ,'u_reverseLightDirection':['vec3',UNIFORM]
   ,"u_outerLimit":["float",UNIFORM]
   ,"u_innerLimit":["float",UNIFORM]
   ,"u_lightDirection":["vec3",UNIFORM]
};
const defaultVertexVariables = [
'attribute vec4 a_position;',
'attribute vec2 a_texCoord;',
'varying vec2 v_texCoord;',
'uniform mat4 u_worldViewProjection;',
'attribute vec3 a_color;',
'varying vec3 v_color;',
'uniform mat4 u_worldProjection;',
'attribute vec3 a_normal;',
'varying vec3 v_normal;',
'uniform vec3 u_lightWorldPosition;',
'uniform mat4 u_world;',
'varying vec3 v_surfaceToLight;',
'uniform vec3 u_viewWorldPosition;',
'varying vec3 v_surfaceToView;',
'uniform mat4 u_worldInverseTranspose;',
];
const defaultVertexStatements= [
'gl_Position = a_position;',
'v_texCoord = a_texCoord;',
'gl_Position = u_worldViewProjection * a_position;',
'v_color = a_color;',
'gl_PointSize = 8.0; ',
'gl_Position = u_worldProjection * a_position;',
'vec3 surfaceWorldPosition = (u_world * a_position).xyz;',
'v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;',
'v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;',
'v_normal= mat3(u_worldInverseTranspose) *a_normal;',
];
const defaultFragmentVariables = [
'precision mediump float;',
'uniform sampler2D u_image;',
'varying vec2 v_texCoord;',
'uniform vec4 u_color;',
'varying vec3 v_color;',
'varying vec3 v_surfaceToLight;',
'varying vec3 v_normal;',
'varying vec3 v_surfaceToView;',
'uniform float u_shininess;',
'uniform vec3 u_reverseLightDirection;',
'uniform vec3 u_lightDirection;',
'uniform float u_outerLimit;',
'uniform float u_innerLimit;',
];
const defaultFragmentStatements= [
'gl_FragColor =texture2D(u_image,v_texCoord);',
'gl_FragColor = vec4(1.0,1.0,1.0,1.0);',
'gl_FragColor = u_color;',
'gl_FragColor = vec4(v_color,1.0);',
'vec3 normal = normalize(v_normal);',
'vec3 surfaceToLightDirection = normalize(v_surfaceToLight);',
'vec3 surfaceToViewDirection = normalize(v_surfaceToView);',
'vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);',
'float light = dot(normal, surfaceToLightDirection);',
'float specular = step(0.0001,light) * pow(dot(normal, halfVector), u_shininess);',
'gl_FragColor.rgb *= light;',
'gl_FragColor.rgb += specular;',
'float light = dot(normal, u_reverseLightDirection);',
'float light = 0.0;',
'float specular = 0.0;',
'float dotFromDirection = dot(surfaceToLightDirection,-u_lightDirection);',
'float inLight = smoothstep(u_outerLimit, u_innerLimit, dotFromDirection);',
'light = inLight * dot(normal, surfaceToLightDirection);',
'specular = inLight * pow(dot(normal, halfVector), u_shininess);',
];
