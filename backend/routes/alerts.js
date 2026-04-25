import express from "express";
import { getAlerts, createAlert } from "../controllers/alertController.js";

const router = express.Router();

router.get("/", getAlerts);
router.post("/", createAlert);

export default router;