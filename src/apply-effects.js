const applyEffects = function(){
    // List of effects to apply.
    function _(gl,img){
	const e = new Effects(gl,effectsToApply,img,0);
	return e.texture;
    }
    const effectsToApply = [
	"gaussianBlur",
	"emboss",
	"gaussianBlur",
	"unsharpen"
    ];
    return _;
}();
