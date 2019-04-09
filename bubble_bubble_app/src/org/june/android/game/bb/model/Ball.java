package org.june.android.game.bb.model;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RadialGradient;
import android.graphics.Shader;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.OvalShape;

public class Ball extends Sprite {
    float x, y, xSpeed, ySpeed, speed;
    ShapeDrawable drawable;
    static final public int SIZE=64;
    int energy = 16;
    boolean active;

    public Ball(float xf, float yf) {
// position
        x = xf;
        y = yf;
	xSpeed =0;
       	speed = ySpeed = 128f;
        // shape
        OvalShape circle = new OvalShape();
        circle.resize(SIZE, SIZE);
        drawable = new ShapeDrawable(circle);
        // color
        int red = (int) (Math.random() * 255);
        int green = (int) (Math.random() * 255);
        int blue = (int) (Math.random() * 255);
        int color = 0xff000000 | red << 16 | green << 8 | blue;
        Paint paint = drawable.getPaint(); //new Paint(Paint.ANTI_ALIAS_FLAG);
        int darkColor = 0xff000000 | red / 4 << 16 | green / 4 << 8 | blue / 4;
        RadialGradient gradient = new RadialGradient(37.5f, 12.5f, 50f, color, darkColor, Shader.TileMode.CLAMP);
        paint.setShader(gradient);
	active = false;
    }
    public void injure(int i){
	energy-=i;
	if(energy<0) energy = 0;
    }
    public int getEnergy(){
	return energy;
    }
    public ShapeDrawable getDrawable() {
        return drawable;
    }

    public void setDrawable(ShapeDrawable drawable) {
        this.drawable = drawable;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }
    public boolean active(){
    return active;}
    public void setActive(boolean b){ active = b;}

    public void draw(Canvas c) {
        c.save();
        c.translate(getX(), getY());
        drawable.draw(c);
        c.restore();
    }
    public void setSpeed(float x, float y){
	xSpeed = x; ySpeed = y;
    }
    public float getXSpeed(){
	return xSpeed;
    }
    public float getYSpeed(){
	return ySpeed;
    }
    public float getSpeed(){
	return speed;
    }
    public void setSpeed(float f){
	speed = f;
    }
}
