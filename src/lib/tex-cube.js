import Sprite from './sprite.js'
import {defaultVertexes,defaultTexcoords,defaultClauses} from './cube-model.js'
import Vector from './vector.js'
import {FLOAT} from './constants.js'

export default function TexCube(gl){
   //size, type, normalize,stride,offset
   const attribs = {
      'a_position':[3,FLOAT,false,3*Float32Array.BYTES_PER_ELEMENT,0,defaultVertexes],
      'a_texCoord':[2,FLOAT,false,0,0,defaultTexcoords],
   };
   Sprite.call(this,gl,attribs,null,defaultClauses(gl));
}
TexCube.prototype = Object.create(Sprite.prototype);
TexCube.constructor = TexCube;
