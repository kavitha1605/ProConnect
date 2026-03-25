import mongoose from "mongoose";

const freelancerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "freelancer" },
  skills: [{ type: String }],
  experienceYears: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  portfolio: String,
  location: String,
  socialLinks: [String],
  profileComplete: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Freelancer", freelancerSchema);
