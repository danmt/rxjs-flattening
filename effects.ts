import { State, store$, dispatcher, actions$ } from './state';
import { filter, tap, withLatestFrom, concatMap, mergeMap, exhaustMap, switchMap, finalize, map } from 'rxjs/operators';
import { moveRight } from './animation';
import * as Actions from './actions';

const canvasElem = document.getElementById('canvas');
const addedSpan = document.getElementById('added') as HTMLSpanElement;
const pendingSpan = document.getElementById('pending') as HTMLSpanElement;
const receivedSpan = document.getElementById('received') as HTMLSpanElement;

const Added$ = actions$.pipe(
  filter(({ type }) => type === Actions.ActionTypes.Add),
  tap(({ id }: Actions.Add) => canvasElem.innerHTML += `<div id="${id}" class="circle"></div>`),
  map(() => new Actions.Added()),
);

const addedChanged$ = actions$.pipe(
  filter(({ type }) => 
    type === Actions.ActionTypes.Add || 
    type === Actions.ActionTypes.MergeSent || 
    type === Actions.ActionTypes.ExhaustSent ||
    type === Actions.ActionTypes.SwitchSent ||
    type === Actions.ActionTypes.ConcatReceived
  ),
  withLatestFrom(store$, (action, state: State) => state),
  tap(({ added }) => addedSpan.innerHTML = added.toString()),
  map(() => new Actions.AddedChanged())
);

const pendingChanged$ = actions$.pipe(
  filter(({ type }) => 
    type === Actions.ActionTypes.Send || 
    type === Actions.ActionTypes.MergeSent || 
    type === Actions.ActionTypes.ExhaustSent ||
    type === Actions.ActionTypes.SwitchSent ||
    type === Actions.ActionTypes.ConcatReceived
  ),
  withLatestFrom(store$, (action, state: State) => state),
  tap(({ pending }) => pendingSpan.innerHTML = pending.toString()),
  map(() => new Actions.PendingChanged())
);

const receivedChanged$ = actions$.pipe(
  filter(({ type }) => 
    type === Actions.ActionTypes.Received || 
    type === Actions.ActionTypes.ConcatReceived
  ),
  withLatestFrom(store$, (action, state: State) => state),
  tap(({ received }) => receivedSpan.innerHTML = received.toString()),
  map(() => new Actions.ReceivedChanged())
);

const Sent$ = actions$.pipe(
  filter(({ type }) => type === Actions.ActionTypes.Send),
  map((action: Actions.Send) => {
    if (action.serieType === 'MergeSent') {
      return new Actions.MergeSent(action.id, action.speed);
    } else if (action.serieType === 'ConcatSent') {
      return new Actions.ConcatSent(action.id, action.speed);
    } else if (action.serieType === 'ExhaustSent') {
      return new Actions.ExhaustSent(action.id, action.speed);
    } else if (action.serieType === 'SwitchSent') {
      return new Actions.SwitchSent(action.id, action.speed);
    } else {
      return { type: 'Error' };
    }
  })
);

const concatenated$ = actions$.pipe(
  filter(({ type }) => type === Actions.ActionTypes.ConcatSent),
  concatMap((action: Actions.ConcatSent) => 
    moveRight(action.id, 820, action.speed).pipe(
      map(() => new Actions.ConcatReceived(action.id))
    )
  ),
);

const merged$ = actions$.pipe(
  filter(({ type }) => type === Actions.ActionTypes.MergeSent),
  mergeMap((action: Actions.MergeSent) =>
    moveRight(action.id, 820, action.speed).pipe(
      map(() => new Actions.Received())
    )
  ),
);

const exhausted$ = actions$.pipe(
  filter(({ type }) => type === Actions.ActionTypes.ExhaustSent),
  exhaustMap((action: Actions.ExhaustSent) =>
    moveRight(action.id, 820, action.speed).pipe(
      map(() => new Actions.Received())
    )
  )
);

const switched$ = actions$.pipe(
  filter(({ type }) => type === Actions.ActionTypes.SwitchSent),
  switchMap((action: Actions.SwitchSent) => 
    moveRight(action.id, 820, action.speed).pipe(
      finalize(() => document.getElementById(action.id).style.left = '820px'),
      map(() => new Actions.Received()),
    )
  )
);

export const effects = [
  Added$, 
  addedChanged$, 
  pendingChanged$, 
  receivedChanged$, 
  Sent$,
  concatenated$, 
  merged$, 
  exhausted$, 
  switched$
];