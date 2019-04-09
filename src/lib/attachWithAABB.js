import Sprite from './sprite.js'
import {multiply,scaling} from './m4.js'
import {defaultClauses,defaultAttribs,defaultVertexes,defaultNormals} from './cube-model.js'

export function attachWithAABB(gl,sprite){
    const attribs = Object.assign({},defaultAttribs);
    const uniforms = {'u_color':[1,0,0,0.4]};
    const AABB_cube = new Sprite(gl,attribs,uniforms,defaultClauses(gl));

    const scale2sprite_size = scaling(sprite._size.x,sprite._size.y+1,sprite._size.z);

    AABB_cube.getRotateMatrix = AABB_cube.getRotateMatrix.bind(sprite);
    AABB_cube.getTranslateMatrix= AABB_cube.getTranslateMatrix.bind(sprite);
    AABB_cube.getScaleMatrix= function(){
        return multiply(sprite.getScaleMatrix(),scale2sprite_size);
    };

    return AABB_cube;
};
