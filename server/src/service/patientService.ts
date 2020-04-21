import patientsData from "../../data/patients.json";
import { Patient, NonSensitivePatient, NewPatient } from "../types";

const patients: Patient[] = patientsData as Patient[];

const generateId = (): string => {
  return (
    Number(Date.now()).toString(16).slice(-8) + "-f723-11e9-8f0b-362b9e155667"
  );
};

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ ssn, ...publicFields }) => publicFields);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: generateId(),
    ...patient,
  };
  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  addPatient,
};
