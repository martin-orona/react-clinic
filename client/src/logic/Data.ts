import {
  ActionType,
  IAddPetAppointmentData,
  IAddPetData,
  IAddVetData,
  IAppState,
  IDataGridNotReadyToSaveAction,
  IDataRequestBeginAction,
  IDataRequestCompleteAction,
  IDataRequestFailedAction
} from "../shared/Interfaces";
import { buildState, IActionHandlerDictionary } from "../shared/Utilities";
import Server from "./ServerApi";

// #region interfaces

export enum DataType {
  Unknown = "Unknown",
  Pets = "Pets",
  Vets = "Vets",
  PetAppointments = "PetAppointments"
}

// #endregion interfaces

// #region action handlers

export const DataActionHandlers: IActionHandlerDictionary = {
  sync: {
    [ActionType.DataGridStateChange]: dataGridStateChange,
    [ActionType.DataGridNotReadyToSave]: dataGridNotReadyToSave,

    [ActionType.DataRequestBegin]: dataRequestBegin,
    [ActionType.DataRequestComplete]: dataRequestComplete,
    [ActionType.DataRequestFailed]: dataRequestFailed
  }
};

// #region reducers

function dataGridStateChange(state: IAppState, action: any) {
  const updated = buildState(state, {
    ui: { grid: { [action.dataGridType]: action.currentGridState } }
  });

  updated.ui.grid[action.dataGridType][action.partialStateName] =
    action.partialStateValue;

  return updated;
}

function dataGridNotReadyToSave(
  state: IAppState,
  action: IDataGridNotReadyToSaveAction
) {
  return buildState(state, {
    ui: { grid: { [action.dataGridType]: { addedRows: action.added } } }
  });
}

function dataRequestBegin(state: IAppState, action: IDataRequestBeginAction) {
  return buildState(state, {
    data: { lastRequest: { [action.dataType]: new Date() } }
  });
}

function dataRequestComplete(
  state: IAppState,
  action: IDataRequestCompleteAction
) {
  return buildState(state, {
    data: {
      isKnownStale: { [action.dataType]: false },
      lastUpdate: { [action.dataType]: action.when },
      values: {
        [action.dataType]:
          action.dataType !== DataType.PetAppointments
            ? action.response
            : {
                [action.recordId]: action.response
              }
      }
    }
  } as IAppState);
}

function dataRequestFailed(state: IAppState, action: IDataRequestFailedAction) {
  // TODO: add error handling
  return state;
}

// #endregion reducers

// #region requests

function requestPetAppointments(
  state: IAppState,
  petId: number,
  dispatch: any
) {
  const shouldRequest = shouldRequestData(state, DataType.PetAppointments);

  // tslint:disable-next-line:no-console
  console.log(
    `data request: type:${DataType.PetAppointments} should:${
      shouldRequest.should
    } reason:${shouldRequest.reason}`
  );

  if (shouldRequest.should) {
    // tslint:disable-next-line:no-console
    console.log('"calling" server');

    // dispatch(callServer_InitialRequest(stateProps) as any);
    dispatch(Server.getPetAppointments(petId, dispatch));
  }
}

function requestPets(state: IAppState, dispatch: any) {
  const shouldRequest = shouldRequestData(state, DataType.Pets);

  // tslint:disable-next-line:no-console
  console.log(
    `data request: type:${DataType.Pets} should:${
      shouldRequest.should
    } reason:${shouldRequest.reason}`
  );

  if (shouldRequest.should) {
    // tslint:disable-next-line:no-console
    console.log('"calling" server');

    // dispatch(callServer_InitialRequest(stateProps) as any);
    dispatch(Server.getPets(dispatch));
  }
}

function requestVets(state: IAppState, dispatch: any) {
  const shouldRequest = shouldRequestData(state, DataType.Vets);

  // tslint:disable-next-line:no-console
  console.log(
    `data request: type:${DataType.Vets} should:${
      shouldRequest.should
    } reason:${shouldRequest.reason}`
  );

  if (shouldRequest.should) {
    // tslint:disable-next-line:no-console
    console.log('"calling" server');

    // dispatch(callServer_InitialRequest(stateProps) as any);
    dispatch(Server.getVets(dispatch));
  }
}

function addPet(state: IAppState, pet: IAddPetData, dispatch: any) {
  let hasAllRequiredProperties = true;

  if (!pet.hasOwnProperty("NAME")) {
    hasAllRequiredProperties = false;
  }

  if (!pet.hasOwnProperty("TYPE_NAME")) {
    hasAllRequiredProperties = false;
  }

  if (!pet.hasOwnProperty("BIRTH_DATE")) {
    hasAllRequiredProperties = false;
  }

  if (!pet.hasOwnProperty("OWNER_FIRST_NAME")) {
    hasAllRequiredProperties = false;
  }

  if (!pet.hasOwnProperty("OWNER_LAST_NAME")) {
    hasAllRequiredProperties = false;
  }

  if (!hasAllRequiredProperties) {
    window.setTimeout(() => {
      dispatch({
        added: [pet],
        dataGridType: DataType.Pets,
        type: ActionType.DataGridNotReadyToSave
      } as IDataGridNotReadyToSaveAction);
    }, 10);

    return;
  }

  dispatch(Server.addPet(state, pet, dispatch));
}

function addVet(state: IAppState, vet: IAddVetData, dispatch: any) {
  let hasAllRequiredProperties = true;

  if (!vet.hasOwnProperty("FIRST_NAME")) {
    hasAllRequiredProperties = false;
  }

  if (!vet.hasOwnProperty("LAST_NAME")) {
    hasAllRequiredProperties = false;
  }

  if (!hasAllRequiredProperties) {
    window.setTimeout(() => {
      dispatch({
        added: [vet],
        dataGridType: DataType.Vets,
        type: ActionType.DataGridNotReadyToSave
      } as IDataGridNotReadyToSaveAction);
    }, 10);

    return;
  }

  dispatch(Server.addVet(state, vet, dispatch));
}

function addPetApointment(
  state: IAppState,
  petId: number,
  record: IAddPetAppointmentData,
  dispatch: any
) {
  let hasAllRequiredProperties = true;

  record.PET_ID = petId;

  if (!record.hasOwnProperty("SCHEDULED_DATE")) {
    hasAllRequiredProperties = false;
  }

  if (!record.hasOwnProperty("VET_LAST_NAME")) {
    hasAllRequiredProperties = false;
  }

  if (!hasAllRequiredProperties) {
    window.setTimeout(() => {
      dispatch({
        added: [record],
        dataGridType: DataType.PetAppointments,
        type: ActionType.DataGridNotReadyToSave
      } as IDataGridNotReadyToSaveAction);
    }, 10);

    return;
  }

  dispatch(Server.addPetApointment(state, record, dispatch));
}

const Requests = {
  petAppointments: requestPetAppointments,
  pets: requestPets,
  vets: requestVets,

  addPet,
  addPetApointment,
  addVet
};

// #endregion requests

// #region helpers

// interface ShouldRequestDataResult {
//   should: boolean;
//   reason: string;
// }

function shouldRequestData(state: IAppState, type: DataType) {
  let should = state.data.isKnownStale[type];
  let reason = should ? "known stale" : "not known stale";

  if (
    !should &&
    isStale(
      state.data.lastUpdate[type],
      state.config.dataCacheGoneStalePeriod_inSeconds
    )
  ) {
    should = true;
    reason = "data update stale";
  }

  if (
    should &&
    !isStale(
      state.data.lastRequest[type],
      state.config.dataCacheGoneStalePeriod_inSeconds
    )
  ) {
    should = false;
    reason = "request outstanding";
  }

  return { should, reason };
}

// tslint:disable-next-line:variable-name
function isStale(lastUpdate: Date, stalePeriod_inSeconds: number) {
  // tslint:disable-next-line:variable-name
  const now_inMilliseconds = new Date().valueOf();
  // tslint:disable-next-line:variable-name
  const staleDate_inMilliseconds =
    now_inMilliseconds - stalePeriod_inSeconds * 1000;
  // tslint:disable-next-line:variable-name
  const lastUpdate_inMilliseconds = lastUpdate.valueOf();

  return lastUpdate_inMilliseconds < staleDate_inMilliseconds;
}

// #endregion helpers

const Data = { request: Requests };
export default Data;
