import EAngle from './EAngle.js'
import Vector from './vector.js'

//GameMath
const X='x',Y ='y',Z ='z';

function remap(x, t1, t2, s1, s2){
    const fraction= (x- t1)/(t2- t1);
    return fraction * (s2 - s1) + s1;
}

export function clipLine (d,aabbBox,v0,v1,f_low,f_high){//d: dimension,
    var f_dim_low,f_dim_high;

    const total = (v1[d] - v0[d]);

    f_dim_low = (aabbBox.vecMin[d] - v0[d])/total;
    f_dim_high= (aabbBox.vecMax[d] - v0[d])/total;

    if(f_dim_high <f_dim_low)
        [f_dim_low,f_dim_high] = [f_dim_high,f_dim_low];

    if(f_dim_high < f_low.value)
        return false;

    if(f_dim_low > f_high.value)
        return false;

    f_low.value = Math.max(f_dim_low,f_low.value);
    f_high.value = Math.min(f_dim_high,f_high.value);

    if(f_low.value > f_high.value)
        return false;

    return true;
}
export function lineAABBintersection (aabbBox, v0, v1, vecIntersection, flFraction){
    var f_low = {value:0};
    var f_high = {value:1};
    if(!clipLine(X,aabbBox,v0,v1,f_low,f_high))
        return false;
    if(!clipLine(Y,aabbBox,v0,v1,f_low,f_high))
        return false;
    if(!clipLine(Z,aabbBox,v0,v1,f_low,f_high))
        return false;

    const b = v1.substract(v0);
    v0.add(b.multiply(f_low.value), vecIntersection)
    flFraction.value = f_low.value;

    return true;
}
export function traceLine (v0, v1, vecIntersection,targets,getshot){
    var flLowestFraction = 1;
    const vecTestIntersection = new Vector();
    var flTestFraction = {value:undefined};

    for(var i=0,l = targets.length;i<l;i++){
        if(lineAABBintersection(targets[i].getAABB(),v0,v1,vecTestIntersection,flTestFraction) && flTestFraction.value <flLowestFraction){
            vecTestIntersection.cloneTo(vecIntersection); 
            flLowestFraction = flTestFraction.value;
            getshot.value = i;
        }
    }
    if(flLowestFraction <1)
        return true;

    return false;
}

export function pitchYawRoll2xyz(p,y,r){
    return new EAngle(p,y,r).toVector();
}

//linear interpolate speed up/down
export function approach  (goal,current,delta){
    const diff = goal - current;
    //console.log(goal,current,diff,delta);
    //speed up
    if(diff > delta){
        return current +delta;
    }
    // speed down
    if(diff < -delta)
        return current -delta;

    return goal;
}
export function dotProduct (a,b){
    return a.x*b.x +a.y*b.y+a.z*b.z;
};
//Cross Product
export function cross(a,b){
    const c = new Vector();
    c.x = a.y*b.z - a.z * b.y;
    c.y = a.z*b.x - a.x * b.z;
    c.z = a.x*b.y - a.y * b.x;
    return c;
}
export function rotate_around_axis(axis_normal,radian,point){
    return point
        .multiply(Math.cos(radian))
        .add(axis_normal.multiply(dotProduct(point,axis_normal)*(1-Math.cos(radian))))
        .add(cross(axis_normal,point).multiply(Math.sin(radian)));
}
