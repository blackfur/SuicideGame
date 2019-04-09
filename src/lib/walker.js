import GameTimer from './timer.js'
import {approach} from './game-math.js'
import Vector from './vector.js'
import {translate} from './m4.js'
import * as C from './constants.js'

const Walker = function(){
    const INIT = 0.4,ACCELERATION = 0.16 ,GOAL = 0.8;
    function _(s){
        this._sprite = s;
        document.body.addEventListener('keydown', onkeydown.bind(this));
        document.body.addEventListener('keyup', onkeyup.bind(this));
        this._timer= new GameTimer(C.FPS);
        this._velocity = new Vector();
        this._movement = new Vector();
        this._goal = {x:0,z:0};
    }
    function onkeyup (et){
        if(et.keyCode == 72
            ||et.keyCode ==76
        ){//left,h
            //right,l
            this._goal.x = 0;
        }else if(et.keyCode ==75
            ||et.keyCode ==74){//up,j
            //down,k
            this._goal.z = 0;
        }
    }

    function onkeydown(et){
        if(et.keyCode == 72
            ||et.keyCode ==76
            ||et.keyCode ==75
            ||et.keyCode ==74
        ){
            this._timer.enable();
        }
        if(et.keyCode == 72){//left,h
            if(this._goal.x == -GOAL)
                return;
            this._movement.x = -INIT;
            this._goal.x = -GOAL;
        }else if(et.keyCode ==76){//right,l
            if(this._goal.x == GOAL)
                return;
            this._movement.x = INIT;
            this._goal.x = GOAL;
        }else if(et.keyCode ==75){//forward,k
            if(this._goal.z == -GOAL)
                return;
            this._movement.z = -INIT;
            this._goal.z = -GOAL;
        }else if(et.keyCode ==74){//backward,j
            if(this._goal.z == GOAL)
                return;
            this._movement.z = INIT;
            this._goal.z = GOAL;
        }else{
            return;
        }
        this._timer.loop(move.bind(this));
    }
    function move(){
        const worldMatrix = this._sprite.getWorldMatrix(); 
        translate(worldMatrix,this._velocity.x,0,this._velocity.z,worldMatrix);
        if(this._movement.x!=this._goal.x){
            const r = approach(this._goal.x,this._movement.x,ACCELERATION);
            this._movement.x = r;
        }
        if(this._movement.z!=this._goal.z)
            this._movement.z = approach(this._goal.z,this._movement.z,ACCELERATION);
        if(this._movement.x ==0 && this._movement.z ==0){
            this._timer.stop();
        }
        //const up = {x:0,y:1,z:0};
        // calculte forward/right direction vector using cross product
        //var right = cross(up,forward);

        // Use cameraMatrix to get real time direction vector
        const cameraMatrix = this._sprite._scene.getCameraMatrix();
        var forward = new Vector(cameraMatrix[0],cameraMatrix[1],cameraMatrix[2]);
        forward.normalize();
        var right = new Vector(cameraMatrix[8],cameraMatrix[9],cameraMatrix[10]);
        right.normalize();
        // real time translation
        this._velocity =right.multiply(this._movement.z).add(forward.multiply(this._movement.x));
    }
    return _;
}();
export default Walker;
export function moveByKeyboard(sprite){
   return new Walker(sprite);
}
