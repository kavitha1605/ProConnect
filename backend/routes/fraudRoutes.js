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

  // 1. Missing / suspicious email
  if (!emailDomain) {
    reasons.push("Missing email domain");
    score += 20;
  } else if (disposableDomains.includes(emailDomain)) {
    reasons.push("Disposable email domain detected");
    score += 50;
  }

  // 2. Incomplete profile
  const isProfileComplete = Boolean(
    profile.name &&
      profile.skills?.length &&
      profile.experienceYears >= 0
  );

  if (!isProfileComplete) {
    reasons.push("Incomplete profile fields");
    score += 30;
  }

  // 3. Low rating
  if (profile.rating && profile.rating < 3) {
    reasons.push("Low rating");
    score += 20;
  }

  // 4. No social links
  if (!profile.socialLinks || profile.socialLinks.length < 1) {
    reasons.push("No social profiles linked");
    score += 10;
  }

  // 5. Very few skills
  if (!profile.skills || profile.skills.length < 2) {
    reasons.push("Very few skills listed");
    score += 10;
  }

  // 6. Unrealistic hourly rate
  if (profile.hourlyRate && profile.hourlyRate < 5) {
    reasons.push("Unrealistically low hourly rate");
    score += 15;
  }

  // 7. Very low experience but high claims (basic AI-like logic)
  if (profile.experienceYears === 0 && profile.skills?.length > 4) {
    reasons.push("Skill list does not match experience level");
    score += 15;
  }

  const rounded = Math.min(100, score);
  const risk = rounded >= 60 ? "high" : rounded >= 30 ? "medium" : "low";

  if (risk === "high" && !reasons.includes("Manual review recommended")) {
    reasons.push("Manual review recommended");
  }

  return { risk, riskScore: rounded, reasons };
}

// POST /api/fraud/check
router.post("/check", async (req, res) => {
  try {
    const profile = req.body;
    let freelancer = null;

    if (profile.id) {
      try {
        freelancer = await Freelancer.findById(profile.id);
      } catch (findErr) {
        freelancer = null;
      }
    }

    const fullProfile = freelancer
      ? { ...freelancer.toObject(), ...profile }
      : profile;

    const result = evaluateFraudRisk(fullProfile);

    // optional status update
    if (freelancer) {
      if (result.risk === "high") freelancer.status = "pending";
      if (result.risk === "low") freelancer.status = "approved";
      await freelancer.save();
    }

    res.json({
      profile: fullProfile,
      fraudCheck: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;