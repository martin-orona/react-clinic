import * as React from "react";

import { ReduxPetAppointments } from "../component-containers/ReduxPetAppointments";
import { IPetTableRecord } from "../shared/Interfaces";

const PetsRowDetail = ({ row }: { row: IPetTableRecord }) => (
  <div>
    <ReduxPetAppointments {...row} />
  </div>
);

export default PetsRowDetail;
