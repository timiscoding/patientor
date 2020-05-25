import redis from "../redis";
import { Diagnose } from "../types";

const getDiagnoses = async (): Promise<Diagnose[]> => {
  const diagnoses = (await redis.get("diagnoses")) as Diagnose[] | null;
  if (diagnoses === null) {
    throw new Error("Key 'diagnoses' not found");
  }
  return diagnoses;
};

export default { getDiagnoses };
