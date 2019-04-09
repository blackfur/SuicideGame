"use strict"
import GameTimer from './timer.js'
import m4 from './m4.js'
import Walker from './walker.js'
import {FPS} from './constants.js'

//control
export default (function(){
    const _ = {};
    const lookAroundByKeyboard = function(){
        const SPEED = 16;
        const ZERO = {x:0,y:0,z:0};
        const UP= {x:SPEED*Math.PI/180,y:0,z:0};
        const DOWN= {x:-SPEED*Math.PI/180,y:0,z:0};
        const RIGHT=  {x:0,y:-SPEED*Math.PI/180,z:0};
        const LEFT= {x:0,y:SPEED*Math.PI/180,z:0}; 
        /*UP= gm.pitchYawRoll2xyz(SPEED,0,0),
      DOWN= gm.pitchYawRoll2xyz(-SPEED,0,0),
      LEFT= gm.pitchYawRoll2xyz(0,-SPEED,0),
      RIGHT= gm.pitchYawRoll2xyz(0,SPEED,0);*/
        var scene,tm,rotation = ZERO;
        function _(s){
            scene = s;
            document.body.addEventListener('keydown', onkeydown);
            document.body.addEventListener('keyup', onkeyup);
            tm = new GameTimer(FPS);
        }
        function onkeyup (et){
            if(et.keyCode == 72 ||et.keyCode ==76
                ||et.keyCode ==75
                ||et.keyCode ==74
            ){
                tm.stop();
                rotation= ZERO;
            }
        }

        function onkeydown(et){
            if(et.keyCode == 72 ||et.keyCode ==76
                ||et.keyCode ==75
                ||et.keyCode ==74
            ){ tm.enable(); }

            if(et.keyCode == 65){//left,a
                rotation = LEFT;
            }else if(et.keyCode ==83){//up,s
                rotation = UP;
            }else if(et.keyCode ==68){//down,d
                rotation = DOWN;
            }else if(et.keyCode ==70){//right,f
                rotation = RIGHT;
            }else{
                return;
            }
            tm.loop(lookaround);
        }
        function lookaround(){
            const c = scene.getRotateMatrix();
            m4.xRotate(c,rotation.x,c);
            m4.yRotate(c,rotation.y,c);
            m4.zRotate(c,rotation.z,c);
            //console.log(rotation.x,rotation.y,rotation.z);
        }
        return _;
    }();
    _.lookAroundByKeyboard = lookAroundByKeyboard ;
    const moveByKeyboard= function(){

        function _(s){
            new Walker(s);
        }
        return _;
    }();
    _.moveByKeyboard = moveByKeyboard;
    return _;
}());
