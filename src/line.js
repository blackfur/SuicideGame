import Sprite from './lib/sprite.js'

// Create A Line
export default (function(){
    function _(gl,start, end){
        const defaultVertexes = [
            start.x,start.y,start.z,0,0,1,
            end.x,end.y,end.z,0,0,1
        ];
        const defaultAttribs= {
            'a_position':[3,"FLOAT",false,6*Float32Array.BYTES_PER_ELEMENT,0,defaultVertexes],
            'a_color':[3,"FLOAT",false,6*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT,defaultVertexes],
        };
        const clauses = { 'drawArrays':[gl.LINES,0,defaultVertexes.length/6] };
        const s= new Sprite(gl,defaultAttribs,null,clauses);
        return s;
    }
    return _;
}());
