import * as React from "react";
import { connect } from "react-redux";

import { Pages } from "../logic/Navigation";
import { IAppConfig, IAppState } from "../shared/Interfaces";
import Page from "./Page";

const Home = (props: IAppConfig) => {
  return (
    <Page whichPage={Pages.Home}>
      <p>Welcome to the {props.businessName} pet clinic.</p>
      <p>What would you like to do?</p>
    </Page>
  );
};

const mapStateToProps = (state: IAppState) => state.config;

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

const ReduxHome = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
export default ReduxHome;
