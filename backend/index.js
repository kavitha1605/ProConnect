import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import doubtRoutes from "./routes/doubtRoutes.js";
import freelancerRoutes from "./routes/freelancerRoutes.js";
import fraudRoutes from "./routes/fraudRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.json());
app.use(cors());

// =========================
// MongoDB Connection
// =========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected");
    console.log("Connected DB:", mongoose.connection.name); // 👈 ADD THIS
  })
  .catch(err => console.log("MongoDB connection error:", err));

// =========================
// Routes
// =========================
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/fraud", fraudRoutes);

// =========================
// AI Match Route
// =========================
app.post("/api/match", async (req, res) => {
  try {
    const { clientText = "", budget = null, experience = null, desiredSkills = [] } = req.body;

    console.log("MATCH API HIT");
    console.log("clientText:", clientText);
    console.log("desiredSkills:", desiredSkills);
    console.log("budget:", budget, "experience:", experience);

    const freelancers = [
      { id: 1, name: "Arjun Dev", skills: ["react", "javascript", "api"], experience: 3, rate: 25 },
      { id: 2, name: "Priya UX", skills: ["ui", "figma", "design"], experience: 4, rate: 30 },
      { id: 3, name: "Karthik AI", skills: ["python", "ml", "ai"], experience: 5, rate: 40 }
    ];

    // Normalize input text
    const normalizedText = String(clientText).toLowerCase();
    const words = normalizedText
      .replace(/[^a-z0-9 ]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 1);

    // Normalize desired skills
    const normalizedDesiredSkills = Array.isArray(desiredSkills)
      ? desiredSkills.map(s => String(s).toLowerCase().trim()).filter(Boolean)
      : [];

    console.log("words:", words);
    console.log("normalizedDesiredSkills:", normalizedDesiredSkills);

    const matches = freelancers.map((f) => {
      let score = 0;
      let matchedSkills = [];

      f.skills.forEach((skill) => {
        const s = skill.toLowerCase().trim();

        const textMatched =
          normalizedText.includes(s) ||
          words.includes(s) ||
          words.some(word => word.includes(s) || s.includes(word));

        const desiredMatched =
          normalizedDesiredSkills.includes(s) ||
          normalizedDesiredSkills.some(ds => ds.includes(s) || s.includes(ds));

        if (textMatched || desiredMatched) {
          score += 10;
          matchedSkills.push(s);
        }
      });

      // Experience match
      if (experience && Number(f.experience) >= Number(experience)) {
        score += 5;
      }

      // Budget match
      if (budget && Number(f.rate) <= Number(budget)) {
        score += 5;
      }

      return {
        freelancerId: f.id,
        name: f.name,
        score,
        matchedSkills
      };
    });

    const filteredMatches = matches
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score);

    console.log("matches:", filteredMatches);

    res.json({
      query: clientText,
      matches: filteredMatches
    });

  } catch (error) {
    console.error("Match route error:", error);
    res.status(500).json({
      query: req.body?.clientText || "",
      matches: [],
      error: "Something went wrong in match API"
    });
  }
});

// =========================
// Test Route
// =========================
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));