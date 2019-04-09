import GameTimer from './lib/timer.js';
import Cube from './lib/cube.js';
import {scale,translate} from './lib/m4.js';
import {FPS} from './lib/constants.js';
//explosion
export default (function(){
    function _(gl,point,scene){
        const tm = new GameTimer(FPS);
        const cb = new Cube(gl);
        const translateMt= cb.getTranslateMatrix();
        translate(translateMt ,point.x,point.y,point.z,translateMt );
        const scaleMt = cb.getScaleMatrix();
        scale(scaleMt,0.2,0.2,0.2,scaleMt);
        scene.addSprite(cb);
        var scaleSize = 1,scaleStep = 1,scaleMax = 4;
        tm.loop(function(){
            scaleSize = (scaleSize+scaleStep)%scaleMax;
            cb._scaleMatrix = scale(scaleMt,scaleSize ,scaleSize ,scaleSize );
        });
        setTimeout(function(){
            tm.stop();
            scene.removeSprite(cb);
        },2000);
    }
    return _;
}());
