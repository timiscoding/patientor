import express from "express";
import { patientService } from "../service";
import { toNewPatient } from "../utils";

const router = express.Router();

router.get("/:id", (req, res) => {
  const patient = patientService.getPatient(req.params.id);
  if (!patient) {
    return res.status(404);
  }
  return res.json(patient);
});

router.get("/", (_req, res) => {
  res.send(patientService.getPatients());
});

router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.send(addedPatient);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;
