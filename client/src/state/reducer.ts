import { State } from "./state";
import { Patient, Diagnosis, Entry, Page, PatientEntriesPage } from "../types";

export const setPatientList = (patientPage: Page<Patient>): Action => ({
  type: "SET_PATIENT_LIST",
  payload: patientPage,
});

export const updatePatient = (patient: PatientEntriesPage): Action => ({
  type: "UPDATE_PATIENT",
  payload: patient,
});

export const addEntry = (id: Patient["id"], entry: Entry): Action => ({
  type: "ADD_ENTRY",
  payload: {
    id,
    entry,
  },
});

export const setDiagnosisList = (
  diagnosisListFromApi: Diagnosis[]
): Action => ({
  type: "SET_DIAGNOSIS_LIST",
  payload: diagnosisListFromApi,
});

export const setMobile = (isMobile: boolean): Action => ({
  type: "SET_MOBILE",
  payload: isMobile,
});

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Page<Patient>;
    }
  | {
      type: "UPDATE_PATIENT";
      payload: PatientEntriesPage;
    }
  | {
      type: "SET_DIAGNOSIS_LIST";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_ENTRY";
      payload: {
        id: Patient["id"];
        entry: Entry;
      };
    }
  | {
      type: "SET_MOBILE";
      payload: boolean;
    };

const assertNever = (_arg: never): never => {
  throw new Error("Assert never");
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.items.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
        },
        itemCount: action.payload.itemCount,
        itemsPerPage: action.payload.itemsPerPage,
      };
    case "UPDATE_PATIENT": {
      const { entries, ...patient } = action.payload;
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: {
            ...state.patients[action.payload.id],
            ...patient,
            entries: entries.items,
          },
        },
        itemsPerPage: entries.itemsPerPage,
        itemCount: entries.itemCount,
      };
    }
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: action.payload,
      };
    case "ADD_ENTRY":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: {
            ...state.patients[action.payload.id],
            entries: [
              action.payload.entry,
              ...state.patients[action.payload.id].entries,
            ],
          },
        },
      };
    case "SET_MOBILE":
      return {
        ...state,
        mobile: action.payload,
      };
    default:
      return assertNever(action);
  }
};
