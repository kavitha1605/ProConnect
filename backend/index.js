import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import doubtRoutes from "./routes/doubtRoutes.js";
import freelancerRoutes from "./routes/freelancerRoutes.js";
import fraudRoutes from "./routes/fraudRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/fraud", fraudRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
