//ImgLoader
export default (function(){
    function onimgload(resolve,reject){
	resolve(this);
    }
    function ImgLoader(src){
	return new Promise((resolve,reject)=>{
	    const img = new Image();
	    img.addEventListener('load',onimgload.bind(img,resolve,reject));
	    img.src = src; 
	});
    }
    return ImgLoader;
}());
