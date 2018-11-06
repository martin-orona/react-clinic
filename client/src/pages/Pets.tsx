import * as React from "react";
import { connect } from "react-redux";

import { ReduxPetsDataGrid } from "../component-containers/ReduxPetsDataGrid";
import Data from "../logic/Data";
import { Pages } from "../logic/Navigation";
import { IAppState } from "../shared/Interfaces";
import { buildState } from "../shared/Utilities";
import Page from "./Page";

interface IPetsPageProps extends IAppState {
  requestPetList: () => void;
}
const Pets = (props: IPetsPageProps) => {
  if (props.ui.currentPage === Pages.Pets) {
    props.requestPetList();
  }

  return (
    <Page whichPage={Pages.Pets}>
      <p>What would you like to do?</p>
      <h2>You should be seeing a list of pets below!!</h2>

      <ReduxPetsDataGrid />
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
    {
      ui: stateProps.ui,
      whichPage: ownProps.whichPage
    },
    {
      requestPetList: () => {
        Data.request.pets(stateProps, dispatchProps.dispatch);
      }
    },
    ownProps
  );
};

const ReduxPets = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Pets);
export default ReduxPets;
