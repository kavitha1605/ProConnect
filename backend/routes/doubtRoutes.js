import express from "express";
import Doubt from "../models/Doubt.js";

const router = express.Router();

// Post a doubt
router.post("/", async (req, res) => {
  try {
    const newDoubt = new Doubt(req.body);
    await newDoubt.save();
    res.status(201).json({ message: "Doubt posted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all doubts
router.get("/", async (req, res) => {
  try {
    const doubts = await Doubt.find();
    res.json(doubts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
