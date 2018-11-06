import * as React from "react";
import { connect } from "react-redux";

import { Pages } from "../logic/Navigation";
import { IAppState, IUiState } from "../shared/Interfaces";
import { buildState } from "../shared/Utilities";

export interface IPageProps {
  whichPage: Pages;
  ui: IUiState;
  children?: React.ReactNode;
}

const Page = (props: IPageProps) => {
  if (props.whichPage === props.ui.currentPage) {
    return <div className="page container">{props.children}</div>;
  } else {
    return React.Fragment;
  }
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
    // dispatchProps,
    ownProps
  );
};

const ReduxPage = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Page as React.StatelessComponent);

export default ReduxPage;
