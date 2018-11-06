import {
  ActionType,
  IAddPetData,
  IAddVetData,
  IAppState,
  IDataAddBeginAction,
  IDataAddCompleteAction,
  IDataAddFailedAction,
  IDataRequestBeginAction,
  IDataRequestCompleteAction,
  IDataRequestFailedAction
} from "../shared/Interfaces";
import { DataType } from "./Data";

// #region get

function getPets(dispatch: any) {
  return getData(dispatch, DataType.Pets);
}

function getVets(dispatch: any) {
  return getData(dispatch, DataType.Vets);
}

// #region get

// #region put

// TODO: Consider refactoring these very similar looking functions
function addPet(state: IAppState, pet: IAddPetData, dispatch: any) {
  dispatch({
    data: pet,
    dataType: DataType.Pets,
    type: ActionType.DataAddRequestBegin,
    when: new Date()
  } as IDataAddBeginAction);

  // tslint:disable-next-line:no-shadowed-variable
  return async function adder(dispatch: any) {
    dispatch(Server.addPet(state, pet, dispatch));

    const request = new Request("/api/add", {
      body: JSON.stringify({ dataType: DataType.Pets, data: pet }),
      headers: { "Content-Type": "application/json" },
      method: "post"
    });

    return fetch(request)
      .then(
        (response: Response) => {
          return response.json();
        },
        (error: any) =>
          dispatch({
            data: pet,
            dataType: DataType.Pets,
            error,
            type: ActionType.DataAddRequestFailed
          } as IDataAddFailedAction)
      )
      .then((response: any) =>
        dispatch({
          data: pet,
          dataType: DataType.Pets,
          response,
          type: ActionType.DataAddRequestComplete,
          when: new Date()
        } as IDataAddCompleteAction)
      );
  };
}

function addVet(state: IAppState, vet: IAddVetData, dispatch: any) {
  dispatch({
    data: vet,
    dataType: DataType.Vets,
    type: ActionType.DataAddRequestBegin,
    when: new Date()
  } as IDataAddBeginAction);

  // tslint:disable-next-line:no-shadowed-variable
  return async function adder(dispatch: any) {
    dispatch(Server.addVet(state, vet, dispatch));

    const request = new Request("/api/add", {
      body: JSON.stringify({ dataType: DataType.Vets, data: vet }),
      headers: { "Content-Type": "application/json" },
      method: "post"
    });

    return fetch(request)
      .then(
        (response: Response) => {
          return response.json();
        },
        (error: any) =>
          dispatch({
            data: vet,
            dataType: DataType.Vets,
            error,
            type: ActionType.DataAddRequestFailed
          } as IDataAddFailedAction)
      )
      .then((response: any) =>
        dispatch({
          data: vet,
          dataType: DataType.Vets,
          response,
          type: ActionType.DataAddRequestComplete,
          when: new Date()
        } as IDataAddCompleteAction)
      );
  };
}

// #region put

// #region helpers

function getData(dispatch: any, dataType: DataType) {
  dispatch({
    dataType,
    type: ActionType.DataRequestBegin,
    when: new Date()
  } as IDataRequestBeginAction);

  // tslint:disable-next-line:no-shadowed-variable
  return async function getter(dispatch: any) {
    const request = new Request("/api/get", {
      body: JSON.stringify({ dataType }),
      headers: { "Content-Type": "application/json" },
      method: "post"
    });

    return fetch(request)
      .then(
        (response: Response) => {
          return response.json();
        },
        (error: any) =>
          dispatch({
            dataType,
            error,
            type: ActionType.DataRequestFailed
          } as IDataRequestFailedAction)
      )
      .then((response: any) =>
        dispatch({
          dataType,
          response,
          type: ActionType.DataRequestComplete,
          when: new Date()
        } as IDataRequestCompleteAction)
      );
  };
}

// #endregion helpers

const Server = {
  getPets,
  getVets,

  addPet,
  addVet
};

export default Server;
