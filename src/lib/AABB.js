import Vector from './vector.js'
import {transformPoint} from './m4.js'

export const LEN = 1, HALF = LEN*0.5; 
//AABB
export default (function(){
    function _(x,y,z){
        const halfx = x==undefined?HALF:x/2;
        const halfy = y==undefined?HALF:y/2;
        const halfz = z==undefined?HALF:z/2;
        this._min = [-halfx,-halfy,halfz];
        this._max = [halfx,halfy,-halfz];
    }
    _.prototype.transform = function(matrix){
        transformPoint(matrix,this._max,this._max);
        transformPoint(matrix,this._min,this._min);
        return this;
    };
    return _;
}());
