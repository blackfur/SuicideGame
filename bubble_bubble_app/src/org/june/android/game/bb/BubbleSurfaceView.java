package org.june.android.game.bb;

import android.content.Context;
import android.graphics.Canvas;
import android.util.Log;
import android.view.MotionEvent;
import org.june.android.game.bb.model.Ball;
import android.util.AttributeSet;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import java.util.ArrayList;
import java.util.Iterator;
import android.os.Handler;
import android.os.Looper;
import java.lang.Math;

class BubbleSurfaceView extends SurfaceView {
  SurfaceHolder mSurfaceHolder;
  Engine eg;
  public BubbleSurfaceView(Context context, AttributeSet attrs) {
	super(context, attrs);
	//
	eg = new Engine();

	// register our interest in hearing about changes to our surface
	mSurfaceHolder = getHolder();
	mSurfaceHolder .addCallback(holderCallback);

	// make sure we get key events
	setFocusable(true); 
  }
  SurfaceHolder.Callback holderCallback = new SurfaceHolder.Callback(){
	/* Callback invoked when the surface dimensions change. */
	public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
	  Log.i(Env.TAG,"surfaceChanged");
	  eg.setBound(width, height);
	}

	/*
	 * Callback invoked when the Surface has been created and is ready to be
	 * used.
	 */
	public void surfaceCreated(SurfaceHolder holder) {
	  Log.i(Env.TAG,"surfaceCreated");
	  //eg.start();
	}

	/*
	 * Callback invoked when the Surface has been destroyed and must no longer
	 * be touched. WARNING: after this method returns, the Surface/Canvas must
	 * never be touched again!
	 */
	public void surfaceDestroyed(SurfaceHolder holder) {
	  Log.i(Env.TAG,"surfaceDestroyed");
	  eg.destroy();
	}
  };
  class Engine{
	// capacity for sprites
	final static int MAX = 128;
	ArrayList<Ball> balls = new ArrayList<Ball>();
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
	public void setBound(int w, int h){
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

	public void add(final float x, final float y){
	  if(updateHandle==null)
		return;
	  updateHandle.post(new Runnable(){
		public void run(){
		  synchronized (balls) {
			if(balls.size()>MAX) return;
			Ball b = new Ball(x, y);
			balls.add(b);
		  }
		}
	  });
	}
	public void destroy(){
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
	  Log.i(Env.TAG,"engine destroy: "+System.currentTimeMillis());
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
	}
	void update(){
	  long now = System.currentTimeMillis();
	  // Do nothing if mLastTime is in the future.
	  // This allows the game-start to delay the start of the physics
	  // by 100ms or whatever.
	  if (mLastTime > now) return;
	  //
	  double elapsed = (now - mLastTime) / 1000.0;
	  synchronized(balls){
		// death check
		Iterator<Ball> it = balls.iterator();
		while(it.hasNext()){
		  Ball b = it.next();
		  if(b.getEnergy()==0) {
			it.remove();
			Log.i(Env.TAG,"number after removed: "+balls.size());
		  }
		}
		// bounce
		for(int i=0; i<balls.size(); i++){
		  Ball b = balls.get(i);
		  // bounce check
		  // left top
		  if(b.getX()<=0 && b.getY()<=0){
			b.injure(1);
			b.setX(1); b.setY(1);
			float f = (float)Math.cos(45)*b.getSpeed();
			b.setSpeed(f,f);
		  }
		  // right top
		  else if(b.getX()>=right && b.getY()<=0){
			b.injure(1);
			b.setX(right-1); b.setY(1);
			float f = (float)Math.cos(45)*b.getSpeed();
			b.setSpeed(-f,f);
		  }
		  // right bottom
		  else if(b.getX()>=right && b.getY()>=bottom){
			b.injure(1);
			b.setX(right-1); b.setY(bottom-1);
			float f = (float)Math.cos(45)*b.getSpeed();
			b.setSpeed(-f,-f);
		  }
		  // left bottom
		  else if(b.getX()<=0 && b.getY()>=bottom){
			b.injure(1);
			b.setX(1); b.setY(bottom-1);
			float f = (float)Math.cos(45)*b.getSpeed();
			b.setSpeed(f,-f);
		  }
		  // top
		  else if(b.getY()<=0){
			b.injure(1);
			b.setY(1);
			double r = Math.random();
			// 30 -> 60
			double angle = r * 20 + 45;
			float xf = (float)Math.cos(angle)*b.getSpeed();
			float yf = (float)Math.sin(angle)*b.getSpeed();
			// 0/1, left/right
			if(r*2 == 0)
			  xf = -xf;
			b.setSpeed(xf,yf);
		  }
		  // bottom
		  else if(b.getY()>=bottom){
			b.injure(1);
			b.setY(bottom-1);
			double r = Math.random();
			// 30 -> 60
			double angle = r * 20 + 45;
			float xf =(float) Math.cos(angle)*b.getSpeed();
			float yf =(float) Math.sin(angle)*b.getSpeed();
			// 0/1, left/right
			if(r*2 == 0)
			  xf = -xf;
			b.setSpeed(xf,-yf);
		  }
		  // left
		  else if(b.getX()<=0){
			b.injure(1);
			b.setX(1);
			double r = Math.random();
			// 30 -> 60
			double angle = r * 20 + 45;
			float xf = (float)Math.cos(angle)*b.getSpeed();
			float yf = (float)Math.sin(angle)*b.getSpeed();
			// 0/1, up/down
			if(r*2 == 0)
			  yf = -yf;
			b.setSpeed(xf,yf);
		  }
		  // right
		  else if(b.getX()>=right){
			b.injure(1);
			b.setX(right-1);
			double r = Math.random();
			// 30 -> 60
			double angle = r * 20 + 45;
			float xf = (float)Math.cos(angle)*b.getSpeed();
			float yf = (float)Math.sin(angle)*b.getSpeed();
			// 0/1, up/down
			if(r*2 == 0)
			  yf = -yf;
			b.setSpeed(-xf,yf);
		  }
		  // move
		  b.setX((float)(b.getX() + b.getXSpeed() * elapsed));
		  b.setY((float)(b.getY() + b.getYSpeed() * elapsed));
		}
		/*
		// float up
		Iterator<Ball> i = balls.iterator();
		while(i.hasNext()){
		Ball b = i.next();
		double y = b.getY() - 64 * elapsed;
		if(y<=0) {
		i.remove();
		Log.i(Env.TAG,"size after removed: "+balls.size());
		}
		else b.setY((float)y);
		}
		*/
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
			eg.destroy();
		  }
		});
		Log.i(Env.TAG,"destroy post");
	  }
	}
  }

  public boolean onTouchEvent(MotionEvent event) {
	if (event.getAction() != MotionEvent.ACTION_DOWN && event.getAction() != MotionEvent.ACTION_MOVE) {
	  return false;
	}
	eg.start();
	Log.i(Env.TAG,"onTouchEvent: "+event.getAction()+", x:"+event.getX()+", y:"+event.getY());
	eg.add(event.getX(),event.getY());
	return true;
  }
}
