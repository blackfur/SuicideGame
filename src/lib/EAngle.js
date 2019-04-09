const EAngle = function(){
    function _(pitch,yaw,roll){
        this.p = pitch;//head up/down
        this.y= yaw;//head north/south/west/east
        this.r = roll;//wing up/down
    }
    function toVector(){
        const result = new Vector();
        result.x = Math.cos(this.y)*Math.cos(this.p);
        result.y = Math.sin(this.p);
        result.z = Math.sin(this.y)*Math.cos(this.p);
        return result;
    }
    _.prototype.toVector = toVector;
    function normalize(){
        if(this.p>89)
            this.p = 89;
        if(this.p<-89)
            this.p = -89;

        while(this.y<-180)
            this.y += 360;
        while(this.y>180)
            this.y-=360;
    }
    return _;
}();
export default EAngle;
