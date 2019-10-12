import { Subject } from 'rxjs';
import { scan, shareReplay, tap } from 'rxjs/operators';
import * as Actions from './actions';

export interface State {
  skulls: string[];
  addedSkulls: number;
  pendingSkulls: number;
  receivedSkulls: number;
}

const initialState: State = { 
  skulls: [], 
  addedSkulls: 0, 
  pendingSkulls: 0, 
  receivedSkulls: 0 
};

export const reducer = (state, action) => {
  switch (action.type) {
    case Actions.ActionTypes.AddSkull:
      return { 
        ...state,
        addedSkulls: state.addedSkulls + 1,
        skulls: [
          ...state.skulls, 
          action.id
        ]
      };
    case Actions.ActionTypes.SendSkull:
      return { 
        ...state,
        pendingSkulls: state.pendingSkulls + 1
      };
    case Actions.ActionTypes.SwitchSkullSent:
    case Actions.ActionTypes.ExhaustSkullSent:
    case Actions.ActionTypes.MergeSkullSent:
      return { 
        ...state,
        pendingSkulls: state.pendingSkulls - 1,
        addedSkulls: state.addedSkulls - 1,
        skulls: state.skulls.filter((skull) => skull !== action.id)
      };
    case Actions.ActionTypes.SkullReceived:
      return { 
        ...state,
        receivedSkulls: state.receivedSkulls + 1
      };
    case Actions.ActionTypes.ConcatSkullReceived:
      return { 
        ...state,
        pendingSkulls: state.pendingSkulls - 1,
        addedSkulls: state.addedSkulls - 1,
        receivedSkulls: state.receivedSkulls + 1,
        skulls: state.skulls.filter((skull) => skull !== action.id)
      };
    default:
      return state;
  }
}

export const dispatcher = new Subject();
export const actions$ = dispatcher.asObservable();
export const store$ = actions$.pipe(
  scan((state: State, action) => reducer(state, action), initialState),
  shareReplay(1),
);