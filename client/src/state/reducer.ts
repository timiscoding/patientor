import { State } from "./state";
import { Patient, Diagnosis } from "../types";

export const setPatientList = (patientListFromApi: Patient[]): Action => ({
  type: "SET_PATIENT_LIST",
  payload: patientListFromApi,
});

export const addPatient = (patient: Patient): Action => ({
  type: "ADD_PATIENT",
  payload: patient,
});

export const updatePatient = (patient: Patient): Action => ({
  type: "UPDATE_PATIENT",
  payload: patient,
});

export const setDiagnosisList = (
  diagnosisListFromApi: Diagnosis[]
): Action => ({
  type: "SET_DIAGNOSIS_LIST",
  payload: diagnosisListFromApi,
});

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "UPDATE_PATIENT";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSIS_LIST";
      payload: Diagnosis[];
    };

const assertNever = (arg: never): never => {
  throw new Error("Assert never");
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "UPDATE_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: {
            ...state.patients[action.payload.id],
            ...action.payload,
          },
        },
      };
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: action.payload,
      };
    default:
      return assertNever(action);
  }
};
