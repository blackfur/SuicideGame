import {ATTRIB_BUFFER,OFFSET,STRIDE,NORMALIZE,VertexAttribPointers_DATATYPE,SIZE,UNIFORM,LOCATION,TYPE,DATATYPE} from './constants.js';
import {createProgramFromSources,extendNotOverride} from './utils.js'

export default function GlProgram(gl,vertex_shader_txt,fragment_shader_txt,param){
   this.program = createProgramFromSources(gl, [vertex_shader_txt, fragment_shader_txt],null,null,null);
   this.param = param;
   extendNotOverride(this.param,defaultParam);
   for(var k in param){
      const p= param[k];
      if(p[TYPE]==UNIFORM){
         p[LOCATION] =gl.getUniformLocation(this.program,k);
      }else{
         p[LOCATION] =gl.getAttribLocation(this.program,k);
      }
      if(p[LOCATION]<0){
         throw ':getLocation error:'+k+':'+p[LOCATION];
      }
   }
}
function setUniform(gl,datatype,location,value){
   if(datatype == "vec3" ){
      gl.uniform3fv(location, value);
   }else if(datatype == "float"){
      gl.uniform1f(location, value);
   }else if(datatype == "vec4"){
      gl.uniform4fv(location, value);
   }else if(datatype == "mat4"){
      gl.uniformMatrix4fv(location,false,value);
   }else if(datatype =="sampler2D"){
      gl.uniform1i(location,value);
   }else if(datatype=='vec2'){
      gl.uniform2fv(location, value);
   }else if(datatype=='float[]'){
      gl.uniform1fv(location, value);
   }else{
      throw 'setUniform: '+datatype+' unsupported!';
   }
}
//exec,clauses:[{'':[],'':''},{'':''}]
export function execOrderly(gl,clauses){
   for(var i=0,l=clauses.length;i<l;i++ ){
      exec(gl,clauses[i]);
   }
}
//clauses:{'':[],'':''}
function exec(gl,clauses){
   for(var k in clauses){
      const a= clauses[k];//argv
      if(Array.isArray(a)){
         gl[k].apply(gl,a);
      }else{
         gl[k].call(gl,a);
      }
   }
}
function set(gl,key,value){
   var type,properties,datatype,location;
   try{
      properties = this.param[key];
      datatype = properties[DATATYPE];
      type= properties[TYPE];
      location = properties[LOCATION];
   }catch(err){
      console.log(err);
      throw err;
   }
   if(type == UNIFORM){
      setUniform(gl,datatype,location,value);
   }else{
      throw 'GlProgram.set should accept a uniform value!';
   }
}
GlProgram.prototype.set = set;
GlProgram.prototype.display = function(gl,scene){
   gl.useProgram(this.program);
   //clauses
   const clauses = scene.getClauses();
   clauses && clauses.length>0 && execOrderly.call(this,gl,clauses);
   // uniforms
   //setUniforms.call(this,scene.getUniforms());
   // sprites have their own attribs and uniforms
   const sprites = scene.sprites;
   for(var i = 0,l = sprites.length;i<l;i++){
      this.summon(gl,sprites[i]);
   }
}
//set multiple uniforms
function setUniforms(gl,uniforms){
   if(uniforms==undefined) return;
   for(var key in uniforms){
      const properties = this.param[key];
      if(properties==undefined ) throw 'setUniforms: '+key+' not found!';
      const datatype = properties[DATATYPE];
      const location = properties[LOCATION];
      const value = uniforms[key];
      setUniform(gl,datatype,location,value);
   }
}
function setAttrib(gl,attrib,par){
   const location = par[LOCATION];
   const size= attrib[SIZE];
   const datatype = attrib[VertexAttribPointers_DATATYPE];
   const normalize= attrib[NORMALIZE];
   const stride= attrib[STRIDE];
   const offset= attrib[OFFSET];
   const buffer = attrib[ATTRIB_BUFFER];
   gl.enableVertexAttribArray(location);
   if(buffer ==undefined) { throw 'buffer undefined:'+par+':'+attrib; }
   gl.bindBuffer(gl.ARRAY_BUFFER,  buffer);
   gl.vertexAttribPointer(location, size, gl[datatype], normalize, stride, offset)
   gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
function setAttribs(gl,vAttrPs,sprite){
   for(var att in vAttrPs){
      const par= this.param[att];
      if(par==undefined) {
         console.error(sprite);
         throw 'setAttrib: attrib not found: '+att;
      }
      setAttrib.call(this,gl,vAttrPs[att],par,sprite);
   }
}
function prepare(gl,sprite){
   // input uniforms
   setUniforms.call(this,gl,sprite.getUniforms());
   // input attributes
   setAttribs.call(this,gl,sprite.getAttribs(),sprite);
}
GlProgram.prototype.prepare = prepare;
GlProgram.prototype.summon= function(gl,sprite){
   if(sprite.getUniforms()==null && sprite.getAttribs()==null
      && sprite.getClauses()==null)
      return;
   gl.useProgram(this.program);
   setUniforms.call(this,gl,sprite.getUniforms());
   setAttribs.call(this,gl,sprite.getAttribs(),sprite);
   const clauses = sprite.getClauses();
   clauses && clauses.length>0 &&execOrderly.call(this,gl,clauses);
}
const defaultParam = {};
