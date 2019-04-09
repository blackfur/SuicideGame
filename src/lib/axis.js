import Sprite from './sprite.js'

//Axis
export default (function(){
    function _(gl){
        const clauses = { 'drawArrays':[gl.LINES,0,defaultVertexes.length/3] };
        const s= new Sprite(gl,defaultAttribs,defaultUniforms,clauses);
        return s;
    }
    const defaultVertexes = [
        //position,   
        -128,0,0,     
        128,0,0,      
        0,-128,0,     
        0,128,0,      
        0,0,-128,     
        0,0,128,      
    ];
    /*const defaultColors = [
        //color
        0,0,0,
        0,0,0,//x
        0,0,0,
        0,0,0,//z
        0,0,0,
        0,0,0,//y
    ];*/
const defaultUniforms = {
    'u_color':[0,0,0,1]
};
    const defaultAttribs= {
        'a_position':[3,"FLOAT",false,3*Float32Array.BYTES_PER_ELEMENT,0,defaultVertexes],
        //'a_color':[3,"FLOAT",false,3*Float32Array.BYTES_PER_ELEMENT,0,defaultColors],
    };
    return _;
}());
