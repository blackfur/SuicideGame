const Matrices = function(){
    function Matrices(){
	// Compute the matrices
	var cameraMatrix = m4.identity();
	// Compute the position of the first F
	var target= [0, 0, 0];
	// Use matrix math to compute a position on a circle where the camera is
	//const cameraAngleRadians  = 180 * Math.PI/180;
	//m4.xRotation(cameraAngleRadians,cameraMatrix,cameraMatrix);
	m4.translate(cameraMatrix, 0, 0, gl.canvas.width/1,cameraMatrix);
	// Get the camera's postion from the matrix we computed
	cameraPosition  =this.cameraPosition = [ cameraMatrix[12], cameraMatrix[13], cameraMatrix[14], ];
	// set the camera/view position
	var up = [0, 1, 0];
	// Compute the camera's matrix using look at. Just rotate the camera
	m4.lookAt(cameraPosition, target, up,cameraMatrix);
	// Make a view matrix from the camera matrix.
	var viewMatrix =m4.inverse(cameraMatrix);
	//m4.orthographic(0, gl.canvas.clientWidth, gl.canvas.clientHeight,0, 320, -320,matrix);
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	var zNear = 1;
	var zFar = -1024;
	var  fieldOfViewRadians = degToRad(75);
	var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
	//var projectionMatrix = m4.orthographic(-400, 400, -200, 200,1,-128);
	viewProjectionMatrix  =this.viewProjectionMatrix = m4.multiply(projectionMatrix,viewMatrix );
	//viewProjectionMatrix  =this.viewProjectionMatrix = projectionMatrix;
	//viewProjectionMatrix  =this.viewProjectionMatrix = m4.identity();
    }
    Matrices.prototype.uniforms = function(){
	return {'u_viewWorldPosition':this.cameraPosition,};
    };
    return Matrices;
}();
