import { DataType } from "../logic/Data";
import { Pages } from "../logic/Navigation";

// #region app state

export interface IAppState {
  config: IAppConfig;
  ui: IUiState;
  data: IDataState;
}

export interface IAppConfig {
  businessName: string;
  dataCacheGoneStalePeriod_inSeconds: number;
}

export interface IUiState {
  currentPage: Pages;
  grid: { [key: string]: IDataGridState };
}

export interface IDataGridState {
  columns: any;
  columnBands: any;
  rows: any;
  sorting: any;
  onSortingChange: any;
  selection: any;
  onSelectionChange: any;
  filters: any;
  onFiltersChange: any;
  currentPage: any;
  onCurrentPageChange: any;
  pageSize: any;
  onPageSizeChange: any;
  pageSizes: any;
  columnOrder: any;
  columnWidths: any;
  editingRowIds: any;
  addedRows: any;
  rowChanges: any;
}

export interface IDataState {
  isKnownStale: { [key: string]: boolean };
  lastUpdate: { [key: string]: Date };
  lastRequest: { [key: string]: Date };
  values: { [key: string]: IDataResponse };
}

export interface IDataResponse {
  dataType: DataType;
  resultCount: number;
  data: any;
}

export interface IPetTableRecord extends IPetDisplayData {
  ID: number;
  OWNER_ID: number;
  TYPE_ID: number;
}

export interface IPetDisplayData {
  BIRTH_DATE: string;
  NAME: string;
  OWNER_FIRST_NAME: string;
  OWNER_LAST_NAME: string;
  TYPE_NAME: string;
}

// tslint:disable-next-line:no-empty-interface
export interface IAddPetData extends IPetDisplayData {}

export interface IVetTableRecord extends IVetDisplayData {
  ID: number;
}

export interface IVetDisplayData {
  FIRST_NAME: string;
  LAST_NAME: string;
}

// tslint:disable-next-line:no-empty-interface
export interface IAddVetData extends IVetDisplayData {}

// #endregion app state

// #region redux interfaces

export enum ActionType {
  NavigateToPage = "NavigateToPage",

  DataGridStateChange = "DataGridStateChange",
  DataGridNotReadyToSave = "DataGridNotReadyToSave",

  DataRequestBegin = "DataRequestBegin",
  DataRequestComplete = "DataRequestComplete",
  DataRequestFailed = "DataRequestFailed",

  DataAddRequestBegin = "DataAddRequestBegin",
  DataAddRequestComplete = "DataAddRequestComplete",
  DataAddRequestFailed = "DataAddRequestFailed"
}

export interface IAction {
  type: ActionType;
}

export interface INavigateToPageAction extends IAction {
  page: Pages;
}

export interface IDataGridNotReadyToSaveAction extends IAction {
  dataGridType: DataType;
  added: any;
}

export interface IDataRequestBeginAction extends IAction {
  dataType: DataType;
  when: Date;
}

export interface IDataRequestCompleteAction extends IAction {
  dataType: DataType;
  when: Date;
  response: any;
}

export interface IDataRequestFailedAction extends IAction {
  dataType: DataType;
  error: any;
}

export interface IDataAddBeginAction extends IAction {
  data: any;
  dataType: DataType;
  when: Date;
}

export interface IDataAddCompleteAction extends IAction {
  data: any;
  dataType: DataType;
  when: Date;
  response: any;
}

export interface IDataAddFailedAction extends IAction {
  data: any;
  dataType: DataType;
  error: any;
}

// #endregion redux interfaces
