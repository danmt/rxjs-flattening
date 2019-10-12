import { State, store$, dispatcher, actions$ } from './state';
import { filter, tap, withLatestFrom, concatMap, mergeMap, exhaustMap, switchMap, finalize, map } from 'rxjs/operators';
import { moveRight } from './animation';
import * as Actions from './actions';

const canvasElem = document.getElementById('canvas');
const skullsAddedSpan = document.getElementById('skulls-added') as HTMLSpanElement;
const skullsPendingSpan = document.getElementById('skulls-pending') as HTMLSpanElement;
const skullsReceivedSpan = document.getElementById('skulls-received') as HTMLSpanElement;

const skullAdded$ = actions$.pipe(
  filter(({ type }) => type === Actions.ActionTypes.AddSkull),
  tap(({ id }: Actions.AddSkull) => canvasElem.innerHTML += `<div id="${id}" class="skull"></div>`),
  map(() => new Actions.SkullAdded()),
);

const skullRemoved$ = actions$.pipe(
  filter(({ type }) => type === Actions.ActionTypes.SkullReceived),
  tap(({ id }: Actions.SkullReceived) => document.getElementById(id).remove()),
  map(() => new Actions.SkullRemoved())
);

const addedSkullsChanged$ = actions$.pipe(
  filter(({ type }) => 
    type === Actions.ActionTypes.AddSkull || 
    type === Actions.ActionTypes.MergeSkullSent || 
    type === Actions.ActionTypes.ExhaustSkullSent ||
    type === Actions.ActionTypes.SwitchSkullSent ||
    type === Actions.ActionTypes.ConcatSkullReceived
  ),
  withLatestFrom(store$, (action, state: State) => state),
  tap(({ addedSkulls }) => skullsAddedSpan.innerHTML = addedSkulls.toString()),
  map(() => new Actions.AddedSkullsChanged())
);

const pendingSkullsChanged$ = actions$.pipe(
  filter(({ type }) => 
    type === Actions.ActionTypes.SendSkull || 
    type === Actions.ActionTypes.MergeSkullSent || 
    type === Actions.ActionTypes.ExhaustSkullSent ||
    type === Actions.ActionTypes.SwitchSkullSent ||
    type === Actions.ActionTypes.ConcatSkullReceived
  ),
  withLatestFrom(store$, (action, state: State) => state),
  tap(({ pendingSkulls }) => skullsPendingSpan.innerHTML = pendingSkulls.toString()),
  map(() => new Actions.PendingSkullsChanged())
);

const receivedSkullsChanged$ = actions$.pipe(
  filter(({ type }) => 
    type === Actions.ActionTypes.SkullReceived || 
    type === Actions.ActionTypes.ConcatSkullReceived
  ),
  withLatestFrom(store$, (action, state: State) => state),
  tap(({ receivedSkulls }) => skullsReceivedSpan.innerHTML = receivedSkulls.toString()),
  map(() => new Actions.ReceivedSkullsChanged())
);

const skullSent$ = actions$.pipe(
  filter(({ type }) => type === Actions.ActionTypes.SendSkull),
  map((action: Actions.SendSkull) => {
    if (action.serieType === 'MergeSkullSent') {
      return new Actions.MergeSkullSent(action.id, action.speed);
    } else if (action.serieType === 'ConcatSkullSent') {
      return new Actions.ConcatSkullSent(action.id, action.speed);
    } else if (action.serieType === 'ExhaustSkullSent') {
      return new Actions.ExhaustSkullSent(action.id, action.speed);
    } else if (action.serieType === 'SwitchSkullSent') {
      return new Actions.SwitchSkullSent(action.id, action.speed);
    } else {
      return { type: 'Error' };
    }
  })
);

const concatenatedSkulls$ = actions$.pipe(
  filter(({ type }) => type === Actions.ActionTypes.ConcatSkullSent),
  concatMap((action: Actions.ConcatSkullSent) => 
    moveRight(action.id, 820, action.speed).pipe(
      map(() => new Actions.ConcatSkullReceived(action.id))
    )
  ),
);

const mergedSkulls$ = actions$.pipe(
  filter(({ type }) => type === Actions.ActionTypes.MergeSkullSent),
  mergeMap((action: Actions.MergeSkullSent) =>
    moveRight(action.id, 820, action.speed).pipe(
      map(() => new Actions.SkullReceived(action.id))
    )
  ),
);

const exhaustedSkulls$ = actions$.pipe(
  filter(({ type }) => type === Actions.ActionTypes.ExhaustSkullSent),
  exhaustMap((action: Actions.ExhaustSkullSent) =>
    moveRight(action.id, 820, action.speed).pipe(
      map(() => new Actions.SkullReceived(action.id))
    )
  )
);

const switchedSkulls$ = actions$.pipe(
  filter(({ type }) => type === Actions.ActionTypes.SwitchSkullSent),
  switchMap((action: Actions.SwitchSkullSent) => 
    moveRight(action.id, 820, action.speed).pipe(
      finalize(() => document.getElementById(action.id).style.left = '820px'),
      map(() => new Actions.SkullReceived(action.id)),
    )
  )
);

export const effects = [
  skullAdded$, 
  addedSkullsChanged$, 
  pendingSkullsChanged$, 
  receivedSkullsChanged$, 
  skullSent$,
  concatenatedSkulls$, 
  mergedSkulls$, 
  exhaustedSkulls$, 
  switchedSkulls$
];