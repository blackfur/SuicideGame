import Param from './param.js'
import Ghost from './ghost.js'
import Sprite from './sprite.js'
import Graph from './graph.js'
import {identity}from './m4.js'
import {xRotation,yRotate,zRotate,scaling,translation} from './m4.js'

export default function Model(gl,recipe){
   const graph =recipe.graph(),skills = recipe.skills;
   this._joints = {};
   //this._children = [];
   const _graph = {children:graph};
   const self = assemble.call(this,gl,'root',_graph);
   Object.assign(this,self);

   for(var k in skills){
      const skill = skills[k];
      this[k] = fire.bind(null,skills[k],this._joints);
   }
};
function fire(skill,joints,time){
   const jointMovement = skill(time);
   for(var k in jointMovement){
      const joint = joints[k];
      const transform = jointMovement[k];
      translation(transform[0][0],transform[0][1],transform[0][2],joint.getTranslateMatrix());
      const rmx = joint.getRotateMatrix();
      xRotation(transform[1][0],rmx);
      yRotate(rmx,transform[1][1],rmx);
      zRotate(rmx,transform[1][2],rmx);
      //scaling(transform[2][0],transform[2][1],transform[2][2],joint.getScaleMatrix());
   }
}
function assemble(gl,key,joint){
   var s;
   if(joint.attribs !=null){
      s = new Sprite(gl,joint.attribs,joint.uniforms,joint.clauses,joint.indices);
   }else
      s = new Ghost();

   this._joints[key] = s;
   const transf= joint.transform;
   transf && translation(transf[0][0],transf[0][1],transf[0][2],s.getTranslateMatrix());
   const graph= joint.children;
   for(var i in graph){
      const child = assemble.call(this,gl,i,graph[i]);
      s.adopt(child);
   }
   return s;
}
Model.prototype = Object.create(Param.prototype);
Object.assign(Model.prototype.__proto__,Object.create(Graph.prototype).__proto__);
Model.prototype.constructor = Model;
Model.prototype.useProgram = function(prog){
   var joints = this._joints;
   for(var k in joints)
      joints[k].useProgram && joints[k].useProgram(prog);
};
Model.prototype.enable = function(bitmask){
   var joints = this._joints;
   for(var k in joints)
      joints[k].enable && joints[k].enable(bitmask);
}
