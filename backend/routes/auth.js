import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import authController from "../controllers/authController.js";

const router = express.Router();

router.get("/azure/login", authController.getLoginUrl);
router.post("/azure/callback", authController.handleCallback);
router.get("/me", authenticateToken, authController.getCurrentUser);
router.post("/logout", authenticateToken, authController.logout);

export default router;
