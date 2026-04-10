import mongoose from "mongoose";

const freelancerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "freelancer" },
  skills: [{ type: String }],
  experienceYears: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  about: { type: String, default: "" },
  portfolio: String,
  location: String,
  socialLinks: [String],
  resume: {
    url: String,
    uploadedAt: Date,
  },
  projects: [
    {
      title: String,
      description: String,
      url: String,
      fileUrl: String,
    },
  ],
  profileComplete: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  verificationScore: { type: Number, default: 0, min: 0, max: 100 },
  aiVerificationDetails: {
    resumeAnalysis: String,
    projectsAnalysis: String,
    overallFeedback: String,
  },
  isFraudulent: { type: Boolean, default: false },
  fraudCheckScore: { type: Number, default: 0, min: 0, max: 100 },
  fraudCheckDetails: {
    profileCompleteness: Number,
    skillExperienceAlignment: Number,
    resumeRedFlags: Number,
    ratingAuthenticity: Number,
    socialVerification: Number,
    projectQuality: Number,
    overallRisk: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Freelancer", freelancerSchema);
