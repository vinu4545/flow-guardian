import express from "express";
import { registerUser } from "../controllers/authController.js";
import { loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", registerUser);
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected data",
    user: req.user,
  });
});

export default router;