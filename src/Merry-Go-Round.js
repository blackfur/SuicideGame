import PointLight from './lib/point-light.js'
import {SHINY} from './lib/sprite.js'
import {SwirlY} from './lib/swirl.js'
import GlProgramFactory,{COLOR,POINT_LIGHT,WORLD_VIEW_PROJECT} from './lib/GlProgramFactory.js'
import fullscreen from './lib/fullscreen.js'
import Axis from './lib/axis.js'
import Cube from './lib/cube.js'
import Plane from './lib/plane.js'
import PerspectiveScene from './lib/PerspectiveScene.js'
import Ghost from './lib/ghost.js'
import CubePlayer from './lib/cube-player.js'
import {lookAroundByKeyboard} from './lib/Observer.js'
import {moveByKeyboard} from './lib/Walker.js'
import {translation,scale,translate} from './lib/m4.js'
import GameTimer from './lib/timer.js'
import {FPS} from './lib/constants.js'
import {render,stick,off,intersect2D} from './lib/utils.js'
import {attachWithAABB} from './lib/attachWithAABB.js'

window.addEventListener('load',onload);

function onload(){
    const canvas = document.getElementById("cv");
    const gl = canvas.getContext("webgl");

    fullscreen(gl);

    const tm = new GameTimer(FPS);
    var features = COLOR|POINT_LIGHT|WORLD_VIEW_PROJECT;
    const lit_prog = GlProgramFactory(gl,features);

    features = COLOR|WORLD_VIEW_PROJECT;
    const color_prog= GlProgramFactory(gl,features);

    const scene = PerspectiveScene(gl); 
    scene.useProgram(color_prog);

    const axis = Axis(gl);
    scene.addSprite(axis);
    axis.useProgram(color_prog);

    const ground= Plane(gl);
    scene.addSprite(ground);
    ground.useProgram(color_prog);

    const merry_go_round = Plane(gl);
    merry_go_round.uniforms['u_color'] = [1,0.1,0.4,1];
    scene.addSprite(merry_go_round);
    merry_go_round.useProgram(color_prog);

    const merry_go_round_AABB = attachWithAABB(gl,merry_go_round);
    scene.addSprite(merry_go_round_AABB);
    merry_go_round_AABB.useProgram(lit_prog);

    const merry_go_round_translate_matrix = merry_go_round.getTranslateMatrix();
    translate(merry_go_round_translate_matrix,4,1,0,merry_go_round_translate_matrix);

    const merry_go_round_scale= merry_go_round.getScaleMatrix();
    scale(merry_go_round_scale,0.4,0.4,0.4,merry_go_round_scale);

    const merry_go_round_swrilY = new SwirlY(merry_go_round,2*Math.PI/180);

    const lit = new PointLight(gl);
    const litWorldMatrix = lit.getWorldMatrix();
    translate(litWorldMatrix,0,16,8,litWorldMatrix);
    lit.useProgram(lit_prog);
    scene.addSprite(lit);

    const ghost= new Ghost(); 
    const ghostMatrix = ghost.getWorldMatrix();
    translate(ghostMatrix,0,0,0,ghostMatrix);
    moveByKeyboard(ghost);
    scene.focus(ghost);

    const cubeplayer= new CubePlayer(gl,ghost);
    scene.addSprite(cubeplayer);
    cubeplayer.useProgram(lit_prog);
    cubeplayer._translateMatrix = translation(0,2,0);

    lookAroundByKeyboard(scene);

    const cube = new Cube(gl);
    scene.addSprite(cube);
    cube.enable(SHINY);
    cube.useProgram(lit_prog);
    const cube_translate = cube.getTranslateMatrix();
    translate(cube_translate,0,2,1,cube_translate);

    stick(cube,merry_go_round);

    tm.loop(function(){

        merry_go_round_swrilY.do();

        if(intersect2D(cubeplayer,merry_go_round))
            stick(cubeplayer,merry_go_round);
        else
            off(cubeplayer,merry_go_round);

        render(gl,scene);
    });
}
