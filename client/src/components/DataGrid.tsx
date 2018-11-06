import {
  EditingState,
  FilteringState,
  IntegratedFiltering,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
  PagingState,
  SelectionState,
  SortingState
} from "@devexpress/dx-react-grid";
import {
  DragDropProvider,
  Grid,
  PagingPanel,
  Table,
  TableBandHeader,
  TableColumnReordering,
  TableColumnResizing,
  TableEditColumn,
  TableEditRow,
  TableFilterRow,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
// tslint:disable-next-line:ordered-imports
import { Paper } from "@material-ui/core";
import * as React from "react";
import { connect } from "react-redux";

import { DataType } from "../logic/Data";
import { ActionType, IAppState } from "../shared/Interfaces";

const GRID_STATE_CHANGE_ACTION = ActionType.DataGridStateChange;

export interface IDataGridProps extends IAppState {
  dataGridType: DataType;
  onSortingChange: any;
  onSelectionChange: any;
  onFiltersChange: any;
  onCurrentPageChange: any;
  onPageSizeChange: any;
  onColumnOrderChange: any;
  onColumnWidthsChange: any;
  onEditingRowIdsChange: any;
  onRowChangesChange: any;
  onAddedRowsChange: any;
  onCommitChanges: any;
  onAddRecord: any;
}

const GridContainer = (props: IDataGridProps) => {
  const gridProps = props.ui.grid[props.dataGridType];

  return (
    <Paper>
      <Grid rows={gridProps.rows} columns={gridProps.columns}>
        <FilteringState
          filters={gridProps.filters}
          onFiltersChange={props.onFiltersChange}
        />
        <SortingState
          sorting={gridProps.sorting}
          onSortingChange={props.onSortingChange}
        />
        <PagingState
          currentPage={gridProps.currentPage}
          onCurrentPageChange={props.onCurrentPageChange}
          pageSize={gridProps.pageSize}
          onPageSizeChange={props.onPageSizeChange}
        />
        <SelectionState
          selection={gridProps.selection}
          onSelectionChange={props.onSelectionChange}
        />
        <EditingState
          editingRowIds={gridProps.editingRowIds}
          onEditingRowIdsChange={props.onEditingRowIdsChange}
          rowChanges={gridProps.rowChanges}
          onRowChangesChange={props.onRowChangesChange}
          addedRows={gridProps.addedRows}
          onAddedRowsChange={props.onAddedRowsChange}
          onCommitChanges={props.onCommitChanges}
        />

        <IntegratedFiltering />
        <IntegratedSorting />
        <IntegratedPaging />
        <IntegratedSelection />

        <DragDropProvider />

        <Table />

        <TableColumnResizing
          columnWidths={gridProps.columnWidths}
          onColumnWidthsChange={props.onColumnWidthsChange}
        />
        <TableHeaderRow showSortingControls={true} />
        <TableColumnReordering
          order={gridProps.columnOrder}
          onOrderChange={props.onColumnOrderChange}
        />

        <TableFilterRow />
        <PagingPanel pageSizes={gridProps.pageSizes} />
        <TableEditRow />
        <TableEditColumn
          showAddCommand={true}
          showEditCommand={false}
          showDeleteCommand={false}
        />
        {!gridProps.columnBands || gridProps.columnBands.length === 0 ? (
          <React.Fragment />
        ) : (
          <TableBandHeader columnBands={gridProps.columnBands} />
        )}
      </Grid>
    </Paper>
  );
};

export const DefaultDataGridInitialState = {
  sorting: [],
  // tslint:disable-next-line:object-literal-sort-keys
  selection: [],
  // expandedRowIds: [1],
  filters: [],
  currentPage: 0,
  pageSize: 10,
  pageSizes: [5, 10, 15],
  columnOrder: [],
  columnWidths: [],
  columns: [],
  rows: [],
  editingRowIds: [],
  addedRows: [],
  rowChanges: {}
};

export const createGridAction = (
  dataGridType: any,
  currentGridState: any,
  partialStateName: any,
  partialStateValue: any
) => ({
  currentGridState,
  dataGridType,
  partialStateName,
  partialStateValue,
  type: GRID_STATE_CHANGE_ACTION
});

const mapStateToProps = (state: any) => state;
const mapDispatchToProps = (dispatch: any) => ({ dispatch });

const mergeProps = (
  stateProps: IAppState,
  dispatchProps: any,
  ownProps: any
) => {
  const dispatch = dispatchProps.dispatch;

  const dispatchers = {
    onSortingChange: (sorting: any) => {
      return dispatch(
        createGridAction(
          merged.dataGridType,
          merged.ui.grid[merged.dataGridType],
          "sorting",
          sorting
        )
      );
    },
    // tslint:disable-next-line:object-literal-sort-keys
    onSelectionChange: (selection: any) => {
      return dispatch(
        createGridAction(
          merged.dataGridType,
          merged.ui.grid[merged.dataGridType],
          "selection",
          selection
        )
      );
    },
    onFiltersChange: (filters: any) => {
      return dispatch(
        createGridAction(
          merged.dataGridType,
          merged.ui.grid[merged.dataGridType],
          "filters",
          filters
        )
      );
    },
    onCurrentPageChange: (currentPage: any) => {
      return dispatch(
        createGridAction(
          merged.dataGridType,
          merged.ui.grid[merged.dataGridType],
          "currentPage",
          currentPage
        )
      );
    },
    onPageSizeChange: (pageSize: any) => {
      return dispatch(
        createGridAction(
          merged.dataGridType,
          merged.ui.grid[merged.dataGridType],
          "pageSize",
          pageSize
        )
      );
    },
    onColumnOrderChange: (order: any) => {
      return dispatch(
        createGridAction(
          merged.dataGridType,
          merged.ui.grid[merged.dataGridType],
          "columnOrder",
          order
        )
      );
    },
    onColumnWidthsChange: (widths: any) => {
      return dispatch(
        createGridAction(
          merged.dataGridType,
          merged.ui.grid[merged.dataGridType],
          "columnWidths",
          widths
        )
      );
    },
    onAddedRowsChange: (rows: any) => {
      return dispatch(
        createGridAction(
          merged.dataGridType,
          merged.ui.grid[merged.dataGridType],
          "addedRows",
          rows && rows.length >= 1 ? [rows[0]] : []
        )
      );
    },
    onCommitChanges: (added: any, changed: any, deleted: any) => {
      if (!added || !added.added || added.added.length <= 0) {
        return;
      }

      const record = added.added[0];
      if (record === undefined) {
        return;
      }

      ownProps.onAddRecord(merged, record, dispatch);
    }
  };

  const merged = { ...stateProps, ...dispatchers, ...ownProps };
  return merged;
};

const DataGrid = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(GridContainer);
export default DataGrid;
