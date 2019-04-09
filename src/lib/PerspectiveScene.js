import Scene from './scene.js'
import {perspective,translate,identity} from './m4.js'
import {degToRad} from './utils.js'

//Create Scene with perspective matrix!
export default function PerspectiveScene(gl){
   const sc = new Scene(gl);
   //create viewProjectionMatrix
   //const cameraMatrix = m4.identity();
   //m4.translate(cameraMatrix, 8, 8, 8,cameraMatrix);
   //const target= [0, 0, 0];
   /*const cameraPosition  =[ cameraMatrix[12], cameraMatrix[13], cameraMatrix[14], ];
   const up = [0, 1, 0];
   m4.lookAt(cameraPosition, target, up,cameraMatrix);*/
   //#############################################/
   //sc._cameraMatrix = cameraMatrix;
   //const viewMatrix =m4.inverse(cameraMatrix);
   const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
   const zNear = 1;
   const zFar = -1024;
   const fieldOfViewRadians = degToRad(75);
   const projectionMatrix = perspective(fieldOfViewRadians, aspect, zNear, zFar);
   //#############################################/
   sc._projectionMatrix = projectionMatrix;
   //viewProjectionMatrix = m4.multiply(projectionMatrix,viewMatrix );
   // create scene and attach viewProjectionMatrix to it
   //sc._viewProjectionMatrix = viewProjectionMatrix;
   return sc;
}
