import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// ========================
// REGISTER
// POST /api/users/register
// ========================
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["client", "freelancer"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'client' or 'freelancer'" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user (password will be hashed by schema pre-save hook)
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========================
// LOGIN
// POST /api/users/login
// ========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password using bcrypt
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========================
// GET CURRENT USER
// GET /api/users/me
// ========================
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========================
// GET ALL USERS (Admin only)
// GET /api/users
// ========================
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
