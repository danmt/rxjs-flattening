import { Subject } from 'rxjs';
import { scan, shareReplay, tap } from 'rxjs/operators';
import * as Actions from './actions';

export interface State {
  circles: string[];
  added: number;
  pending: number;
  received: number;
}

const initialState: State = { 
  circles: [], 
  added: 0, 
  pending: 0, 
  received: 0 
};

export const reducer = (state, action) => {
  switch (action.type) {
    case Actions.ActionTypes.Add:
      return { 
        ...state,
        added: state.added + 1,
        circles: [
          ...state.circles, 
          action.id
        ]
      };
    case Actions.ActionTypes.Send:
      return { 
        ...state,
        pending: state.pending + 1
      };
    case Actions.ActionTypes.SwitchSent:
    case Actions.ActionTypes.ExhaustSent:
    case Actions.ActionTypes.MergeSent:
      return { 
        ...state,
        pending: state.pending - 1,
        added: state.added - 1,
        circles: state.circles.filter((circle) => circle !== action.id)
      };
    case Actions.ActionTypes.Received:
      return { 
        ...state,
        received: state.received + 1
      };
    case Actions.ActionTypes.ConcatReceived:
      return { 
        ...state,
        pending: state.pending - 1,
        added: state.added - 1,
        received: state.received + 1,
        circles: state.circles.filter((circle) => circle !== action.id)
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