import { CssBaseline } from "@material-ui/core";
import * as React from "react";

import { ReduxHeader } from "./component-containers/ReduxHeader";

import "typeface-roboto";
import "./App.css";
import ReduxHome from "./pages/Home";
import ReduxPets from "./pages/Pets";
import ReduxVets from "./pages/Vets";
import { IAppState } from "./shared/Interfaces";

// tslint:disable-next-line:no-empty-interface
export interface IAppProps extends IAppState {}

const App = (props: IAppProps) => {
  return (
    <React.Fragment>
      <CssBaseline />
      <ReduxHeader />

      <ReduxHome />
      <ReduxPets />
      <ReduxVets />
    </React.Fragment>
  );
};

export default App;
