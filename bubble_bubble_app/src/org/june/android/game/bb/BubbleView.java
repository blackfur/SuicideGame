package org.june.android.game.bb;

import android.content.Context;
import android.graphics.Canvas;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import com.nineoldandroids.animation.Animator;
import com.nineoldandroids.animation.AnimatorListenerAdapter;
import com.nineoldandroids.animation.ObjectAnimator;
import com.nineoldandroids.animation.ValueAnimator;
import org.june.android.game.bb.model.Ball;

import java.util.ArrayList;

public class BubbleView extends View {
    final float screenH;
    ArrayList<Ball> balls;

    public BubbleView(Context context) {
        super(context);
        //
        balls = new ArrayList<Ball>();
        // updater
        ValueAnimator v = ValueAnimator.ofInt(0);
        v.setRepeatCount(ValueAnimator.INFINITE);
        v.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            public void onAnimationUpdate(ValueAnimator animation) {
//                Log.i(Env.TAG, "onAnimationUpdate");
                invalidate();
            }
        });
        v.start();
        //
        DisplayMetrics metrics = context.getResources().getDisplayMetrics();
//        int width = metrics.widthPixels;
        screenH = metrics.heightPixels;
        Log.i(Env.TAG, "screen height: " + screenH);
    }

    public boolean onTouchEvent(MotionEvent event) {
        if (event.getAction() != MotionEvent.ACTION_DOWN && event.getAction() != MotionEvent.ACTION_MOVE) {
            return false;
        }
	Log.i(Env.TAG,"onTouchEvent: "+event.getAction()+", x:"+event.getX()+", y:"+event.getY());
        // create ball
        Ball b = new Ball(event.getX(), event.getY());
        balls.add(b);
        ObjectAnimator a = ObjectAnimator.ofFloat(b, "y", 0).setDuration(3000);
        a.addListener(new AnimatorListenerAdapter() {
            public void onAnimationEnd(Animator animation) {
                balls.remove(((ObjectAnimator) animation).getTarget());
            }
        });
        a.start();
        return true;
    }

    protected void onDraw(Canvas canvas) {
	//    Log.i(Env.TAG,"balls: "+balls.size());
        for (int i = 0; i < balls.size(); ++i)
            balls.get(i).draw(canvas);
    }
}
