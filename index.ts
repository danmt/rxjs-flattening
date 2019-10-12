// Import stylesheets
import './style.css';
import { merge, fromEvent } from 'rxjs';
import { map, filter, withLatestFrom, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { duration, moveRight } from './animation';
import { store$, reducer, State, dispatcher } from './state';
import { effects } from './effects';
import * as Actions from './actions';

const addSkullButton = document.getElementById('add-skull') as HTMLButtonElement;
const sendSkullButton = document.getElementById('send-skull') as HTMLButtonElement;
const serieTypeSelector = document.getElementById('serie-type') as HTMLSelectElement;
const speedSelector = document.getElementById('speed') as HTMLSelectElement;
const baseSpeed = 2000;
const getSpeed = () => baseSpeed / parseFloat(speedSelector.options[speedSelector.selectedIndex].value);
const getSerieType = () => serieTypeSelector.options[serieTypeSelector.selectedIndex].value;

// Actions dispatchers
const addSkull$ = fromEvent(addSkullButton, 'click').pipe(
  map(() => new Actions.AddSkull(`skull-${uuid()}`))
);
const sendSkull$ = fromEvent(sendSkullButton, 'click').pipe(
  withLatestFrom(store$, (_, state: State) => state),
  filter((state: State) => state.skulls[0] && state.addedSkulls > state.pendingSkulls),
  map((state: State) => new Actions.SendSkull(state.skulls[0], getSerieType(), getSpeed()))
);

merge(addSkull$, sendSkull$).subscribe(dispatcher);
merge(...effects).subscribe(dispatcher);
