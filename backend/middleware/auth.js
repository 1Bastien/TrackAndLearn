import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    req.user = user;
    req.user.id = user._id.toString();
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
};
