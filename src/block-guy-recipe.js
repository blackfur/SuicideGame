import {defaultAttribs,defaultClauses,defaultUniforms} from './lib/cube-model.js'
import Recipe from './lib/recipe.js'

const SPEED = 0.0016;
export default function BlockGuy(gl){
   this._graph = { 'waist':{
            transform:[[0,3,0]],
            children: {
               torso:{
                  transform:[[0,2,0]],
                  children:{
                     neck:{
                        transform:[[0,1,0]], 
                        children:{
                           head:{
                              transform:[[0,1,0]]
                           }
                        }
                     }
                     , 'left-arm':{
                        transform:[[-1,0,0]],
                        children: {
                           'left-forearm':{
                              transform:[[-1,0,0]]
                              ,children: {
                                 'left-hand':{
                                    transform:[[-1,0,0]]
                                 }
                              }
                           }
                        }
                     }
                     , 'right-arm':{
                        transform:[[1,0,0]]
                        ,children: {
                           'right-forearm':{
                              transform:[[1,0,0]]
                              ,children: {
                                 'right-hand':{
                                    transform:[[1,0,0]]
                                 }
                              }
                           }
                        }
                     }
                  } 
               }
               , 'left-leg':{
                  transform:[[-1,-1,0]]
                  ,children: {
                     'left-calf':{
                        transform:[[0,-1,0]]
                        ,children: {
                           'left-foot':{
                              transform:[[0,-1,0]]
                           }
                        }
                     }
                  }
               }
               , 'right-leg':{
                  transform:[[1,-1,0]],
                  children: {
                     'right-calf':{
                        transform:[[0,-1,0]]
                        ,children: {
                           'right-foot':{
                              transform:[[0,-1,0]]
                           }
                        }
                     }
                  }
               }
            }
         }
      } ;
   setParam(gl,this._graph);
};
BlockGuy.prototype = Object.create(Recipe.prototype);
BlockGuy.prototype.constructor = BlockGuy;
BlockGuy.prototype.skills = {
   run : function(time){
      const c= SPEED*time;
      const root= Math.abs(Math.sin(c));
      const leg= Math.sin(c);
      const calf= Math.sin(c + 0.1) * 0.4;
      const headr0= Math.cos(c * 2) * 0.4;
      const headr1= Math.sin(c + 0.5) * 0.4;
      const neckr1= Math.sin(c + 0.25) * 0.4;
      const torsor1= Math.sin(c) * 0.4;
      const waistr1= Math.sin(c) * 0.4;
      const handr2= Math.sin(c - 0.1) * 0.4;
      const forearmr2= Math.sin(c + 0.1) * 0.4;
      const armr2= Math.sin(c) * 0.4;
      const footr0= Math.sin(c + 0.1) * 0.4;
      return {
         'root':    [[0,root,0],[0,0,0],            [1,1,1]],
         'left-leg':[[leg,0,0], [0,0,0],            [1,1,1]],
         'right-leg':[[-leg,0,0],[0,0,0],            [1,1,1]],
         'left-calf':[[0,-1,0],   [0,0,0],            [1,1,1]],
         'right-calf':[[0,-1,0],   [0,0,0],            [1,1,1]],
         'left-foot':[[0,-1,0],   [footr0,0,0],       [1,1,1]],
         'right-foot':[[0,1,0],   [footr0,0,0],       [1,1,1]],
         'left-arm':[[-1,0,0],   [0,0,armr2],        [1,1,1]],
         'right-arm':[[1,0,0],   [0,0,armr2],        [1,1,1]],
         'left-forearm':[[-1,0,0],   [0,0,forearmr2],    [1,1,1]],
         'right-forearm':[[1,0,0],   [0,0,forearmr2],    [1,1,1]],
         'left-hand':[[-1,0,0],   [0,0,handr2],       [1,1,1]],
         'right-hand':[[1,0,0],   [0,0,handr2],       [1,1,1]],
         'waist':[[0,3,0],   [0,waistr1,0],      [1,1,1]],
         'torso':[[0,2,0],   [0,torsor1,0],      [1,1,1]],
         'neck':[[0,1,0],   [0,neckr1,0],       [1,1,1]],
         'head':[[0,1,0],   [headr0,headr1,0],  [1,1,1]],
      };
   }};
function setParam(gl,graph){
   for(var k in graph){
      const atom = graph[k];
      atom.attribs = defaultAttribs();
      atom.clauses = defaultClauses(gl);
      atom.uniforms = defaultUniforms();
      setParam(gl,atom.children);
   }
}
