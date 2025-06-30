import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import searchController from "../controllers/searchController.js";

const router = express.Router();

router.get("/", authenticateToken, searchController.globalSearch);

export default router;
