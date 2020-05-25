import { Schema } from "yup";

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn: string;
  dateOfBirth: string;
  entries?: Entry[];
  recentHealthCheckRating?: HealthCheckRating;
}

export enum EntryType {
  Hospital = "Hospital",
  OccupationalHealthcare = "OccupationalHealthcare",
  HealthCheck = "HealthCheck",
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}

export enum HealthCheckRating {
  Healthy = 0,
  LowRisk = 1,
  HighRisk = 2,
  CriticalRisk = 3,
}

export interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

interface SickLeave {
  startDate: string;
  endDate: string;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcare;
  employerName: string;
  sickLeave?: SickLeave;
}

interface Discharge {
  date: string;
  criteria: string;
}

export interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital;
  discharge: Discharge;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export type Modify<TOrig, TReplace> = Omit<TOrig, keyof TReplace> & TReplace;
type ExcludedNewEntry = "id" | "date";
export type NewHospitalEntry = Modify<
  Omit<HospitalEntry, ExcludedNewEntry>,
  { type: EntryType.Hospital | "" }
>;
export type NewOccupationalHealthcareEntry = Modify<
  Omit<OccupationalHealthcareEntry, ExcludedNewEntry>,
  { type: EntryType.OccupationalHealthcare | "" }
>;
// modify healthCheckRating to allow for initial value in forms
export type NewHealthCheckEntry = Modify<
  Omit<HealthCheckEntry, ExcludedNewEntry>,
  {
    healthCheckRating: HealthCheckRating | "";
    type: EntryType.HealthCheck | "";
  }
>;
export type NewEntry =
  | NewHospitalEntry
  | NewOccupationalHealthcareEntry
  | NewHealthCheckEntry;

type InitValKeys<T> = Omit<T, keyof BaseEntry>;
export type Event<P, T extends NewEntry> = React.FC<P> & {
  initialValues: { [P in keyof InitValKeys<T>]: InitValKeys<T>[P] };
  validationSchema: { [P in keyof InitValKeys<T>]: Schema<any> };
  type: T["type"];
};

export enum FormSubmitStatus {
  Success = "Success",
  Error = "Error",
  Inactive = "Inactive",
}

export interface Page<TItem> {
  itemCount: number;
  itemsPerPage: number;
  items: Array<TItem>;
}

export type PatientEntriesPage = Modify<
  Patient,
  {
    entries: {
      items: Patient["entries"];
      itemCount: number;
      itemsPerPage: number;
    };
  }
>;
