import express from "express";
import { detectCircularTransactions } from "../controllers/detectionController.js";

const router = express.Router();

router.get("/circular", detectCircularTransactions);

export default router;