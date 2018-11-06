import { connect } from "react-redux";

import Header from "../components/Header";
import { Navigators } from "../logic/Navigation";
import { IAppState } from "../shared/Interfaces";
import { buildState } from "../shared/Utilities";

const mapStateToProps = (state: IAppState) => state;

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

const mergeProps = (
  stateProps: IAppState,
  dispatchProps: any,
  ownProps: any
) => {
  const merged = buildState(
    { config: stateProps.config },
    {
      onNavigateToHome: () =>
        Navigators.navigateToHome(stateProps, dispatchProps.dispatch),
      onNavigateToPets: () =>
        Navigators.navigateToPets(stateProps, dispatchProps.dispatch)
    },
    ownProps
  );
  return merged;
};

export const ReduxHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Header);
