import express from "express";
import { patientService } from "../service";
import { toNewPatient, toNewEntry, toNum } from "../utils";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  try {
    const { ep } = req.query;
    const page = ep ? toNum(ep) : 1;
    const patient = await patientService.getPatient(req.params.id, page);
    return res.json(patient);
  } catch (err) {
    return next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { pp } = req.query;
    const page = pp ? toNum(pp) : 1;
    res.send(await patientService.getPatients(page));
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = await patientService.addPatient(newPatient);
    res.send(addedPatient);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/:id/entries", async (req, res) => {
  try {
    const newEntry = toNewEntry(req.body);
    const addedEntry = await patientService.addEntry(req.params.id, newEntry);
    res.status(201).json(addedEntry);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default router;
