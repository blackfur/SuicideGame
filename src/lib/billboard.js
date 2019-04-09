import GameTimer from './timer.js'
//import GlProgramFactory from './GlProgramFactory.js'
import Texture from './Texture.js'
import Sprite from './sprite.js'
import Vector from './vector.js'
import {FPS,ATTRIB_BUFFER,FLOAT,ATTRIB_VERTEXES} from './constants.js'

//billboard
export default (function(){
   function Billboard(gl,png,scene){

      const defaultVertexes = [
         -1, 2*png.height/png.width, -0, 
         -1, 0, -0, 
         1, 2*png.height/png.width, 0, 
         1, 0, 0,
      ];
      const defaultAttribs = {
         'a_position':[3,FLOAT,false,3*Float32Array.BYTES_PER_ELEMENT,0,defaultVertexes],
         'a_texCoord':[2,FLOAT,false,2*Float32Array.BYTES_PER_ELEMENT,0,defaultTexCoords],
      };

      const tex = new Texture(gl,png,null,null,null);
      const clauses = tex.getClauses().concat({
         //viewport:[0, 0, png.width, png.height],
         drawArrays:[gl.TRIANGLE_STRIP,0,4]
      });
      const billboard = new Sprite(gl,defaultAttribs,null,clauses,null);
      billboard.attach(scene);

      const tm = new GameTimer(FPS);
      tm.loop(function(){
         if(billboard._scene == undefined)
            return;
         const m = billboard._scene.getCameraMatrix();
         const right = new Vector(m[0],m[1],m[2]);
         right.normalize();
         const vertexes = [
            -right.x,2*png.height/png.width,-right.z,
            -right.x,0,-right.z,
            right.x, 2*png.height/png.width,right.z,
            right.x, 0,right.z,
         ];
         //console.log(vertexes);
         const buffer= gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
         gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);
         gl.bindBuffer(gl.ARRAY_BUFFER,null);
         billboard._attribs['a_position'][ATTRIB_VERTEXES] = vertexes;
         billboard._attribs['a_position'][ATTRIB_BUFFER] = buffer;
      });

      return billboard;
   }
   const defaultTexCoords = [
      0,1,
      0,0,
      1,1,
      1,0,
   ];
   return Billboard;
}());
