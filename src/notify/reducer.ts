import { INotifyReducerAction, NotifyModel } from './types';

export function reducer(state: NotifyModel[], action: INotifyReducerAction) {
  switch (action.type) {
    case 'ADD': {
      state = [...state, action.payload];
      return state;
    }

    case 'REMOVE': {
      state = state.filter((v) => v.id !== action.payload);
      return state;
    }

    case 'REMOVE_ALL': {
      if (!action.payload) state = [];
      else state = state.filter((v) => v.uid !== action.payload);
      return state;
    }

    default:
      return state;
  }
  
}
