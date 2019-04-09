import Texture from './Texture.js'

export default function DataTexture(gl,data){
   const clauses = [
      {
         //alignment
         pixelStorei:[gl.UNPACK_ALIGNMENT, 1]
      },
      {
         // level=0,internal format=gl.LUMINANCE,width=3,height=2,border=0,format=gl.LUMINANCE,type=gl.UNSIGNED_BYTE
         texImage2D:[gl.TEXTURE_2D, 0, gl.LUMINANCE,3,2,0,gl.LUMINANCE,gl.UNSIGNED_BYTE,new Uint8Array(data)],
         texParameteri:[gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST]
      },
      {
         texParameteri:[gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST]
      }
   ];   
   Texture.call(this,gl,null,clauses);
}
DataTexture.prototype = Object.create(Texture.prototype);
DataTexture.prototype.constructor = DataTexture;
