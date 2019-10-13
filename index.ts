// Import stylesheets
import './style.css';
import { merge, fromEvent } from 'rxjs';
import { map, filter, withLatestFrom, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { duration, moveRight } from './animation';
import { store$, reducer, State, dispatcher } from './state';
import { effects } from './effects';
import * as Actions from './actions';

const addButton = document.getElementById('add') as HTMLButtonElement;
const sendButton = document.getElementById('send') as HTMLButtonElement;
const serieTypeSelector = document.getElementById('serie-type') as HTMLSelectElement;
const speedSelector = document.getElementById('speed') as HTMLSelectElement;
const baseSpeed = 2000;
const getSpeed = () => baseSpeed / parseFloat(speedSelector.options[speedSelector.selectedIndex].value);
const getSerieType = () => serieTypeSelector.options[serieTypeSelector.selectedIndex].value;

// Actions dispatchers
const add$ = fromEvent(addButton, 'click').pipe(
  map(() => new Actions.Add(uuid()))
);
const send$ = fromEvent(sendButton, 'click').pipe(
  withLatestFrom(store$, (_, state: State) => state),
  filter((state: State) => state.circles[0] && state.added > state.pending),
  map((state: State) => new Actions.Send(state.circles[0], getSerieType(), getSpeed()))
);

merge(add$, send$).subscribe(dispatcher);
merge(...effects).subscribe(dispatcher);
