const createImgTex= function(){
    function _(gl,img,scene){
	/*uniforms['u_enableConvolutionKernel']=0;
	uniforms['u_kernel[0]']=edgeDetectKernel;
	uniforms['u_onePixel']=[1.0/img.width,1.0/img.height];
	uniforms['u_kernelWeight']=computeKernelWeight(edgeDetectKernel);*/
	const textureUnit = 0;
	const t = new Texture(gl,img,textureUnit,uniforms);
	scene.addTexture(t);
	return t;
    }
    const uniforms = {};
    const edgeDetectKernel = [
	-1, -1, -1,
	-1,  8, -1,
	-1, -1, -1];
    return _;
}();
