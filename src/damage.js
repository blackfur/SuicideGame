import GameTimer from './lib/timer.js';
import {yRotate} from './lib/m4.js';
import {FPS} from './lib/constants.js';

export default (function(){
    function damage(target){
        const tm = new GameTimer(FPS);
        const rotateMt=target.getRotateMatrix();
        var rotateSize = 0,rotateStep = 30*Math.PI/180,rotateMax = 2*Math.PI;
        tm.loop(function(){
            rotateSize = (rotateSize+rotateStep)%rotateMax;
            target._rotateMatrix = yRotate(rotateMt,rotateSize);
        });
        setTimeout(function(){
            tm.stop();
            //restore rotation
            target._rotateMatrix=rotateMt;
        },4000);
    }
    return damage;
}());
