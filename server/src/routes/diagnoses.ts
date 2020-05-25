import express from "express";
import { diagnoseService } from "../service";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const data = await diagnoseService.getDiagnoses();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
