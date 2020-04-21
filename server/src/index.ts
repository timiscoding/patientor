import express from "express";
import cors from "cors";
import { diagnosesRouter, patientsRouter } from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

app.use("/api/diagnoses", diagnosesRouter);
app.use("/api/patients", patientsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
