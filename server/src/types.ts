export interface Diagnose {
  code: string;
  name: string;
  latin?: string;
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnose["code"]>;
}

export enum HealthCheckRating {
  Healthy = 0,
  LowRisk = 1,
  HighRisk = 2,
  CriticalRisk = 3,
}

interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

export interface SickLeave {
  startDate: string;
  endDate: string;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcare;
  employerName: string;
  sickLeave?: SickLeave;
}

export interface Discharge {
  date: string;
  criteria: string;
}

interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital;
  discharge: Discharge;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export enum EntryType {
  Hospital = "Hospital",
  OccupationalHealthcare = "OccupationalHealthcare",
  HealthCheck = "HealthCheck",
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[];
}

export type PublicPatient = Omit<Patient, "ssn" | "entries">;

export type NewPatient = Omit<Patient, "id">;

type ExcludedNewEntry = "id" | "date";
export type NewBaseEntry = Omit<BaseEntry, ExcludedNewEntry>;
export type NewHospitalEntry = Omit<HospitalEntry, ExcludedNewEntry>;
export type NewOccupationalHealthcareEntry = Omit<
  OccupationalHealthcareEntry,
  ExcludedNewEntry
>;
export type NewHealthCheckEntry = Omit<HealthCheckEntry, ExcludedNewEntry>;

export type NewEntry =
  | NewHospitalEntry
  | NewOccupationalHealthcareEntry
  | NewHealthCheckEntry;

export type DiagnosisCode = Diagnose["code"];
