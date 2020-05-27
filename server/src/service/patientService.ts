import shortid from "shortid";
import redis, { keys, mapPipeRes, pushTrim } from "../redis";
import {
  Patient,
  PublicPatient,
  NewPatient,
  Page,
  NewEntry,
  Entry,
  PatientPage,
  EntryType,
} from "../types";

const itemsPerPage = 10;
const maxItems = 100;

const getPage = async (
  page: number,
  key: string
): Promise<{ itemCount: number; ids: string[] }> => {
  const itemCount = await redis.llen(key);
  const pageCount = Math.ceil(itemCount / itemsPerPage);
  if (itemCount === 0) {
    return {
      itemCount: 0,
      ids: [],
    };
  }
  if (page < 1 || page > pageCount) {
    throw new Error("Page not found");
  }
  const offset = (page - 1) * itemsPerPage;
  return {
    itemCount,
    ids: await redis.lrange(key, offset, offset + itemsPerPage - 1),
  };
};

const getPatient = async (id: string, page: number): Promise<PatientPage> => {
  const patient = (await redis.get(keys.patient(id))) as Patient | null;
  if (!patient) throw new Error("Patient not found");
  const { ids, itemCount } = await getPage(page, keys.entries(id));
  if (itemCount === 0) {
    return {
      ...patient,
      entries: {
        items: [],
        itemCount: 0,
        itemsPerPage,
      },
    };
  }
  const pipe = redis.pipeline();
  ids.forEach((id) => pipe.get(keys.entry(id)));
  const entries = mapPipeRes(await pipe.exec());
  return {
    ...patient,
    entries: {
      items: entries,
      itemCount,
      itemsPerPage,
    },
  };
};

const getPatients = async (page: number): Promise<Page<PublicPatient>> => {
  const { ids, itemCount } = await getPage(page, keys.patients);
  const pipe = redis.pipeline();
  ids.forEach((id) => pipe.get(keys.patient(id)));
  const patients = mapPipeRes(
    await pipe.exec(),
    ({ ssn, ...patient }) => patient
  );
  return {
    itemCount,
    itemsPerPage,
    items: patients,
  };
};

const addPatient = async (patient: NewPatient): Promise<Patient> => {
  const id = shortid.generate();
  const newPatient = {
    id,
    ...patient,
  };
  await pushTrim(keys.patients, id, maxItems)
    .set(keys.patient(id), JSON.stringify(newPatient))
    .exec();

  return newPatient;
};

const addEntry = async (id: Patient["id"], entry: NewEntry): Promise<Entry> => {
  const entryId = shortid.generate();
  const newEntry = {
    id: entryId,
    date: new Date().toISOString().slice(0, 10),
    ...entry,
  };
  const patient = (await redis.get(keys.patient(id))) as Patient | null;
  if (!patient) {
    throw new Error("Patient not found");
  }
  const trans = pushTrim(keys.entries(id), entryId, 100).set(
    keys.entry(entryId),
    JSON.stringify(newEntry)
  );
  if (entry.type === EntryType.HealthCheck) {
    const updatedPatient = {
      ...patient,
      recentHealthCheckRating: entry.healthCheckRating,
    };
    trans.set(keys.patient(id), JSON.stringify(updatedPatient));
  }
  await trans.exec();
  return newEntry;
};

export default {
  getPatient,
  getPatients,
  addPatient,
  addEntry,
};
