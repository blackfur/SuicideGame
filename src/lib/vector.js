//Vector
export default (function(){
    function _(x,y,z){
        this.x = x==undefined?0:x;
        this.y = y==undefined?0:y;
        this.z = z==undefined?0:z;
    }
    _.prototype.set = function(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    };
    _.prototype.cloneTo = function(v){
        v.x = this.x;
        v.y = this.y;
        v.z = this.z;
        return v;
    };
    //to: destination
    function add(v,to){
        const r= to==undefined?new _():to;
        r.x = this.x+v.x;
        r.y = this.y+v.y;
        r.z = this.z+v.z;
        return r;
    }
    function substract(v,to){
        const r= to==undefined?new _():to;
        r.x = this.x-v.x;
        r.y = this.y-v.y;
        r.z = this.z-v.z;
        return r;
    }
    function length(){
        return Math.sqrt(this.x*this.x +this.y*this.y+this.z*this.z);
    }
    //square
    function    lengthSqr(){
        return (this.x*this.x +this.y*this.y+ this.z*this.z);
    }
    //scale functions
    function    multiply(n,to){
        const r= (to==undefined)?new _():to;
        r.x = this.x*n;
        r.y = this.y*n;
        r.z = this.z*n;
        return r;
    }
    _.prototype.multiply= multiply;
    function    divide(n){
        this.x/=n;
        this.y/=n;
        this.z/=n;
        return this;
    }
    //magnitude,unit,normal
    function    normalize(){
        return this.divide(this.length());
    }
    _.prototype.zero = function(){
        this.x = this.y = this.z = 0;
    };
    _.prototype.normalize = normalize;
    _.prototype.divide= divide;
    _.prototype.length= length;
    _.prototype.lengthSqr= lengthSqr;
    _.prototype.add= add;
    _.prototype.substract= substract;
    return _;
}());
