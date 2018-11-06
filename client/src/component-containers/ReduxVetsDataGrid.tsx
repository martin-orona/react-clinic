import { connect } from "react-redux";

import DataGrid, { DefaultDataGridInitialState } from "../components/DataGrid";
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
    { onAddRecord: Data.request.addVet },
    ownProps,
    {
      dataGridType: DataType.Vets,
      ui: stateProps.ui.grid.hasOwnProperty(DataType.Vets)
        ? {}
        : {
            grid: {
              [DataType.Vets]: {
                ...DefaultDataGridInitialState,

                columnBands: [],
                columns: [
                  { name: "FIRST_NAME", title: "First" },
                  { name: "LAST_NAME", title: "Last" }
                ],
                rows: stateProps.data.values[DataType.Vets]
                  ? stateProps.data.values[DataType.Vets].data
                  : [],

                columnOrder: ["FIRST_NAME", "LAST_NAME"],
                columnWidths: [
                  { columnName: "LAST_NAME", width: initialColumnWidth },
                  { columnName: "FIRST_NAME", width: initialColumnWidth }
                ]
              }
            }
          }
    }
  );
};

export const ReduxVetsDataGrid = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DataGrid);
