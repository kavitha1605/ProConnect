import express from "express";
import Freelancer from "../models/Freelancer.js";

const router = express.Router();

const disposableDomains = [
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "yopmail.com",
  "dispostable.com",
];

function evaluateFraudRisk(profile) {
  const reasons = [];
  let score = 0;

  const emailDomain = profile.email?.split("@").pop()?.toLowerCase();
  if (!emailDomain) {
    reasons.push("Missing email domain");
    score += 20;
  } else if (disposableDomains.includes(emailDomain)) {
    reasons.push("Disposable email domain detected");
    score += 50;
  }

  const isProfileComplete = Boolean(profile.name && profile.skills?.length && profile.experienceYears >= 0);
  if (!isProfileComplete) {
    reasons.push("Incomplete profile fields");
    score += 30;
  }

  if (profile.rating < 3) {
    reasons.push("Low rating");
    score += 20;
  }

  if (!profile.socialLinks || profile.socialLinks.length < 1) {
    reasons.push("No social profiles linked");
    score += 10;
  }

  const rounded = Math.min(100, score);
  const risk = rounded >= 60 ? "high" : rounded >= 30 ? "medium" : "low";

  if (risk === "high" && !reasons.includes("Manual review recommended")) {
    reasons.push("Manual review recommended");
  }

  return { risk, riskScore: rounded, reasons };
}

router.post("/check", async (req, res) => {
  try {
    const profile = req.body;
    let freelancer = null;
    if (profile.id) {
      try {
        freelancer = await Freelancer.findById(profile.id);
      } catch (findErr) {
        // invalid ObjectId or missing freelancer; continue with provided profile
        freelancer = null;
      }
    }

    const fullProfile = freelancer ? { ...freelancer.toObject(), ...profile } : profile;
    const result = evaluateFraudRisk(fullProfile);

    // Optionally update status on freelancer
    if (freelancer) {
      if (result.risk === "high") freelancer.status = "pending";
      if (result.risk === "low") freelancer.status = "approved";
      await freelancer.save();
    }

    res.json({ profile: fullProfile, fraudCheck: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
