import { connect } from "react-redux";

import DataGrid, { DefaultDataGridInitialState } from "../components/DataGrid";
import Data, { DataType } from "../logic/Data";
import { IAddPetAppointmentData, IAppState } from "../shared/Interfaces";
import { buildState } from "../shared/Utilities";

const mapStateToProps = (state: IAppState) => state;

const mapDispatchToProps = (dispatch: any) => ({ dispatch });

const mergeProps = (
  stateProps: IAppState,
  dispatchProps: any,
  ownProps: any
) => {
  const initialColumnWidth = 200;

  return buildState(
    stateProps,
    {
      onAddRecord: (
        state: IAppState,
        record: IAddPetAppointmentData,
        dispatch: any
      ) => {
        Data.request.addPetApointment(state, ownProps.ID, record, dispatch);
      }
    },
    ownProps,
    {
      dataGridType: DataType.PetAppointments,
      ui: stateProps.ui.grid.hasOwnProperty(DataType.PetAppointments)
        ? {}
        : {
            grid: {
              [DataType.PetAppointments]: {
                ...DefaultDataGridInitialState,

                columns: [
                  { name: "SCHEDULED_DATE", title: "Date" },
                  { name: "VET_LAST_NAME", title: "Last" },
                  { name: "DESCRIPTION", title: "Description" }
                ],
                rows:
                  stateProps.data.values[DataType.PetAppointments] &&
                  stateProps.data.values[DataType.PetAppointments][ownProps.ID]
                    ? stateProps.data.values[DataType.PetAppointments][
                        ownProps.ID
                      ].data
                    : [],

                columnOrder: ["SCHEDULED_DATE", "VET_LAST_NAME", "DESCRIPTION"],
                columnWidths: [
                  { columnName: "SCHEDULED_DATE", width: initialColumnWidth },
                  { columnName: "VET_LAST_NAME", width: initialColumnWidth },
                  { columnName: "DESCRIPTION", width: initialColumnWidth }
                ],

                isExpandingRowsEnabled: false,
                isPagingEnabled: false
              }
            }
          }
    }
  );
};

export const ReduxPetAppointmentsDataGrid = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DataGrid);
