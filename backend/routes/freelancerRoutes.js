import express from "express";
import Freelancer from "../models/Freelancer.js";

const router = express.Router();

// ==========================
// CREATE FREELANCER
// ==========================
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

// ==========================
// LIST FREELANCERS
// ==========================
router.get("/", async (req, res) => {
  try {
    const { q, minRate, maxRate, minExp, skill } = req.query;
    const filter = { status: "approved" };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { role: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
        { about: { $regex: q, $options: "i" } },
      ];
    }

    if (skill) filter.skills = { $in: [skill] };
    if (minRate) filter.hourlyRate = { ...filter.hourlyRate, $gte: Number(minRate) };
    if (maxRate) filter.hourlyRate = { ...filter.hourlyRate, $lte: Number(maxRate) };
    if (minExp) filter.experienceYears = { ...filter.experienceYears, $gte: Number(minExp) };

    const freelancers = await Freelancer.find(filter).limit(100);

    console.log("TOTAL APPROVED FREELANCERS:", freelancers.length);

    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// SEED SAMPLE FREELANCERS (ALL DOMAINS)
// ==========================
router.get("/seed", async (req, res) => {
  try {
    await Freelancer.deleteMany({});

    const sample = [
      {
        name: "Arjun Dev",
        email: "arjun@proconnect.test",
        role: "React Developer",
        skills: ["React", "JavaScript", "API", "Redux", "CSS", "HTML"],
        experienceYears: 4,
        hourlyRate: 25,
        rating: 4.8,
        about: "Frontend developer specializing in React applications and scalable UI systems.",
        socialLinks: ["https://linkedin.com/in/arjundev"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Sneha Web",
        email: "sneha@proconnect.test",
        role: "Frontend Developer",
        skills: ["HTML", "CSS", "JavaScript", "React", "Bootstrap"],
        experienceYears: 3,
        hourlyRate: 22,
        rating: 4.7,
        about: "Frontend developer creating responsive websites and landing pages.",
        socialLinks: ["https://linkedin.com/in/snehaweb"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Rahul Node",
        email: "rahul@proconnect.test",
        role: "Backend Developer",
        skills: ["Node.js", "Express", "MongoDB", "API", "JWT"],
        experienceYears: 4,
        hourlyRate: 28,
        rating: 4.8,
        about: "Backend developer building scalable APIs and databases.",
        socialLinks: ["https://linkedin.com/in/rahulnode"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Dinesh Java",
        email: "dinesh@proconnect.test",
        role: "Java Backend Developer",
        skills: ["Java", "Spring Boot", "MySQL", "REST API", "Hibernate"],
        experienceYears: 5,
        hourlyRate: 35,
        rating: 4.9,
        about: "Java backend developer with Spring Boot and enterprise application experience.",
        socialLinks: ["https://linkedin.com/in/dineshjava"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Kavin PHP",
        email: "kavin@proconnect.test",
        role: "PHP Developer",
        skills: ["PHP", "MySQL", "Laravel", "CRUD", "AJAX"],
        experienceYears: 4,
        hourlyRate: 24,
        rating: 4.6,
        about: "PHP developer building dynamic web applications and admin dashboards.",
        socialLinks: ["https://linkedin.com/in/kavinphp"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Sanjay FullStack",
        email: "sanjay@proconnect.test",
        role: "Full Stack Developer",
        skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
        experienceYears: 5,
        hourlyRate: 32,
        rating: 4.9,
        about: "Full stack developer building end-to-end web applications.",
        socialLinks: ["https://linkedin.com/in/sanjayfullstack"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Nivetha MERN",
        email: "nivetha@proconnect.test",
        role: "MERN Stack Developer",
        skills: ["MongoDB", "Express", "React", "Node.js", "Redux"],
        experienceYears: 4,
        hourlyRate: 30,
        rating: 4.8,
        about: "MERN stack developer for startups and e-commerce platforms.",
        socialLinks: ["https://linkedin.com/in/nivethamern"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Priya UX",
        email: "priya@proconnect.test",
        role: "UI/UX Designer",
        skills: ["UI/UX", "Figma", "Adobe XD", "UX Research", "Wireframes"],
        experienceYears: 5,
        hourlyRate: 30,
        rating: 4.9,
        about: "Creative UI/UX designer focused on user-centered design.",
        socialLinks: ["https://linkedin.com/in/priyaux"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Meena Design",
        email: "meena@proconnect.test",
        role: "Graphic Designer",
        skills: ["Photoshop", "Illustrator", "Canva", "Branding", "Logo Design"],
        experienceYears: 4,
        hourlyRate: 20,
        rating: 4.7,
        about: "Graphic designer specializing in logos, posters, and branding kits.",
        socialLinks: ["https://linkedin.com/in/meenadesign"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Karthik AI",
        email: "karthik@proconnect.test",
        role: "AI Engineer",
        skills: ["AI", "Machine Learning", "Python", "TensorFlow", "Data Science"],
        experienceYears: 6,
        hourlyRate: 40,
        rating: 5,
        about: "AI engineer building machine learning models and intelligent systems.",
        socialLinks: ["https://linkedin.com/in/karthikai"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Harini Data",
        email: "harini@proconnect.test",
        role: "Data Analyst",
        skills: ["Python", "SQL", "Excel", "Power BI", "Data Visualization"],
        experienceYears: 3,
        hourlyRate: 27,
        rating: 4.8,
        about: "Data analyst working with dashboards, reports, and business insights.",
        socialLinks: ["https://linkedin.com/in/harinidata"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Vikram Python",
        email: "vikram@proconnect.test",
        role: "Python Developer",
        skills: ["Python", "Django", "Flask", "REST API", "PostgreSQL"],
        experienceYears: 4,
        hourlyRate: 29,
        rating: 4.7,
        about: "Python web developer building APIs and automation tools.",
        socialLinks: ["https://linkedin.com/in/vikrampython"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Asha Mobile",
        email: "asha@proconnect.test",
        role: "Flutter Developer",
        skills: ["Flutter", "Dart", "Firebase", "Android", "iOS"],
        experienceYears: 3,
        hourlyRate: 26,
        rating: 4.8,
        about: "Flutter developer for cross-platform mobile apps.",
        socialLinks: ["https://linkedin.com/in/ashamobile"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Rohit Android",
        email: "rohit@proconnect.test",
        role: "Android Developer",
        skills: ["Java", "Kotlin", "Android Studio", "Firebase", "XML"],
        experienceYears: 4,
        hourlyRate: 28,
        rating: 4.7,
        about: "Android developer building native mobile apps.",
        socialLinks: ["https://linkedin.com/in/rohitandroid"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Manoj DevOps",
        email: "manoj@proconnect.test",
        role: "DevOps Engineer",
        skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
        experienceYears: 5,
        hourlyRate: 38,
        rating: 4.9,
        about: "DevOps engineer managing deployment pipelines and cloud infrastructure.",
        socialLinks: ["https://linkedin.com/in/manojdevops"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Siva Cloud",
        email: "siva@proconnect.test",
        role: "Cloud Engineer",
        skills: ["AWS", "Azure", "Cloud", "Linux", "Networking"],
        experienceYears: 4,
        hourlyRate: 36,
        rating: 4.8,
        about: "Cloud engineer experienced in AWS and Azure deployments.",
        socialLinks: ["https://linkedin.com/in/sivacloud"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Anitha QA",
        email: "anitha@proconnect.test",
        role: "QA Tester",
        skills: ["Manual Testing", "Automation Testing", "Selenium", "JIRA", "Bug Tracking"],
        experienceYears: 4,
        hourlyRate: 23,
        rating: 4.7,
        about: "QA engineer ensuring product quality through testing and bug tracking.",
        socialLinks: ["https://linkedin.com/in/anithaqa"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Naren Secure",
        email: "naren@proconnect.test",
        role: "Cyber Security Analyst",
        skills: ["Cyber Security", "Ethical Hacking", "Network Security", "Penetration Testing", "Linux"],
        experienceYears: 5,
        hourlyRate: 42,
        rating: 4.9,
        about: "Cyber security analyst focused on system protection and vulnerability assessment.",
        socialLinks: ["https://linkedin.com/in/narensecure"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Divya Content",
        email: "divya@proconnect.test",
        role: "Content Writer",
        skills: ["Content Writing", "Blog Writing", "SEO", "Copywriting", "Editing"],
        experienceYears: 3,
        hourlyRate: 18,
        rating: 4.8,
        about: "Content writer creating SEO blogs, website copy, and articles.",
        socialLinks: ["https://linkedin.com/in/divyacontent"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Ajay Digital",
        email: "ajay@proconnect.test",
        role: "Digital Marketer",
        skills: ["SEO", "Google Ads", "Social Media Marketing", "Analytics", "Content Strategy"],
        experienceYears: 4,
        hourlyRate: 25,
        rating: 4.7,
        about: "Digital marketer helping brands grow through SEO and paid campaigns.",
        socialLinks: ["https://linkedin.com/in/ajaydigital"],
        status: "approved",
        profileComplete: true,
      },
      {
        name: "Yuvan Chain",
        email: "yuvan@proconnect.test",
        role: "Blockchain Developer",
        skills: ["Blockchain", "Solidity", "Web3", "Smart Contracts", "Ethereum"],
        experienceYears: 4,
        hourlyRate: 45,
        rating: 4.8,
        about: "Blockchain developer creating decentralized apps and smart contracts.",
        socialLinks: ["https://linkedin.com/in/yuvanchain"],
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

// ==========================
// AI MATCH ROUTE
// ==========================
router.post("/match", async (req, res) => {
  try {
    const { clientText, budget, experience, desiredSkills } = req.body;

    let candidates = await Freelancer.find({ status: "approved" });

    if (!candidates.length) {
      candidates = await Freelancer.find({});
    }

    const textLower = (clientText || "").toLowerCase();
    const desired = (desiredSkills || []).map((s) => s.toLowerCase());

    const scored = candidates
      .map((fr) => {
        let score = 0;
        const skills = fr.skills || [];
        const skillsLower = skills.map((s) => s.toLowerCase());

        const matchedSkills = skills.filter((skill) =>
          desired.includes(skill.toLowerCase())
        );
        score += matchedSkills.length * 30;

        if (fr.role && textLower.includes(fr.role.toLowerCase())) {
          score += 25;
        }

        for (const skill of skillsLower) {
          if (textLower.includes(skill)) score += 10;
        }

        if (experience && fr.experienceYears >= experience) {
          score += 15;
        }

        if (budget && fr.hourlyRate <= budget) {
          score += 15;
        }

        if (fr.rating) {
          score += Math.min(20, fr.rating * 4);
        }

        return {
          freelancer: fr,
          score,
          matchedSkills,
        };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const results = scored.map((x) => ({
      freelancerId: x.freelancer._id,
      name: x.freelancer.name,
      email: x.freelancer.email,
      role: x.freelancer.role,
      score: x.score,
      hourlyRate: x.freelancer.hourlyRate,
      experienceYears: x.freelancer.experienceYears,
      rating: x.freelancer.rating,
      socialLinks: x.freelancer.socialLinks || [],
      matchedSkills: x.matchedSkills,
      skills: x.freelancer.skills || [],
    }));

    res.json({ query: clientText, matches: results });
  } catch (err) {
    console.error("MATCH ROUTE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// GET FREELANCER BY ID
// ==========================
router.get("/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });
    res.json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// UPDATE FREELANCER
// ==========================
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

// ==========================
// DELETE FREELANCER
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findByIdAndDelete(req.params.id);
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });
    res.json({ message: "Freelancer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;