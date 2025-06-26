import express from "express";
import courseController from "../controllers/courseController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", courseController.createCourse);
router.get("/", courseController.getCourses);

router.get("/statistics", courseController.getStatistics);
router.get("/:id", courseController.getCourse);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

export default router;
