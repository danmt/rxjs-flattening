import { animationFrameScheduler, defer, interval, timer } from 'rxjs';
import { map, takeWhile, tap, takeLast } from 'rxjs/operators';

export const duration = (t) => defer(() => {
  const t0 = Date.now();
  return interval(0, animationFrameScheduler).pipe(
    map(() => Date.now()),
    map(t1 => t1 - t0),
    map((dt: number) => dt / t),
    takeWhile(n => n <= 1)
  )
});

export const distance = (x, t) => duration(t).pipe(map(frame => frame * x));

export const moveRight = (id, x, t = 1000) => duration(t).pipe(
  map((t: number) => t * x),
  tap((x: number) => document.getElementById(id).style.left = x + 'px'),
  takeLast(1),
);
