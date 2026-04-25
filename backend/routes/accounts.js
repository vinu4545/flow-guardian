import express from "express";
import { getAllAccounts, createAccount } from "../controllers/accountController.js";

const router = express.Router();

router.get("/", getAllAccounts);
router.post("/", createAccount);

export default router;