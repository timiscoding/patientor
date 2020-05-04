/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewPatient, Gender, Entry } from "./types";

const errorStr = (name: string, value: any): string => {
  return `Missing or incorrect ${name}: ${value}`;
};

const isString = (text: any): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseName = (name: any): string => {
  if (!name || !isString(name)) {
    throw new Error(errorStr("name", name));
  }
  return name;
};

const isDOB = (param: any): boolean => {
  return Boolean(Date.parse(param));
};

const parseDOB = (dob: any): string => {
  if (!dob || !isString(dob) || !isDOB(dob)) {
    throw new Error(errorStr("dateOfBirth", dob));
  }
  return dob;
};

const parseSSN = (ssn: any): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error(errorStr("ssn", ssn));
  }
  return ssn;
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error(errorStr("gender", gender));
  }
  return gender;
};

const parseOccupation = (occupation: any): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error(errorStr("occupation", occupation));
  }
  return occupation;
};

// eslint-disable-next-line
const isEntry = (_param: any): _param is Entry => {
  return true;
};

const parseEntries = (entries: any): Entry[] => {
  // if (!entries || !Array.isArray(entries) || !entries.every(isEntry)) {
  //   throw new Error(errorStr("entries", entries));
  // }
  return entries;
};

export const toNewPatient = (object: any): NewPatient => {
  const newPatient = {
    name: parseName(object.name),
    dateOfBirth: parseDOB(object.dateOfBirth),
    ssn: parseSSN(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    entries: parseEntries(object.entries),
  };
  return newPatient;
};
