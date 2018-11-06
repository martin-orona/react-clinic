import * as _ from "lodash";

import { IAction, IAppState } from "./Interfaces";

// #region redux

// #region redux reducers

export interface ISyncActionHandlerDictionary {
  [key: string]: (state: IAppState, action: IAction) => IAppState;
}

export interface IAsyncActionHandlerDictionary {
  [key: string]: (
    state: IAppState,
    action: IAction
  ) => (dispatch: any) => Promise<any>;
}

export interface IActionHandlerDictionary {
  sync: ISyncActionHandlerDictionary;
  async?: IAsyncActionHandlerDictionary;
}

// NOTE: A "reducer" is a function that converts the current app state into
// a new app state; a la Array.reduce(); aka, state + action -> state.
function registerReducers(
  initialState: IAppState,
  reducers: IActionHandlerDictionary
) {
  return function reducer(state: IAppState = initialState, action: IAction) {
    if (reducers.sync.hasOwnProperty(action.type)) {
      // tslint:disable-next-line:no-console
      console.log(`sync action handler: ${action.type}`);
      return reducers.sync[action.type](state, action);
    } else if (reducers.async && reducers.async.hasOwnProperty(action.type)) {
      return (dispatch: any) => {
        // tslint:disable-next-line:no-console
        console.log(`Async action handler: ${action.type}`);
        return (reducers.async as IAsyncActionHandlerDictionary)[action.type];
      };
    } else {
      return state;
    }
  };
}

export const Reducers = { register: registerReducers };

// #endregion redux reducers

// #endregion redux

// #region object copying

export function buildState(current: any, ...modifications: any[]) {
  return _.merge({}, current, ...modifications);
}

// #endregion object copying
