package org.june.android.game.bb.model;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RadialGradient;
import android.graphics.Shader;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.OvalShape;

public class Arrow extends Sprite {
    float xHead, yHead, xTail=0, yTail;
    Paint paint;

    public Arrow(float xf, float yf) {
// position
        xHead = xf;
        yHead = yf;
	//
	paint = new Paint();
        int red = (int) (Math.random() * 255);
        int green = (int) (Math.random() * 255);
	int blue = (int) (Math.random() * 255);
	paint.setARGB(255,red,green,blue);
    }
    public float getYTail(){
	return yTail;}
    public float getXTail(){
	return xTail;}
    public float getYHead(){
	return yHead;}
    public float getXHead(){
	return xHead;}
    public void setYTail(float y) {
	yTail = y;
    }

    public void setXTail(float x) {
	xTail = x;
    }

    public void draw(Canvas c) {
	if(xTail!=0)
	    c.drawLine(xHead,yHead, xTail,yTail,paint); 
    }
}
