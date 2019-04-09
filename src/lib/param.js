export default function Param() {};
Param.prototype.getUniforms = function(){
   return this.uniforms || this._uniforms;
}
function getClauses(){
   return this.clauses || this._clauses;
}
Param.prototype.getClauses  = getClauses;
Param.prototype.getAttribs= function(){
   return this._attribs;
};
Param.prototype.useProgram = function(prog){
   this._program = prog;
};
