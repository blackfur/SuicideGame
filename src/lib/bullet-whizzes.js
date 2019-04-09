import GameMath from 'game-math.js'
import Vector from 'vector.js'

export default (function(){
    //origin: start position of bullet
    //out: position where bullet should whizzes
    function _(origin,enemy_position,bullet_direction,out){
        const origin = new Vector(origin[0],origin[1],origin[2]);
        const enemy = new Vector(enemy_position[0],enemy_position[1],enemy_position[2]);
        const toEnemy = enemy.substract(origin);
        const bullet = bullet_direction.normalize();
        const bullet_fly_distance GameMath.dotProduct(toEnemy,bullet);
        const out = out==undefined?new Vector():out;
        const bullet_whizzes_at = origin.add(bullet.multiply(bullet_fly_distance ));
        bullet_whizzes_at.cloneto(out);
        return out;
    }
    return _;
}());
