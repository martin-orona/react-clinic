import { connect } from "react-redux";

import App, { IAppProps } from "../App";
import { IAppState } from "../shared/Interfaces";
import { buildState } from "../shared/Utilities";

const mapStateToProps = (state: IAppProps) => state;

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

const mergeProps = (
  stateProps: IAppState,
  dispatchProps: any,
  ownProps: any
) => {
  return buildState(stateProps, dispatchProps, ownProps);
};

export const ReduxApp = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(App);
