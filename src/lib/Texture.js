import Param from './param.js'
import {extendNotOverride} from './utils.js'
import {execOrderly} from './GlProgram.js'

export default function Texture(gl,uniforms,clauses,textureUnit){
   this.texture = gl.createTexture();
   this.uniforms = uniforms || {};
   textureUnit = textureUnit || 0;
   gl.activeTexture(gl.TEXTURE0+textureUnit);
   this.uniforms['u_image'] = textureUnit;

   gl.bindTexture(gl.TEXTURE_2D, this.texture);
   execOrderly(gl,clauses);
   // Set the parameters so we can render any size image.
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

   // Upload the image into the texture.
   //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
   this.clauses = [
      { 
         'activeTexture': gl.TEXTURE0+textureUnit,
         'bindTexture':[gl.TEXTURE_2D, this.texture]
      }
   ];
}
Texture.prototype = Object.create(Param.prototype);
Texture.prototype.constructor = Texture;
