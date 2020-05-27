import express from "express";
import cors from "cors";
import redis from "./redis";
import { diagnosesRouter, patientsRouter } from "./routes";
import { seedData } from "./service";

redis
  .connect()
  .then(() => {
    console.log("Redis connected");
    return seedData();
  })
  .then(() => {
    console.log("Seeded data");
  })
  .catch((err) => {
    console.error("Redis error", err);
    process.exit(1);
  });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

app.use("/api/diagnoses", diagnosesRouter);
app.use("/api/patients", patientsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
