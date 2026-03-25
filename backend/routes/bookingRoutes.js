import express from "express";
import Booking from "../models/Booking.js";
const router = express.Router();

// Create a booking
router.post("/", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get bookings by client
router.get("/client/:clientId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.clientId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get bookings by freelancer
router.get("/freelancer/:freelancerId", async (req, res) => {
  try {
    const bookings = await Booking.find({ freelancerId: req.params.freelancerId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
