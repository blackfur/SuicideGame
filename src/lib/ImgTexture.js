import Texture from './Texture.js'

export default function ImgTexture(gl,img){
   // Upload the image into the texture.
   const clauses = [
      {
         pixelStorei:[gl.UNPACK_FLIP_Y_WEBGL, true],
      },
      {
         texImage2D:[gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img],
         texParameteri:[gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR]
      },{
         texParameteri:[gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR]
      }
   ];
   Texture.call(this,gl,null,clauses);
}
ImgTexture.prototype = Object.create(Texture.prototype);
ImgTexture.prototype.constructor = ImgTexture;
