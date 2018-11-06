import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

import { DataActionHandlers, DataType } from "./logic/Data";
import { NavigationActionHandlers, Pages } from "./logic/Navigation";
import { IAppState } from "./shared/Interfaces";
import { IActionHandlerDictionary, Reducers } from "./shared/Utilities";

export const AppDefaultState: IAppState = {
  config: {
    businessName: "Pets Effervescent Forever",
    dataCacheGoneStalePeriod_inSeconds: 30
  },
  data: {
    isKnownStale: { [DataType.Pets]: true },
    lastRequest: { [DataType.Pets]: new Date(1) },
    lastUpdate: { [DataType.Pets]: new Date(1) },
    values: {}
  },
  ui: {
    currentPage: Pages.Pets,
    grid: {}
  }
};

const AllHandlers: IActionHandlerDictionary = mergeActionHandlers([
  NavigationActionHandlers,
  DataActionHandlers
]);

export function createAppStateStore(
  initialState: IAppState = AppDefaultState,
  actionHandlers?: IActionHandlerDictionary[],
  middleware?: any
) {
  const configuredActionHandlers = mergeActionHandlers([
    AllHandlers,
    ...(actionHandlers || [])
  ]);

  const reducer = Reducers.register(initialState, configuredActionHandlers);

  const configuredMiddleware = !middleware
    ? [thunkMiddleware]
    : [...middleware, thunkMiddleware];

  const stateStore = createStore(
    // TODO: remove hack of casting to any
    reducer as any,
    initialState,
    applyMiddleware(...configuredMiddleware)
  );

  return stateStore;
}

function mergeActionHandlers(handlers: IActionHandlerDictionary[]) {
  if (handlers.length === 1) {
    return handlers[0];
  }

  let sync = {};
  let async = {};

  for (const handler of handlers) {
    sync = Object.assign(sync, handler.sync);

    if (handler.async) {
      async = Object.assign(async, handler.async);
    }
  }

  const merged = { sync } as IActionHandlerDictionary;
  if (Object.keys(async).length > 0) {
    merged.async = async;
  }

  return merged;
}
