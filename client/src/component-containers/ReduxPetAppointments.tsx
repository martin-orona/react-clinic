import { connect } from "react-redux";

import PetAppointments from "../components/PetApointments";
import Data from "../logic/Data";
import { IAppState } from "../shared/Interfaces";
import { buildState } from "../shared/Utilities";

const mapStateToProps = (state: IAppState) => state;

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

const mergeProps = (
  stateProps: IAppState,
  dispatchProps: any,
  ownProps: any
) => {
  const dispatch = dispatchProps.dispatch;
  const merged = buildState(
    stateProps,
    {
      requestAppointments: (petId: number) => {
        Data.request.petAppointments(merged, petId, dispatch);
      }
    },
    ownProps
  );
  return merged;
};

export const ReduxPetAppointments = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(PetAppointments);
