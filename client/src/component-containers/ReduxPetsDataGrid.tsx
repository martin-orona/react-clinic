import { connect } from "react-redux";

import DataGrid, { DefaultDataGridInitialState } from "../components/DataGrid";
import PetsRowDetail from "../components/PetsRowDetail";
import Data, { DataType } from "../logic/Data";
import { IAppState } from "../shared/Interfaces";
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
      onAddRecord: Data.request.addPet,
      rowDetailComponent: PetsRowDetail
    },
    ownProps,
    {
      dataGridType: DataType.Pets,
      ui: stateProps.ui.grid.hasOwnProperty(DataType.Pets)
        ? {}
        : {
            grid: {
              [DataType.Pets]: {
                ...DefaultDataGridInitialState,

                columnBands: [
                  {
                    title: "Owner",

                    children: [
                      { columnName: "OWNER_FIRST_NAME" },
                      { columnName: "OWNER_LAST_NAME" }
                    ]
                  }
                ],
                columns: [
                  { name: "NAME", title: "Name" },
                  { name: "TYPE_NAME", title: "Type" },
                  { name: "BIRTH_DATE", title: "Birth Date" },
                  { name: "OWNER_LAST_NAME", title: "Last" },
                  { name: "OWNER_FIRST_NAME", title: "First" }
                ],
                rows: stateProps.data.values[DataType.Pets]
                  ? stateProps.data.values[DataType.Pets].data
                  : [],

                columnOrder: [
                  "NAME",
                  "TYPE_NAME",
                  "BIRTH_DATE",
                  "OWNER_LAST_NAME",
                  "OWNER_FIRST_NAME"
                ],
                columnWidths: [
                  { columnName: "NAME", width: initialColumnWidth },
                  { columnName: "TYPE_NAME", width: initialColumnWidth },
                  { columnName: "BIRTH_DATE", width: initialColumnWidth },
                  { columnName: "OWNER_LAST_NAME", width: initialColumnWidth },
                  { columnName: "OWNER_FIRST_NAME", width: initialColumnWidth }
                ]
              }
            }
          }
    }
  );
};

export const ReduxPetsDataGrid = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DataGrid);

export default ReduxPetsDataGrid;
