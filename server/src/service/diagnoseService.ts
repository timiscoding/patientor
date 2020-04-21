import diagnosesData from "../../data/diagnoses.json";
import { Diagnose } from "../types";

const getDiagnoses = (): Diagnose[] => {
  return diagnosesData;
};

export default { getDiagnoses };
