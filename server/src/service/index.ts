import redis from "../redis";
import diagnoses from "../../data/diagnoses.json";
import patients from "../../data/patients.json";
import { keys } from "../redis";

export { default as diagnoseService } from "./diagnoseService";
export { default as patientService } from "./patientService";

export const seedData = async () => {
  const patientList = patients.map((p) => p.id);
  const pipeline = redis.pipeline();

  let exists = await redis.exists(keys.diagnoses);
  !exists && pipeline.set(keys.diagnoses, JSON.stringify(diagnoses));

  exists = await redis.exists(keys.patients);
  !exists && pipeline.rpush(keys.patients, patientList);

  for (const patient of patients) {
    const { entries, ...fields } = patient;
    const entryList = [];
    for (const entry of entries) {
      entryList.push(entry.id);
      pipeline.set(keys.entry(entry.id), JSON.stringify(entry));
    }
    pipeline.set(keys.patient(patient.id), JSON.stringify(fields));
    exists = await redis.exists(keys.entries(patient.id));
    !exists &&
      entryList.length > 0 &&
      pipeline.rpush(keys.entries(patient.id), entryList);
  }
  return pipeline.exec();
};

/*
  redis schema
  patients [ P1, P2, P3 ]: List
  patient:PID {
    id: string,
    name: string,
    dateOfBirth: string,
    ssn: string,
    gender: string,
    occupation: string,
    recentHealthRating?: healthCheckRating
  }
  entries:PID [ E1, E2, E3 ]: List
  entry:EID json string

*/
