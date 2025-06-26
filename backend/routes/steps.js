import express from "express";
import stepController from "../controllers/stepController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", stepController.createStep);
router.get("/course/:courseId", stepController.getSteps);
router.get("/deadlines", stepController.getUpcomingDeadlines);
router.get("/:id", stepController.getStep);
router.put("/:id", stepController.updateStep);
router.delete("/:id", stepController.deleteStep);
router.patch("/:id/complete", stepController.markStepCompleted);
router.put("/course/:courseId/reorganize", stepController.reorganizeSteps);

export default router;
