import Sprite from './lib/sprite.js'
import Texture from './lib/Texture.js'
import * as C from './lib/constants.js'

// Create Susan
export default (function(){
    function _(gl,SusanModel,png){

	const susanVertices = SusanModel.meshes[0].vertices;
	const susanIndices = [].concat.apply([], SusanModel.meshes[0].faces);
	const susanTexCoords = SusanModel.meshes[0].texturecoords[0];

    const defaultAttribs = {
        'a_position':[3,C.FLOAT,false,3*Float32Array.BYTES_PER_ELEMENT,0,susanVertices ],
        'a_texCoord':[2,C.FLOAT,false,2*Float32Array.BYTES_PER_ELEMENT,0,susanTexCoords],
    };
        const tex = new Texture(gl,png,null,null,null);
        
        const clauses = tex.getClauses().concat({ 'drawElements':[gl.TRIANGLES,susanIndices.length,gl.UNSIGNED_SHORT, 0], });
        const susan= new Sprite(gl,defaultAttribs,defaultUniforms,clauses,susanIndices);
        return susan;
    }

    const defaultUniforms = {
        //'u_color':[1,0,0,1]
    };
    const defaultVertexes = [];
    return _;
}());
