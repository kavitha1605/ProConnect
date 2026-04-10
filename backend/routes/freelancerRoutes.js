import express from "express";
import mongoose from "mongoose";
import Freelancer from "../models/Freelancer.js";
import User from "../models/User.js";
import verifyToken from "../middleware/auth.js";
import verifyRole from "../middleware/verifyRole.js";
import { uploadResume, uploadProject } from "../middleware/upload.js";

const router = express.Router();

// ==========================
// CREATE FREELANCER PROFILE
// POST /api/freelancers/profile/create
// Protected: Only freelancers
// ==========================
router.post("/profile/create", verifyToken, verifyRole(["freelancer"]), async (req, res) => {
  try {
    const { name, email, skills, experienceYears, hourlyRate, about, location, socialLinks } = req.body;

    // Validation
    if (!name || !email || !skills || skills.length === 0) {
      return res.status(400).json({ message: "Name, email, and skills are required" });
    }

    // Check if freelancer already exists for this user
    const existingFreelancer = await Freelancer.findOne({ userId: req.user._id });
    if (existingFreelancer) {
      return res.status(400).json({ message: "Freelancer profile already exists for this user" });
    }

    const profileComplete = Boolean(name && email && skills.length > 0);

    const freelancer = new Freelancer({
      userId: req.user._id,
      name,
      email,
      skills: Array.isArray(skills) ? skills : [skills],
      experienceYears: experienceYears || 0,
      hourlyRate: hourlyRate || 0,
      about: about || "This freelancer has not added a description yet.",
      location: location || "",
      socialLinks: Array.isArray(socialLinks) ? socialLinks : [],
      profileComplete,
      verificationStatus: "pending",
    });

    await freelancer.save();

    res.status(201).json({
      message: "Freelancer profile created successfully",
      freelancer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// GET MY FREELANCER PROFILE
// GET /api/freelancers/profile/me
// Protected: Only freelancers
// ==========================
router.get("/profile/me", verifyToken, verifyRole(["freelancer"]), async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ userId: req.user._id });

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer profile not found. Create one first." });
    }

    res.json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// UPDATE FREELANCER PROFILE
// PUT /api/freelancers/profile/update
// Protected: Only freelancers (own profile)
// ==========================
router.put("/profile/update", verifyToken, verifyRole(["freelancer"]), async (req, res) => {
  try {
    const { name, skills, experienceYears, hourlyRate, about, location, socialLinks } = req.body;

    const data = {
      name,
      skills: Array.isArray(skills) ? skills : [skills],
      experienceYears,
      hourlyRate,
      about,
      location,
      socialLinks: Array.isArray(socialLinks) ? socialLinks : [],
    };

    data.profileComplete = Boolean(data.name && data.skills?.length > 0);

    const freelancer = await Freelancer.findOneAndUpdate(
      { userId: req.user._id },
      data,
      { new: true }
    );

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer profile not found" });
    }

    res.json({
      message: "Profile updated successfully",
      freelancer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// DELETE FREELANCER PROFILE
// DELETE /api/freelancers/profile/delete
// Protected: Only freelancers (own profile)
// ==========================
router.delete("/profile/delete", verifyToken, verifyRole(["freelancer"]), async (req, res) => {
  try {
    const freelancer = await Freelancer.findOneAndDelete({
      userId: req.user._id,
    });

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer profile not found" });
    }

    res.json({ message: "Freelancer profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// ADD PROJECT
// POST /api/freelancers/project/add
// Protected: Only freelancers
// ==========================
router.post("/project/add", verifyToken, verifyRole(["freelancer"]), async (req, res) => {
  try {
    const { title, description, url, fileUrl } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const freelancer = await Freelancer.findOneAndUpdate(
      { userId: req.user._id },
      {
        $push: {
          projects: { title, description, url: url || "", fileUrl: fileUrl || "" },
        },
      },
      { new: true }
    );

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer profile not found" });
    }

    res.status(201).json({
      message: "Project added successfully",
      freelancer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// LIST VERIFIED FREELANCERS
// GET /api/freelancers
// No auth required (public)
// ==========================
router.get("/", async (req, res) => {
  try {
    const { q, minRate, maxRate, minExp, skill } = req.query;

    const filter = { verificationStatus: "verified" };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { role: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
        { about: { $regex: q, $options: "i" } },
      ];
    }

    if (skill) filter.skills = { $in: [skill] };

    if (minRate) {
      filter.hourlyRate = { ...filter.hourlyRate, $gte: Number(minRate) };
    }

    if (maxRate) {
      filter.hourlyRate = { ...filter.hourlyRate, $lte: Number(maxRate) };
    }

    if (minExp) {
      filter.experienceYears = {
        ...filter.experienceYears,
        $gte: Number(minExp),
      };
    }

    const freelancers = await Freelancer.find(filter).limit(100);

    console.log("TOTAL VERIFIED FREELANCERS:", freelancers.length);

    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// GET FREELANCER BY ID
// GET /api/freelancers/:id
// No auth required
// ==========================
router.get("/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id).populate("userId", "name email");

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// SEED SAMPLE FREELANCERS
// GET /api/freelancers/seed/data
// ==========================
router.get("/seed/data", async (req, res) => {
  try {
    await Freelancer.deleteMany({});
    await mongoose.connection.db.collection('users').deleteMany({ email: /@proconnect\.test$/ });

    // Create sample users first
    const sampleUsers = [
      { name: "Arjun Dev", email: "arjun@proconnect.test", password: "password123", role: "freelancer" },
      { name: "Sneha Web", email: "sneha@proconnect.test", password: "password123", role: "freelancer" },
      { name: "Rahul Node", email: "rahul@proconnect.test", password: "password123", role: "freelancer" },
      { name: "Priya UX", email: "priya@proconnect.test", password: "password123", role: "freelancer" },
      { name: "Karthik AI", email: "karthik@proconnect.test", password: "password123", role: "freelancer" },
      { name: "Sanjay FullStack", email: "sanjay@proconnect.test", password: "password123", role: "freelancer" },
      { name: "Nivetha MERN", email: "nivetha@proconnect.test", password: "password123", role: "freelancer" },
      { name: "Meena Design", email: "meena@proconnect.test", password: "password123", role: "freelancer" },
    ];

    const createdUsers = await User.insertMany(sampleUsers);
    console.log('Created users:', createdUsers.map(u => ({ id: u._id, name: u.name })));

    const sample = [
      {
        userId: createdUsers[0]._id,
        name: "Arjun Dev",
        email: "arjun@proconnect.test",
        role: "React Developer",
        skills: ["React", "JavaScript", "API", "Redux", "CSS", "HTML"],
        experienceYears: 4,
        hourlyRate: 25,
        rating: 4.8,
        about: "Frontend developer specializing in React applications and scalable UI systems.",
        location: "Bangalore, India",
        socialLinks: ["https://linkedin.com/in/arjundev"],
        verificationStatus: "verified",
        verificationScore: 92,
        profileComplete: true,
      },
      {
        userId: createdUsers[1]._id,
        name: "Sneha Web",
        email: "sneha@proconnect.test",
        role: "Frontend Developer",
        skills: ["HTML", "CSS", "JavaScript", "React", "Bootstrap"],
        experienceYears: 3,
        hourlyRate: 22,
        rating: 4.7,
        about: "Frontend developer creating responsive websites and landing pages.",
        location: "Mumbai, India",
        socialLinks: ["https://linkedin.com/in/snehaweb"],
        verificationStatus: "verified",
        verificationScore: 85,
        profileComplete: true,
      },
      {
        userId: createdUsers[2]._id,
        name: "Rahul Node",
        email: "rahul@proconnect.test",
        role: "Backend Developer",
        skills: ["Node.js", "Express", "MongoDB", "API", "JWT"],
        experienceYears: 4,
        hourlyRate: 28,
        rating: 4.8,
        about: "Backend developer building scalable APIs and databases.",
        location: "Hyderabad, India",
        socialLinks: ["https://linkedin.com/in/rahulnode"],
        verificationStatus: "verified",
        verificationScore: 94,
        profileComplete: true,
      },
      {
        userId: createdUsers[3]._id,
        name: "Priya UX",
        email: "priya@proconnect.test",
        role: "UI/UX Designer",
        skills: ["UI/UX", "Figma", "Adobe XD", "UX Research", "Wireframes"],
        experienceYears: 5,
        hourlyRate: 30,
        rating: 4.9,
        about: "Creative UI/UX designer focused on user-centered design.",
        location: "Delhi, India",
        socialLinks: ["https://linkedin.com/in/priyaux"],
        verificationStatus: "verified",
        verificationScore: 96,
        profileComplete: true,
      },
      {
        userId: createdUsers[4]._id,
        name: "Karthik AI",
        email: "karthik@proconnect.test",
        role: "AI Engineer",
        skills: ["AI", "Machine Learning", "Python", "TensorFlow"],
        experienceYears: 6,
        hourlyRate: 40,
        rating: 5,
        about: "AI engineer building machine learning models and intelligent systems.",
        location: "Pune, India",
        socialLinks: ["https://linkedin.com/in/karthikai"],
        verificationStatus: "verified",
        verificationScore: 98,
        profileComplete: true,
      },
      {
        userId: createdUsers[5]._id,
        name: "Sanjay FullStack",
        email: "sanjay@proconnect.test",
        role: "Full Stack Developer",
        skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
        experienceYears: 5,
        hourlyRate: 32,
        rating: 4.9,
        about: "Full stack developer building complete web applications.",
        location: "Bangalore, India",
        socialLinks: ["https://linkedin.com/in/sanjayfullstack"],
        verificationStatus: "verified",
        verificationScore: 95,
        profileComplete: true,
      },
      {
        userId: createdUsers[6]._id,
        name: "Nivetha MERN",
        email: "nivetha@proconnect.test",
        role: "MERN Stack Developer",
        skills: ["MongoDB", "Express", "React", "Node.js", "Redux"],
        experienceYears: 4,
        hourlyRate: 30,
        rating: 4.8,
        about: "MERN developer working on startup and e-commerce projects.",
        location: "Chennai, India",
        socialLinks: ["https://linkedin.com/in/nivethamern"],
        verificationStatus: "verified",
        verificationScore: 90,
        profileComplete: true,
      },
      {
        userId: createdUsers[7]._id,
        name: "Meena Design",
        email: "meena@proconnect.test",
        role: "Graphic Designer",
        skills: ["Photoshop", "Illustrator", "Canva", "Branding", "Logo Design"],
        experienceYears: 4,
        hourlyRate: 20,
        rating: 4.7,
        about: "Graphic designer specializing in logos and branding.",
        location: "Kolkata, India",
        socialLinks: ["https://linkedin.com/in/meenadesign"],
        verificationStatus: "verified",
        verificationScore: 88,
        profileComplete: true,
      },
    ];

    console.log('Sample freelancers before insert:', sample.slice(0, 2).map(f => ({ userId: f.userId, name: f.name })));

    await Freelancer.insertMany(sample);

    res.status(201).json({
      message: `${sample.length} sample freelancers and users created`,
      freelancersCount: sample.length,
      usersCount: createdUsers.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
