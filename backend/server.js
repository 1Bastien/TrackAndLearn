import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).catch((error) => {
  console.error("Erreur de connexion à MongoDB:", error);
});

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend Track&Learn",
    endpoints: {
      auth: "/api/auth",
      azureLogin: "/api/auth/azure/login",
      azureCallback: "/api/auth/azure/callback",
      userProfile: "/api/auth/me",
    },
  });
});

app.listen(PORT);

process.on("unhandledRejection", (err) => {
  console.error("Erreur non gérée:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Exception non capturée:", err);
  process.exit(1);
});
