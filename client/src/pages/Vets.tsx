import * as React from "react";
import { connect } from "react-redux";

import { ReduxVetsDataGrid } from "../component-containers/ReduxVetsDataGrid";
import Data from "../logic/Data";
import { Pages } from "../logic/Navigation";
import { IAppState } from "../shared/Interfaces";
import { buildState } from "../shared/Utilities";
import Page from "./Page";

interface IVetsPageProps extends IAppState {
  requestVetList: () => void;
}
const Vets = (props: IVetsPageProps) => {
  return (
    <Page whichPage={Pages.Vets}>
      <p>
        These are the heroes that save out patients, they deserve a prime time
        drama; 20 years ago!
      </p>

      <ReduxVetsDataGrid />
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
    { whichPage: ownProps.whichPage },
    {
      requestVetList: () => {
        Data.request.vets(stateProps, dispatchProps.dispatch);
      }
    },
    ownProps
  );
};

const ReduxVets = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Vets);
export default ReduxVets;
