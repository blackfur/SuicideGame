import Sprite from './sprite.js'

// Create A Line
export default (function(){
    function _(gl,start, end){
        const defaultVertexes = [
            start.x,start.y,start.z,
            end.x,end.y,end.z,
        ];
        const defaultAttribs= {
            'a_position':[3,"FLOAT",false,3*Float32Array.BYTES_PER_ELEMENT,0,defaultVertexes],
            //'a_color':[3,"FLOAT",false,3*Float32Array.BYTES_PER_ELEMENT,0,defaultColors],
        };
        const defaultUniforms = { 'u_color':[1,0,0,1] };
        const clauses = { 'drawArrays':[gl.LINES,0,defaultVertexes.length/3] };
        const s= new Sprite(gl,defaultAttribs,defaultUniforms,clauses);
        return s;
    }
    const defaultColors = [
        0,0,1,
        0,0,1,
    ];
    return _;
}());
