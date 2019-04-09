//GameTimer
export default (function(){
    function _(fps){//fps:frame per second
        this._before = 0;
        this._elapse = 0;
        //second per frame
        if(fps>0){
            this._spf = 1/fps;
        }else{
            this._spf = 1/30;
        }
        this._stop = 0;
    }
    function loop(upt){
        const scope = this;
        (function _(now){
            scope.delta(now);
            if(scope.frame()){
                upt(now);
            }
            if(scope._stop){
                return;
            }
            requestAnimationFrame(_);
        }());
    }
    function enable(){
        this._stop = 0;
    }
    _.prototype.enable = enable;
    function stop(){
        this._stop = 1;
        this._before = 0;
        this._elapse = 0;
    }
    _.prototype.loop = loop;
    _.prototype.stop= stop;
    function delta(now){
        var delta = (now ==undefined ||this._before ==0)?0:now - this._before;
        delta = delta ==0?0:delta*=0.001;
        this._elapse+= delta;
        this._before = now == undefined?0:now;
        return delta;
    }
    function frame(){
        if(this._elapse <this._spf){
            return false;
        }else{
            this._elapse = this._elapse - this._spf;
            return true;
        }
    }
    _.prototype.delta = delta; 
    _.prototype.frame= frame; 
    return _;
}());
