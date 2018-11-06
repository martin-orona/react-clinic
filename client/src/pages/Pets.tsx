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

class Pets extends React.Component<IPetsPageProps> {
  public componentDidMount() {
    this.props.requestPetList();
  }

  public render() {
    return (
      <Page whichPage={Pages.Pets}>
        <p>These are the lovely patients that give our lives meaning.</p>

        <ReduxPetsDataGrid />
      </Page>
    );
  }
}

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
