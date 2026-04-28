import express from "express";
import {
  getGraph,
  getGraphByAccount,
  getSuspiciousGraph
} from "../controllers/graphController.js";

const router = express.Router();

router.get("/", getGraph);
router.get("/account/:id", getGraphByAccount);
router.get("/suspicious", getSuspiciousGraph);

export default router;