package org.june.android.game.bb;

import android.content.Context;
import android.graphics.Canvas;
import android.util.Log;
import android.view.MotionEvent;
import org.june.android.game.bb.model.Ball;
import org.june.android.game.bb.model.Arrow;
import android.util.AttributeSet;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import java.util.ArrayList;
import java.util.Iterator;
import android.os.Handler;
import android.os.Looper;
import java.lang.Math;

class ShotSurfaceView extends SurfaceView {
  static final String TAG = "#org.june.android#";
  SurfaceHolder mSurfaceHolder;
  Engine eg;
  public ShotSurfaceView(Context context, AttributeSet attrs) {
	super(context, attrs);
	//
	eg = new Engine();

	// register our interest in hearing about changes to our surface
	mSurfaceHolder = getHolder();
	mSurfaceHolder.addCallback(holderCallback);

	// make sure we get key events
	setFocusable(true); 
  }
  SurfaceHolder.Callback holderCallback = new SurfaceHolder.Callback(){
	/* Callback invoked when the surface dimensions change. */
	public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
	  Log.i(Env.TAG,"surfaceChanged");
	  eg.on_surface_changed(width, height);
	}

	/*
	 * Callback invoked when the Surface has been created and is ready to be
	 * used.
	 */
	public void surfaceCreated(SurfaceHolder holder) {
	  Log.i(Env.TAG,"surfaceCreated");
	  eg.on_surface_created();
	}

	/*
	 * Callback invoked when the Surface has been on_surface_destroyeded and must no longer
	 * be touched. WARNING: after this method returns, the Surface/Canvas must
	 * never be touched again!
	 */
	public void surfaceDestroyed(SurfaceHolder holder) {
	  Log.i(Env.TAG,"surfaceDestroyed");
	  eg.on_surface_destroyed();
	}
  };
  class Engine{
	// capacity for balls
	final static int MAX = 128;
	ArrayList<Ball> balls= new ArrayList<Ball>();
	ArrayList<Arrow> arrows= new ArrayList<Arrow>();
	boolean mRun,start;
	final Object mRunLock = new Object();
	DrawThread drawThr;
	/** Used to figure out elapsed time between frames */
	long mLastTime;
	Handler updateHandle;
	UpdateThread updateThr;
	int right,bottom;

	public Engine(){
	  updateThr = new UpdateThread();
	  Log.i(Env.TAG,"UpdateThread start: "+System.currentTimeMillis());
	  updateThr.start();
	}
	public void on_surface_created(){}
	public void on_surface_changed(int w, int h){
	  synchronized (mSurfaceHolder) {
		right = w - Ball.SIZE;
		bottom = h - Ball.SIZE;
	  }
	}

	class UpdateThread extends Thread{
	  public void run() {
		Log.i(Env.TAG,"UpdateThread run: "+System.currentTimeMillis());
		Looper.prepare();
		updateHandle = new Handler();
		Looper.loop();
	  }
	}
	public void start(){
	  if(start)
		return;
	  start = true;
	  drawThr = new DrawThread();
	  drawThr.start();
	  setRunning(true);
	  Log.i(Env.TAG,"DrawThread start");
	  mLastTime = System.currentTimeMillis() + 100;
	  Log.i(Env.TAG,"engine started");
	}

	public void on_surface_destroyed(){
	  // we have to tell thread to shut down & wait for it to finish, or else
	  // it might touch the Surface after we return and explode
	  boolean retry = true;
	  setRunning(false);
	  while (retry) {
		try {
		  drawThr.join();
		  Log.i(Env.TAG,"DrawThread join");
		  //updateThr.join();
		  retry = false;
		} catch (InterruptedException e) {
		}
	  }
	  start = false;
	  Log.i(Env.TAG,"engine on_surface_destroyed: "+System.currentTimeMillis());
	}

	/**
	 * Used to signal the thread whether it should be running or not.
	 * Passing true allows the thread to run; passing false will shut it
	 * down if it's already running. Calling start() after this was most
	 * recently called with false will result in an immediate shutdown.
	 *
	 * @param b true to run, false to shut down
	 */
	public void setRunning(boolean b) {
	    // Do not allow mRun to be modified while any canvas operations
	    // are potentially in-flight. See doDraw().
	    synchronized (mRunLock) {
		mRun = b;
	    }
	}
	void draw(Canvas c){
	    c.drawARGB(255,0,0,0);
	    synchronized(balls){
		for (int i = 0; i < balls.size(); ++i)
		    balls.get(i).draw(c);
	    }
	    synchronized(arrows){
		for (int i = 0; i < arrows.size(); ++i)
		    arrows.get(i).draw(c);
	    }
	}
	static final float BOUNCE = 8f;
	void update(){
	    long now = System.currentTimeMillis();
	    // Do nothing if mLastTime is in the future.
	    // This allows the game-start to delay the start of the physics
	    // by 100ms or whatever.
	    if (mLastTime > now) return;
	    //
	    double elapsed = (now - mLastTime) / 1000.0;
	    synchronized(balls){
		Iterator<Ball> it = balls.iterator();
		while(it.hasNext()){
		    Ball b = it.next();
		    if(!b.active()) continue;
		    // death check
		    if(b.getEnergy()==0) {
			it.remove();
			Log.i(Env.TAG,"number after removed: "+balls.size());
			continue;
		    }
		    // bounce check
		    // left top
		    if(b.getX()<=0 && b.getY()<=0){
			b.injure(1);
			b.setX(BOUNCE); b.setY(BOUNCE);
			float f = (float)Math.cos(45)*b.getSpeed();
			b.setSpeed(f,f);
			Log.i(TAG,"x, y speed: "+f+","+f+","+b.getSpeed());
		    }
		    // right top
		    else if(b.getX()>=right && b.getY()<=0){
			b.injure(1);
			b.setX(right-BOUNCE); b.setY(BOUNCE);
			float f = (float)Math.cos(45)*b.getSpeed();
			b.setSpeed(-f,f);
			Log.i(TAG,"x, y speed: "+-f+","+f+","+b.getSpeed());
		    }
		    // right bottom
		    else if(b.getX()>=right && b.getY()>=bottom){
			b.injure(1);
			b.setX(right-BOUNCE); b.setY(bottom-BOUNCE);
			float f = (float)Math.cos(45)*b.getSpeed();
			b.setSpeed(-f,-f);
			Log.i(TAG,"x, y speed: "+-f+","+-f+","+b.getSpeed());
		    }
		    // left bottom
		    else if(b.getX()<=0 && b.getY()>=bottom){
			b.injure(1);
			b.setX(BOUNCE); b.setY(bottom-BOUNCE);
			float f = (float)Math.cos(45)*b.getSpeed();
			b.setSpeed(f,-f);
			Log.i(TAG,"x, y speed: "+f+","+-f+","+b.getSpeed());
		    }
		    // top
		    else if(b.getY()<=0){
			b.injure(1);
			b.setY(BOUNCE);
			double r = Math.random();
			// 30 -> 60
			double angle = r * 20 + 45;
			float xf = (float)Math.cos(angle)*b.getSpeed();
			float yf = (float)Math.sin(angle)*b.getSpeed();
			// 0/1, left/right
			if(r*2 == 0)
			    xf = -xf;
			b.setSpeed(xf,yf);
			Log.i(TAG,"x, y speed: "+xf+","+yf+","+b.getSpeed());
		    }
		    // bottom
		    else if(b.getY()>=bottom){
			b.injure(1);
			b.setY(bottom-BOUNCE);
			double r = Math.random();
			// 30 -> 60
			double angle = r * 20 + 45;
			float xf =(float) Math.cos(angle)*b.getSpeed();
			float yf =(float) Math.sin(angle)*b.getSpeed();
			// 0/1, left/right
			if(r*2 == 0)
			    xf = -xf;
			b.setSpeed(xf,-yf);
			Log.i(TAG,"x, y speed: "+xf+","+-yf+","+b.getSpeed());
		    }
		    // left
		    else if(b.getX()<=0){
			b.injure(1);
			b.setX(BOUNCE);
			double r = Math.random();
			// 30 -> 60
			double angle = r * 20 + 45;
			float xf = (float)Math.cos(angle)*b.getSpeed();
			float yf = (float)Math.sin(angle)*b.getSpeed();
			// 0/1, up/down
			if(r*2 == 0)
			    yf = -yf;
			b.setSpeed(xf,yf);
			Log.i(TAG,"x, y speed: "+xf+","+yf+","+b.getSpeed());
		    }
		    // right
		    else if(b.getX()>=right){
			b.injure(1);
			b.setX(right-BOUNCE);
			double r = Math.random();
			// 30 -> 60
			double angle = r * 20 + 45;
			float xf = (float)Math.cos(angle)*b.getSpeed();
			float yf = (float)Math.sin(angle)*b.getSpeed();
			// 0/1, up/down
			if(r*2 == 0)
			    yf = -yf;
			b.setSpeed(-xf,yf);
			Log.i(TAG,"x, y speed: "+-xf+","+yf+","+b.getSpeed());
		    }
		    // move
		    b.setX((float)(b.getX() + b.getXSpeed() * elapsed));
		    b.setY((float)(b.getY() + b.getYSpeed() * elapsed));
		}
	    }
	    mLastTime = now;
	}

	class DrawThread extends Thread{
	    @Override
	    public void run() {
		while (mRun) {
		    if(System.currentTimeMillis()-mLastTime<32)
			continue;
		    Canvas c = null;
		    try {
			c = mSurfaceHolder.lockCanvas(null);
			synchronized (mSurfaceHolder) {
			    update();
			    // Critical section. Do not allow mRun to be set false until
			    // we are sure all canvas draw operations are complete.
			    //
			    // If mRun has been toggled false, inhibit canvas operations.
			    synchronized (mRunLock) {
				if (mRun) draw(c);
			    }
			    synchronized(balls){
				if(balls.size() == 0)
				    break;
			    }
			}
		    } finally {
			// do this in a finally so that if an exception is thrown
			// during the above, we don't leave the Surface in an
			// inconsistent state
			if (c != null) {
			    mSurfaceHolder.unlockCanvasAndPost(c);
			}
		    }
		}
		Log.i(Env.TAG,"draw thread out loop");
		updateHandle.post(new Runnable(){
		    public void run(){
			eg.on_surface_destroyed();
		    }
		});
		Log.i(Env.TAG,"on_surface_destroyed post");
	    }
	}
	public void add(final Arrow s){
	    if(updateHandle==null)
		return;
	    updateHandle.post(new Runnable(){
		public void run(){
		    synchronized (arrows) {
			if(arrows.size()>MAX) return;
			arrows.add(s);
		    }
		}
	    });
	}
	public void add(final Ball s){
	    if(updateHandle==null)
		return;
	    updateHandle.post(new Runnable(){
		public void run(){
		    synchronized (balls) {
			if(balls.size()>MAX) return;
			balls.add(s);
		    }
		}
	    });
	}
	public void onMove(final float x, final float y){
	    if(updateHandle==null)
		return;
	    updateHandle.post(new Runnable(){
		public void run(){
		    synchronized (arrows) {
			Arrow a = arrows.get(0);
			a.setXTail(x); a.setYTail(y);
		    }
		    synchronized (balls) {
			Ball b = balls.get(balls.size()-1);
			b.setX(x); b.setY(y);
		    }
		}
	    });
	}
	public void onUp(){
	    if(updateHandle==null)
		return;
	    updateHandle.post(new Runnable(){
		public void run(){
		    try{
			float x,y;
			synchronized(arrows) {
			    Arrow a = arrows.get(0);
			    x = a.getXTail()-a.getXHead();
			    y = a.getYTail()-a.getYHead();
			    arrows.clear();
			}
			synchronized (balls) {
			    float speed = 0;
			    Ball b = balls.get(balls.size()-1);
			    float x_ = Math.abs(x); 
			    float y_ = Math.abs(y);
			    if(x_==0||y_==0){ 
				speed = 4*(x_>y_?x:y);
				if(speed>b.getSpeed()) b.setSpeed(speed);
				if(x==0){
				b.setSpeed(0,speed);
				Log.i(TAG,"x, y speed: "+0+","+speed+","+b.getSpeed());
				}
				else {
				    b.setSpeed(speed,0);
				Log.i(TAG,"x, y speed: "+speed+","+0+","+b.getSpeed());
				}
			    }else {
				float line = (float) Math.hypot(x_,y_);
				speed = line*4;
				if(speed>b.getSpeed()) b.setSpeed(speed);
				float xSpeed = b.getSpeed()*x_/line;
				float ySpeed = b.getSpeed()*y_/line;
				if(x>0 && y>0){
				    xSpeed = -xSpeed;
				    ySpeed = -ySpeed;
				}
				else if(x<0 && y>0){
				    ySpeed = -ySpeed;
				}else if(x>0 && y<0){
				    xSpeed = -xSpeed;
				}
				b.setSpeed(xSpeed ,ySpeed);
				Log.i(TAG,"x, y speed: "+xSpeed+","+ySpeed+","+b.getSpeed());
			    }
			    b.setActive(true);
			}
		    }catch(Exception e){
			Log.e(TAG,Log.getStackTraceString(e));
		    }
		}
	    });
	}
	public void onDown(final float x, final float y){
	    eg.start();
	    eg.add(new Arrow(x,y));
	    eg.add(new Ball(x,y));
	}
    }

    public boolean onTouchEvent(MotionEvent event) {
	Log.i(Env.TAG,"onTouchEvent: "+event.getAction()+", x:"+event.getX()+", y:"+event.getY());
	if (event.getAction() == MotionEvent.ACTION_DOWN ){
	    eg.onDown(event.getX(),event.getY());
	}
	else if(event.getAction() == MotionEvent.ACTION_MOVE) {
	    eg.onMove(event.getX(),event.getY());
	}
	else if (event.getAction() == MotionEvent.ACTION_UP){
	    eg.onUp();
	}
	return true;
    }
}
