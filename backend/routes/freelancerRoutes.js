import express from "express";
import Freelancer from "../models/Freelancer.js";

const router = express.Router();

// Create a freelancer
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    data.profileComplete = Boolean(data.name && data.email && data.skills?.length);
    const freelancer = new Freelancer(data);
    await freelancer.save();
    res.status(201).json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List freelancers + optional search filters
router.get("/", async (req, res) => {
  try {
    const { q, minRate, maxRate, minExp, skill } = req.query;
    const filter = { status: "approved" };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];
    }

    if (skill) filter.skills = { $in: [skill] };
    if (minRate) filter.hourlyRate = { ...filter.hourlyRate, $gte: Number(minRate) };
    if (maxRate) filter.hourlyRate = { ...filter.hourlyRate, $lte: Number(maxRate) };
    if (minExp) filter.experienceYears = { ...filter.experienceYears, $gte: Number(minExp) };

    const freelancers = await Freelancer.find(filter).limit(100);
    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get freelancer by ID
router.get("/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });
    res.json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update freelancer
router.put("/:id", async (req, res) => {
  try {
    const data = req.body;
    data.profileComplete = Boolean(data.name && data.email && data.skills?.length);
    const freelancer = await Freelancer.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });
    res.json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete freelancer
router.delete("/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findByIdAndDelete(req.params.id);
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });
    res.json({ message: "Freelancer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed sample freelancers (for testing)
// POST /api/freelancers/seed
router.post("/seed", async (req, res) => {
  try {
    const sample = [
      {
        name: "Karthik AI",
        email: "karthik@proconnect.test",
        skills: ["AI", "Machine Learning", "Python"],
        experienceYears: 6,
        hourlyRate: 40,
        rating: 5,
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Arjun Dev",
        email: "arjun@proconnect.test",
        skills: ["React", "JavaScript", "API"],
        experienceYears: 4,
        hourlyRate: 25,
        rating: 4.8,
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Priya UX",
        email: "priya@proconnect.test",
        skills: ["UI/UX", "Figma", "Design"],
        experienceYears: 5,
        hourlyRate: 30,
        rating: 4.9,
        status: "approved",
        profileComplete: true,
      },
    ];
    const created = await Freelancer.insertMany(sample);
    res.json({ seeded: created.length, freelancers: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI profile matching (mock rule + basic NLP similarity)
// POST /api/freelancers/match
router.post("/match", async (req, res) => {
  try {
    const { clientText, budget, experience, desiredSkills } = req.body;
    const textLower = (clientText || "").toLowerCase();

    // simple candidate search
    let candidates = await Freelancer.find({ status: "approved" });
    if (!candidates.length) {
      // If no approved freelancers in DB, include pending as fallback for local testing
      candidates = await Freelancer.find({});
    }

    const scored = candidates
      .map((fr) => {
        let score = 0;
        const skills = fr.skills || [];

        if (desiredSkills && desiredSkills.length) {
          const matched = skills.filter((skill) => desiredSkills.includes(skill));
          score += matched.length * 20;
        }

        if (experience && fr.experienceYears >= experience) score += 20;
        if (budget && fr.hourlyRate <= budget) score += 15;

        for (const skill of skills) {
          if (textLower.includes(skill.toLowerCase())) score += 5;
        }

        if (fr.rating) score += Math.min(20, fr.rating * 4);

        return { freelancer: fr, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    const results = scored.map((x) => ({
      freelancerId: x.freelancer._id,
      name: x.freelancer.name,
      email: x.freelancer.email,
      score: x.score,
      matchedSkills: x.freelancer.skills.filter((skill) => (desiredSkills || []).includes(skill)),
    }));

    res.json({ query: clientText, matches: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
