//require('./css/proto_game.css');
import PointLight from './lib/point-light.js'
import damage from './damage.js'
import GlProgramFactory,{VERTEX_COLOR,COLOR,POINT_LIGHT,WORLD_VIEW_PROJECT,TEXTURE} from './lib/GlProgramFactory.js'
import fullscreen from './lib/fullscreen.js'
import Axis from './lib/axis.js'
import Cube from './lib/cube.js'
import Point from './lib/point.js'
import Plane from './lib/plane.js'
import PerspectiveScene from './lib/PerspectiveScene.js'
import Ghost from './lib/ghost.js'
import CubePlayer from './lib/cube-player.js'
import {lookAroundByKeyboard} from './lib/Observer.js'
import {moveByKeyboard} from './lib/Walker.js'
import {scale,translate} from './lib/m4.js'
import GameTimer from './lib/timer.js'
import {FPS} from './lib/constants.js'
import giveAGunTo from './lib/gun.js'
import explosion from './explosion.js'
import Billboard from './lib/billboard.js'
import ImgLoader from './lib/img-loader.js'
import {render} from './lib/utils.js'

window.addEventListener('load',onload);

function onload(){
    Promise.all([
        ImgLoader('./image/profusion.png')
    ]).then((files)=>{
        onfileloaded(files);
    }).catch((err)=>{
        console.error(err);
        return;
    });
}
function onfileloaded(files){
    const npc_png = files[0];

    const canvas = document.getElementById("cv");
    const gl = canvas.getContext("webgl");
    if(!gl){
        alert('WebGL Not Supportted');
        return;
    }
    fullscreen(gl);
    const tm = new GameTimer(FPS);
    var features = COLOR|POINT_LIGHT|WORLD_VIEW_PROJECT;
    const prog = GlProgramFactory(gl,features);

    features = TEXTURE|WORLD_VIEW_PROJECT;
    const texProg= GlProgramFactory(gl,features);

    features =COLOR|WORLD_VIEW_PROJECT;
    const color_prog= GlProgramFactory(gl,features);

    const scene = PerspectiveScene(gl); 
    scene.useProgram(prog);

    const axis = Axis(gl);
    scene.addSprite(axis);
    axis.useProgram(color_prog);

    /*const originalPoint= Point(gl);
    scene.addSprite(originalPoint);
    originalPoint.useProgram(color_prog);*/

    const ground= Plane(gl);
    scene.addSprite(ground);
    ground.useProgram(color_prog);

    const lit = new PointLight(gl);
    const litWorldMatrix = lit.getWorldMatrix();
    translate(litWorldMatrix,0,8,-3,litWorldMatrix);
    scene.addSprite(lit);

    const enemies = [];
    for(var i=0;i<4;i++){
        const cb = new Cube(gl);
        const scaleMt = cb.getScaleMatrix();
        scale(scaleMt ,Math.random()*4,Math.random()*4,Math.random()*4,scaleMt);
        const translateMt= cb.getTranslateMatrix();
        translate(translateMt,Math.random()*8,0,Math.random()*8,translateMt);
        enemies.push(cb);
        scene.addSprite(cb);
    }

    const billboard = new Billboard(gl,npc_png,scene);
    //const billboard_worldMatrix = billboard.getWorldMatrix();
    //translate(billboard_worldMatrix,2,0,-3,billboard_worldMatrix);
    enemies.push(billboard);
    scene.addSprite(billboard);
    billboard.useProgram(texProg);

    const ghost= new Ghost(); 
    const ghostMatrix = ghost.getWorldMatrix();
    translate(ghostMatrix,0,0,0,ghostMatrix);
    moveByKeyboard(ghost);
    scene.focus(ghost);

    const cubeplayer= new CubePlayer(gl,ghost);
    giveAGunTo(gl,cubeplayer,enemies,function(i,getshot){//i : intersection point
        //console.log(i);
        //console.log(i,getshot);
        explosion(gl,i,scene);
        getshot!=undefined && damage(getshot);
        /*const p = Point(gl);
        const m = p.getTranslateMatrix();
        translate(m,i.x,i.y,i.z,m);
        scene.addSprite(p);
        p.useProgram(color_prog);
        setTimeout(function(){
            scene.removeSprite(p);
        },2000);*/
    },color_prog);
    scene.addSprite(cubeplayer);

    lookAroundByKeyboard(scene);


    //translate(wm,0,0,1,wm);
    /*const speedx = 8*Math.PI/180;
    const oneRadian = Math.PI/180;
    const speedy = speedx + 4*oneRadian;
    const speedz = speedy + 2*oneRadian;*/

    tm.loop(function(){
        /*m4.yRotate(wm,speedy,wm);
    m4.xRotate(wm,speedx,wm);
    m4.zRotate(wm,speedz,wm);*/
        //prog.display(gl,scene);
        ///texProg.summon(gl,billboard);
        /*for(var i=0,l=color_prog_sprites.length;i<l;i++){
            color_prog.summon(gl,color_prog_sprites[i]);
        }*/
        render(gl,scene);
    });
}
