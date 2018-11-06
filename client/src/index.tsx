import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import registerServiceWorker from "./registerServiceWorker";

import { createAppStateStore } from "./AppInitialization";
import { ReduxApp } from "./pages/ReduxApp";

import "./index.css";

const stateStore = createAppStateStore();

// tslint:disable-next-line:no-console
console.log(stateStore.getState());
stateStore.subscribe(() =>
  // tslint:disable-next-line:no-console
  console.log(stateStore.getState())
);

ReactDOM.render(
  <Provider store={stateStore}>
    <ReduxApp />
  </Provider>,
  document.getElementById("root") as HTMLElement
);

registerServiceWorker();

// tslint:disable-next-line:no-console
console.log(stateStore.getState());
// unsubscribe();
