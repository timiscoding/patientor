import patientsData from "../../data/patients";
import { Patient, PublicPatient, NewPatient, NewEntry, Entry } from "../types";

const patients: Patient[] = patientsData;

const generateId = (): string => {
  return (
    Number(Date.now()).toString(16).slice(-8) + "-f723-11e9-8f0b-362b9e155667"
  );
};

const getPatient = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);
  return patient;
};

const getPatients = (): PublicPatient[] => {
  return patients.map(({ ssn, entries, ...publicFields }) => publicFields);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: generateId(),
    ...patient,
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: Patient["id"], entry: NewEntry): Entry => {
  const newEntry = {
    id: generateId(),
    date: new Date().toISOString().slice(0, 10),
    ...entry,
  };
  const patient = patients.find((p) => p.id === id);
  if (!patient) {
    throw new Error("Patient not found");
  }

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatient,
  getPatients,
  addPatient,
  addEntry,
};
