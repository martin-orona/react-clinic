import * as React from "react";

import { ReduxPetAppointmentsDataGrid } from "../component-containers/ReduxPetAppointmentsDataGrid";
import { DataType } from "../logic/Data";
import { IAppState, IPetTableRecord } from "../shared/Interfaces";

export interface IPetApointmentsProps extends IAppState {
  ID: number;
  requestAppointments: (id: number) => void;
}

class PetAppointments extends React.Component<IPetApointmentsProps> {
  public componentDidMount() {
    this.props.requestAppointments(this.props.ID);
  }

  public render() {
    const pets = this.props.data.values[DataType.Pets];
    const pet =
      pets && pets.data.find((p: IPetTableRecord) => p.ID === this.props.ID);

    return (
      <React.Fragment>
        <div>
          <h3>Apointments for {pet.NAME}</h3>
          <ReduxPetAppointmentsDataGrid ID={pet.ID} />
        </div>
      </React.Fragment>
    );
  }
}

export default PetAppointments;
