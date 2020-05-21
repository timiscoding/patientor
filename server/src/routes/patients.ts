import express from "express";
import { patientService } from "../service";
import { toNewPatient, toNewEntry, sleep } from "../utils";

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

router.post("/:id/entries", (req, res) => {
  try {
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientService.addEntry(req.params.id, newEntry);
    res.status(201).json(addedEntry);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default router;
