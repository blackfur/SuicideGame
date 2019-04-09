import {xRotate,yRotate,zRotate} from './m4.js'
import GameTimer from './timer.js'
import {FPS} from './constants.js'

const SPEED = 16;
const ZERO = {x:0,y:0,z:0};
const UP= {x:SPEED*Math.PI/180,y:0,z:0};
const DOWN= {x:-SPEED*Math.PI/180,y:0,z:0};
const RIGHT=  {x:0,y:-SPEED*Math.PI/180,z:0};
const LEFT= {x:0,y:SPEED*Math.PI/180,z:0}; 
const ROLL_RIGHT=  {x:0,y:0,z:-SPEED*Math.PI/180};
const ROLL_LEFT= {x:0,y:0,z:SPEED*Math.PI/180}; 

export function Observer(s){
    this._scene = s;
    document.body.addEventListener('keydown', onkeydown.bind(this));
    document.body.addEventListener('keyup', onkeyup.bind(this));
    this._rotation = ZERO;
    this._timer = new GameTimer(FPS);
}
function onkeyup (et){
    if(et.keyCode == 65 ||et.keyCode ==83
        ||et.keyCode ==68
        ||et.keyCode ==70||et.keyCode ===87 || et.keyCode ===69
    ){
        this._timer.stop();
        this._rotation= ZERO;
    }
}

function onkeydown(et){
    if(et.keyCode == 65 ||et.keyCode ==83
        ||et.keyCode ==68
        ||et.keyCode ==70||et.keyCode ==87||et.keyCode ==69
    ){ this._timer.enable(); }
    else
        return;

    if(et.keyCode == 65){//left,a
        this._rotation = LEFT;
    }else if(et.keyCode ==83){//up,s
        this._rotation = UP;
    }else if(et.keyCode ==68){//down,d
        this._rotation = DOWN;
    }else if(et.keyCode ==70){//right,f
        this._rotation = RIGHT;
    }else if(et.keyCode ==87){//roll left,w
        this._rotation = ROLL_LEFT;
    }else if(et.keyCode ==69){//roll right,w
        this._rotation = ROLL_RIGHT;
    } else{
        return;
    }
    this._timer.loop(lookaround.bind(this));
}
function lookaround(){
    const c = this._scene.getRotateMatrix();
    xRotate(c,this._rotation.x,c);
    yRotate(c,this._rotation.y,c);
    zRotate(c,this._rotation.z,c);
    //console.log(this._rotation.x,this._rotation.y,this._rotation.z);
}
export function lookAroundByKeyboard (scene){
    return new Observer(scene);
}
