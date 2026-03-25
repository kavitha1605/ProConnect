import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,       // For now plain text, later use bcrypt
  role: { type: String, enum: ["client", "freelancer"], default: "client" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// ------------------------
// REGISTER
// POST /api/users/register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------------
// LOGIN
// POST /api/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.password !== password) return res.status(401).json({ message: "Incorrect password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
