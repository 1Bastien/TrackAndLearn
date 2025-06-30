import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import stepRoutes from "./routes/steps.js";
import searchRoutes from "./routes/search.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/steps", stepRoutes);
app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend Track&Learn",
    endpoints: {
      auth: "/api/auth",
      courses: "/api/courses",
      steps: "/api/steps",
      search: "/api/search",
      azureLogin: "/api/auth/azure/login",
      azureCallback: "/api/auth/azure/callback",
      userProfile: "/api/auth/me",
    },
  });
});

app.listen(PORT);

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
