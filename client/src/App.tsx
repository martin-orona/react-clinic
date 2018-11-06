import { CssBaseline } from "@material-ui/core";
import * as React from "react";

import { ReduxHeader } from "./component-containers/ReduxHeader";

import "typeface-roboto";
import "./App.css";
import ReduxHome from "./pages/Home";
import ReduxPets from "./pages/Pets";
import { IAppState } from "./shared/Interfaces";

// tslint:disable-next-line:no-empty-interface
export interface IAppProps extends IAppState {}

class App extends React.Component {
  public state = { response: "" };

  public componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      // tslint:disable-next-line:no-console
      .catch(err => console.log(err));
  }

  public callApi = async () => {
    const response = await fetch("/api/hello");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  };

  public Api = async () => {
    const response = await fetch("/api/hello");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  };

  public render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <ReduxHeader />

        <ReduxHome />
        <ReduxPets />

        <p>{this.state.response}</p>
      </React.Fragment>
    );
  }
}

export default App;
