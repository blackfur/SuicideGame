import Vector from './vector.js'
import Line from './line.js'
import {intersection,line_plane_intersect} from './intersect.js'

//giveAGunTo
export default (function(){
    function _(gl,snipper,targets,onhitting,color_prog){
        const _sprite = snipper,
            _targets = targets,
            _onhitting = onhitting;
        document.body.addEventListener('keydown', onkeydown.bind(undefined,gl,_sprite,_targets,_onhitting,color_prog));
    }

    function onkeydown(gl,_sprite,_targets,_onhitting,color_prog,et){
        if(et.keyCode == 85){//shoot,u
            const m = _sprite.getWorldMatrix();
            const position = new Vector(m[12],m[13],m[14]);
            //up a little bit so that we not shoot from the feet but from our chest or eyeballs
            const up = {x:0,y:0.8,z:0};
            const v0 = position.add(up);
            //console.log(v0);
            /*const cameraMatrix = _sprite._scene.getCameraMatrix();
            const forward = new Vector(-cameraMatrix[8],-cameraMatrix[9],-cameraMatrix[10]);*/
            const worldMatrix = _sprite.getWorldMatrix();
            const forward = new Vector(-worldMatrix[8],-worldMatrix[9],-worldMatrix[10]);
            const v1 =v0.add(forward.multiply(100)); 
            //console.log(v1);
            const l = Line(gl,v0,v1);
            _sprite._scene.addSprite(l);
            l.useProgram(color_prog);
            setTimeout(function(){
                _sprite._scene.removeSprite(l);
            },2000);

            /*const vecIntersection = new Vector();
            const getshot = {value:undefined};
            if(GameMath.traceLine(v0, v1, vecIntersection,_targets,getshot)){
                //hit target
                _onhitting(vecIntersection,_targets[getshot.value]);
            }*/
            const origin = new Float32Array([v0.x, v0.y, v0.z]);
            const dir = new Float32Array([forward.x,forward.y,forward.z]);
            const out = new Float32Array(3);
            const vecIntersection = new Vector();
            for(var i=0,l = _targets.length;i<l;i++){
                const aabb = _targets[i].getaabb();
                const out = intersection(out,origin,dir,aabb);
                if(out!=null){
                    vecIntersection.set(out[0],out[1],out[2]);
                    _onhitting(vecIntersection,_targets[i]);
                    break;
                }
            }
            const plane_point = new Vector(0,0,0);
            const plane_normal = new Vector(0,1,0);
            if(line_plane_intersect(vecIntersection,v0,forward,plane_point,plane_normal)){
                _onhitting(vecIntersection);
            }
        }
    }
    return _;
}());
