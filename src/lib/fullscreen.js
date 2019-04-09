//fullscreen 
export default (function(){
    function _(gl){
	const canvas = gl.canvas;
	const elems = [
	    {'elem':document.body, style:'body'},
	    {elem:canvas, style:'canvas'}
	];
	for(var i=0,l=elems.length;i<l;i++){
	    const e = elems[i].elem;
	    const s = styles[elems[i].style];
	    for(var p in s){
		e.style[p] = s[p];
	    }
	}
	//make the drawingbuffer match whatever size the browser has stretched the canvas.
	const cw = canvas.clientWidth;
	const ch = canvas.clientHeight;
	cv.width = cw;
	cv.height = ch;
	window.addEventListener('resize', onWindowResize.bind(null,canvas), true);
    }
    function onWindowResize(canvas){
	const cw = canvas.clientWidth;
	const ch = canvas.clientHeight;
	canvas.width = cw;
	canvas.height = ch;
    }
    const styles={
	body:{
	    'box-sizing':'border-box'
	    //,'background':'darkgreen'
	    ,'padding':'0'
	    ,'margin':'0'
	    ,'border':'0'
	}
	,canvas:{
	    'width':'98vw'
	    ,'height':'98vh'
	    //,'background':'darkgreen'
	    ,'border':'1px solid black'
	    ,'padding':'0'
	    ,'border':'0'
	    ,'position':'absolute'
	    ,'top':'50%'
	    ,'left':'50%'
	    ,'margin-top':'-49vh'
	    ,'margin-left':'-49vw'
	}
    };
    return _;
}());
