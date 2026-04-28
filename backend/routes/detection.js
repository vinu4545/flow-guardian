import express from "express";
import { detectCircularTransactions } from "../controllers/detectionController.js";
import { detectLayering } from "../controllers/detectionController.js";

const router = express.Router();

router.get("/circular", detectCircularTransactions);
router.get("/layering", detectLayering);

export default router;