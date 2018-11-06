import { Button } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";

import { Navigators, Pages } from "../logic/Navigation";
import { IAppState } from "../shared/Interfaces";
import { buildState } from "../shared/Utilities";
import Page from "./Page";

interface IHomeProps extends IAppState {
  onNavigateToPets: () => void;
  onNavigateToVets: () => void;
}

const Home = (props: IHomeProps) => {
  return (
    <Page whichPage={Pages.Home}>
      <p>Welcome to the {props.config.businessName} pet clinic.</p>
      <p>What would you like to do?</p>
      <Button color="inherit" onClick={props.onNavigateToPets}>
        Pets
      </Button>
      <Button color="inherit" onClick={props.onNavigateToVets}>
        Vets
      </Button>
    </Page>
  );
};

const mapStateToProps = (state: IAppState) => state;

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

const mergeProps = (
  stateProps: IAppState,
  dispatchProps: any,
  ownProps: any
) => {
  return buildState(
    stateProps,
    {
      onNavigateToPets: () =>
        Navigators.navigateToPets(stateProps, dispatchProps.dispatch),
      onNavigateToVets: () =>
        Navigators.navigateToVets(stateProps, dispatchProps.dispatch)
    },
    ownProps
  );
};

const ReduxHome = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Home);
export default ReduxHome;
