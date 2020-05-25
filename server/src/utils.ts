/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NewPatient,
  Gender,
  NewEntry,
  EntryType,
  DiagnosisCode,
  NewHealthCheckEntry,
  HealthCheckRating,
  NewHospitalEntry,
  NewBaseEntry,
  Discharge,
  NewOccupationalHealthcareEntry,
  SickLeave,
} from "./types";

export const assertNever = (_any: never): never => {
  throw new Error("Exhaustive type checking violated");
};

const errorStr = (name: string, value: any): string => {
  return `Missing or incorrect ${name}: ${value}`;
};

const isString = (text: any): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDateStr = (text: any): boolean => {
  return isString(text) && !isNaN(Date.parse(text));
};

const parseString = (name: string, param: any): string => {
  if (!param || !isString(param)) {
    throw new Error(errorStr(name, param));
  }
  return param;
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

export const toNewPatient = (object: any): NewPatient => {
  const newPatient = {
    name: parseName(object.name),
    dateOfBirth: parseDOB(object.dateOfBirth),
    ssn: parseSSN(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    entries: [],
  };
  return newPatient;
};

const isType = (param: any): param is EntryType => {
  return Object.values(EntryType).includes(param);
};

const parseType = (type: any): EntryType => {
  if (!type || !isType(type)) {
    throw new Error(
      `Type must be one of: ${Object.values(EntryType).join(", ")}`
    );
  }
  return type;
};

const parseDiagnosisCodes = (codes: any): DiagnosisCode[] | undefined => {
  if (codes && (!Array.isArray(codes) || !codes.every(isString))) {
    throw new Error("diagnosisCodes must be array of strings");
  }
  return codes;
};

const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheck = (
  params: any
): Omit<NewHealthCheckEntry, keyof NewBaseEntry | "type"> => {
  if (!isHealthCheckRating(params.healthCheckRating)) {
    throw new Error(
      "HealthCheck entry missing or incorrect healthCheckRating field"
    );
  }

  return {
    healthCheckRating: params.healthCheckRating,
  };
};

const isDischarge = (params: any): params is Discharge => {
  return (
    params.date &&
    isDateStr(params.date) &&
    params.criteria &&
    isString(params.criteria)
  );
};

const parseHospital = (
  params: any
): Omit<NewHospitalEntry, keyof NewBaseEntry | "type"> => {
  if (!params.discharge || !isDischarge(params.discharge)) {
    throw new Error("Hospital entry missing or incorrect discharge field");
  }
  return {
    discharge: params.discharge,
  };
};

const isSickLeave = (params: any): params is SickLeave => {
  return (
    params.startDate &&
    isDateStr(params.startDate) &&
    params.endDate &&
    isDateStr(params.endDate)
  );
};

const isSickLeaveEmpty = (params: any): boolean => {
  return params?.startDate?.length === 0 && params?.endDate?.length === 0;
};

const parseOccupationalHealthcare = (
  params: any
): Omit<NewOccupationalHealthcareEntry, keyof NewBaseEntry | "type"> => {
  const partial = {
    employerName: params.employerName,
  };
  if (!params.employerName || !isString(params.employerName)) {
    throw new Error(
      "OccupationalHealthcare entry missing or incorrect employerName field"
    );
  }
  if (isSickLeaveEmpty(params.sickLeave)) {
    return partial;
  }
  if (params.sickLeave && !isSickLeave(params.sickLeave)) {
    throw new Error(
      "OccupationalHealthcare entry missing or incorrect sickLeave fields"
    );
  }
  return { ...partial, sickLeave: params.sickLeave };
};

export const toNewEntry = (object: any): NewEntry => {
  const {
    type,
    description,
    specialist,
    diagnosisCodes,
    ...restParams
  } = object;
  let newEntry = {
    type: parseType(type),
    description: parseString("description", description),
    specialist: parseString("specialist", specialist),
    diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
  } as NewEntry;

  switch (newEntry.type) {
    case EntryType.HealthCheck:
      newEntry = {
        ...newEntry,
        ...parseHealthCheck(restParams),
      };
      break;
    case EntryType.Hospital:
      newEntry = {
        ...newEntry,
        ...parseHospital(restParams),
      };
      break;
    case EntryType.OccupationalHealthcare:
      newEntry = {
        ...newEntry,
        ...parseOccupationalHealthcare(restParams),
      };
      break;
    default:
      assertNever(newEntry);
  }

  return newEntry;
};

// simulate a slow server response
export const sleep = async (ms: number, error?: string): Promise<undefined> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      !error ? resolve() : reject({ message: error });
    }, ms);
  });
};

export const toNum = (param: any) => {
  const res = Number(param);
  if (isNaN(res)) {
    throw new Error("Param must be a number");
  }
  return res;
};
