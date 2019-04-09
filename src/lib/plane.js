import Sprite from './sprite.js'
export default (function(){
    function _(gl){
        const clauses = {
            'drawArrays':[gl.TRIANGLES,0,defaultVertexes.length/3]
        };
        const defaultAttribs= {
            'a_position':[3,"FLOAT",false,3*Float32Array.BYTES_PER_ELEMENT,0,defaultVertexes],
            //'a_color':[3,"FLOAT",false,3*Float32Array.BYTES_PER_ELEMENT,0,defaultColors],
        };
        const defaultUniforms = { 'u_color':[0.2,0.1,0.4,1] };
        const s= new Sprite(gl,defaultAttribs,defaultUniforms,clauses);
        s._size = {x:32,y:0,z:32};
        return s;
    }
    const defaultVertexes = [
        //position               
        -16,0,-16,               
        16,0,16,                 
        16,0,-16,                

        16,0,16,                 
        -16,0,-16,               
        -16,0,16,                
    ];
    /*const defaultColors = [
    //color
0.2,0.1,0.4,
0.2,0.1,0.4,
0.2,0.1,0.4,

0.2,0.1,0.4,
0.2,0.1,0.4,
0.2,0.1,0.4,
    ];*/

    return _;
}());
