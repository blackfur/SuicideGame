

//Pyramid
export default (function(){
        const clauses = {
            'drawArrays':[gl.TRIANGLE_FAN,0,defaultVertexes.length/6]
        };
        const s = new Sprite(gl,defaultAttribs,defaultUniforms,clauses);
        return s;
}());
