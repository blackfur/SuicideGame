import {transpose,multiply,inverse} from './m4.js' 
import Param from './param.js'
import Ghost from './ghost.js'
import Graph from './graph.js'
import {TRIANGLES,ATTRIB_BUFFER,ATTRIB_VERTEXES} from './constants.js'
import AABB,{LEN} from './AABB.js'
import Vector from './vector.js'
import {SHINY}from './light.js'
import {DIRECTIONAL_LIGHT} from './GlProgramFactory.js'

//Sprite 
export default function Sprite(gl,attribs,uniforms,clauses
   //  ,prefs
   ,indices
){
   this._size = {x:LEN,y:LEN,z:LEN};
   this._attribs = attribs;
   //this.prefs = {};
   vertexData.call(this,gl,attribs);
   this.uniforms = uniforms || {};
   this.clauses = [];
   //indices
   if(indices !=undefined){
      const indicesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer );
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      this.clauses.push({
         bindBuffer:[gl.ELEMENT_ARRAY_BUFFER,indicesBuffer],
      });
   }
   this.clauses = this.clauses.concat(defaultClauses,clauses);
}
Sprite.prototype = Object.create(Param.prototype);
Object.assign(Sprite.prototype.__proto__,Object.create(Ghost.prototype).__proto__);
Object.assign(Sprite.prototype.__proto__,Object.create(Graph.prototype).__proto__);
Sprite.prototype.constructor = Sprite;
Sprite.prototype.getAABB = function(){
   const m= this.getWorldMatrix();
   return new AABB(this._size.x,this._size.y,this._size.z).transform(m);
};
Sprite.prototype.getaabb = function(){
   const a= this.getAABB();
   return [ a._min, a._max ];
};
Sprite.prototype.vertexData = vertexData;
function vertexData(gl,attribs){
   const processed = {};
   for(var attr in attribs){
      const a= attribs[attr]
      const vertexes = a[ATTRIB_VERTEXES];
      if(vertexes==undefined)
         continue;
      // Multiple attrib may use one vertexes buffer
      var buffer = processed[vertexes];
      if(buffer==undefined){
         buffer= gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
         gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);
         gl.bindBuffer(gl.ARRAY_BUFFER,null);
         processed[vertexes] = buffer;
      }
      a[ATTRIB_BUFFER]= buffer;
   }
}
Sprite.prototype.getRotateMatrix = Ghost.prototype.getRotateMatrix;
Sprite.prototype.getTranslateMatrix= Ghost.prototype.getTranslateMatrix;
Sprite.prototype.getScaleMatrix= Ghost.prototype.getScaleMatrix;
function getUniforms(){
   const m =this._scene.getViewProjectionMatrix();
   m!=null &&(this.uniforms['u_worldViewProjection'] = multiply(m,this.getGlobalMatrix()));
   return this.uniforms;
}
Sprite.prototype.getUniforms = getUniforms;
const defaultClauses = [];
const defaultPrefs = {
   drawMethod:'drawArrays'
   ,drawMode:TRIANGLES
   ,stride:9
};
Sprite.prototype.attach = function(scene){
   this._scene = scene;
}
Sprite.prototype.enable = function(bitmask){
   const scope = this;
   if(bitmask & SHINY){
      scope.getUniforms = function(){
         const uniforms = getUniforms.call(scope);
         const worldMatrix = this.getGlobalMatrix();
         uniforms['u_world'] = worldMatrix; 
         uniforms['u_worldInverseTranspose']=transpose(inverse(worldMatrix));
         return uniforms;
      }
   }else if(bitmask &DIRECTIONAL_LIGHT){
      scope.getUniforms = function(){
         const uniforms = getUniforms.call(scope);
         const worldMatrix = this.getGlobalMatrix();
         uniforms['u_worldInverseTranspose']=transpose(inverse(worldMatrix));
         return uniforms;
      }
   }
}
