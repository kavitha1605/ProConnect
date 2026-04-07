import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";
import { getFreelancers } from "../api";

const fallbackFreelancers = [
  { id: 1, name: "Arjun Dev", role: "freelancer",skill: "React Developer", rate: "$25/hr", rating: "⭐ 4.8", skills: ["React", "JavaScript", "CSS"], experienceYears: 4, email: "arjun@proconnect.test", socialLinks: ["https://linkedin.com/in/arjundev"], hourlyRate: 25 },
  { id: 2, name: "Sneha Web",role: "freelancer", skill: "Frontend Developer", rate: "$22/hr", rating: "⭐ 4.7", skills: ["HTML", "CSS", "React"], experienceYears: 3, email: "sneha@proconnect.test", socialLinks: [], hourlyRate: 22 },
  { id: 3, name: "Rahul Node", role: "freelancer",skill: "Backend Developer", rate: "$28/hr", rating: "⭐ 4.8", skills: ["Node.js", "Express", "MongoDB"], experienceYears: 4, email: "rahul@proconnect.test", socialLinks: ["https://linkedin.com/in/rahulnode"], hourlyRate: 28 },
  { id: 4, name: "Dinesh Java", role: "freelancer",skill: "Java Backend Developer", rate: "$35/hr", rating: "⭐ 4.9", skills: ["Java", "Spring Boot", "MySQL"], experienceYears: 5, email: "dinesh@proconnect.test", socialLinks: ["https://linkedin.com/in/dineshjava"], hourlyRate: 35 },
  { id: 5, name: "Kavin PHP", role: "freelancer",skill: "PHP Developer", rate: "$24/hr", rating: "⭐ 4.6", skills: ["PHP", "Laravel", "MySQL"], experienceYears: 4, email: "kavin@proconnect.test", socialLinks: ["https://linkedin.com/in/kavinphp"], hourlyRate: 24 },
  { id: 6, name: "Sanjay FullStack",role: "freelancer", skill: "Full Stack Developer", rate: "$32/hr", rating: "⭐ 4.9", skills: ["React", "Node.js", "MongoDB"], experienceYears: 5, email: "sanjay@proconnect.test", socialLinks: ["https://linkedin.com/in/sanjayfullstack"], hourlyRate: 32 },
  { id: 7, name: "Nivetha MERN",role: "freelancer", skill: "MERN Stack Developer", rate: "$30/hr", rating: "⭐ 4.8", skills: ["MongoDB", "Express", "React"], experienceYears: 4, email: "nivetha@proconnect.test", socialLinks: ["https://linkedin.com/in/nivethamern"], hourlyRate: 30 },
  { id: 8, name: "Priya UX", role: "freelancer",skill: "UI/UX Designer", rate: "$30/hr", rating: "⭐ 4.9", skills: ["Figma", "Adobe XD", "UX"], experienceYears: 5, email: "priya@proconnect.test", socialLinks: ["https://linkedin.com/in/priyaux"], hourlyRate: 30 },
  { id: 9, name: "Meena Design", role: "freelancer",skill: "Graphic Designer", rate: "$20/hr", rating: "⭐ 4.7", skills: ["Photoshop", "Illustrator", "Canva"], experienceYears: 4, email: "meena@proconnect.test", socialLinks: ["https://linkedin.com/in/meenadesign"], hourlyRate: 20 },
  { id: 10, name: "Karthik AI", role: "freelancer",skill: "AI Engineer", rate: "$40/hr", rating: "⭐ 5.0", skills: ["AI", "Machine Learning", "Python"], experienceYears: 6, email: "karthik@proconnect.test", socialLinks: ["https://linkedin.com/in/karthikai"], hourlyRate: 40 },
  { id: 11, name: "Harini Data", role: "freelancer",skill: "Data Analyst", rate: "$27/hr", rating: "⭐ 4.8", skills: ["Python", "SQL", "Power BI"], experienceYears: 3, email: "harini@proconnect.test", socialLinks: ["https://linkedin.com/in/harinidata"], hourlyRate: 27 },
  { id: 12, name: "Vikram Python", role: "freelancer",skill: "Python Developer", rate: "$29/hr", rating: "⭐ 4.7", skills: ["Python", "Django", "Flask"], experienceYears: 4, email: "vikram@proconnect.test", socialLinks: ["https://linkedin.com/in/vikrampython"], hourlyRate: 29 },
  { id: 13, name: "Asha Mobile", role: "freelancer",skill: "Flutter Developer", rate: "$26/hr", rating: "⭐ 4.8", skills: ["Flutter", "Dart", "Firebase"], experienceYears: 3, email: "asha@proconnect.test", socialLinks: ["https://linkedin.com/in/ashamobile"], hourlyRate: 26 },
  { id: 14, name: "Rohit Android", role: "freelancer",skill: "Android Developer", rate: "$28/hr", rating: "⭐ 4.7", skills: ["Java", "Kotlin", "Android Studio"], experienceYears: 4, email: "rohit@proconnect.test", socialLinks: ["https://linkedin.com/in/rohitandroid"], hourlyRate: 28 },
  { id: 15, name: "Manoj DevOps", role: "freelancer",skill: "DevOps Engineer", rate: "$38/hr", rating: "⭐ 4.9", skills: ["Docker", "Kubernetes", "AWS"], experienceYears: 5, email: "manoj@proconnect.test", socialLinks: ["https://linkedin.com/in/manojdevops"], hourlyRate: 38 },
  { id: 16, name: "Siva Cloud", role: "freelancer",skill: "Cloud Engineer", rate: "$36/hr", rating: "⭐ 4.8", skills: ["AWS", "Azure", "Linux"], experienceYears: 4, email: "siva@proconnect.test", socialLinks: ["https://linkedin.com/in/sivacloud"], hourlyRate: 36 },
  { id: 17, name: "Anitha QA", role: "freelancer",skill: "QA Tester", rate: "$23/hr", rating: "⭐ 4.7", skills: ["Testing", "Selenium", "JIRA"], experienceYears: 4, email: "anitha@proconnect.test", socialLinks: ["https://linkedin.com/in/anithaqa"], hourlyRate: 23 },
  { id: 18, name: "Naren Secure", role: "freelancer",skill: "Cyber Security Analyst", rate: "$42/hr", rating: "⭐ 4.9", skills: ["Cyber Security", "Ethical Hacking", "Linux"], experienceYears: 5, email: "naren@proconnect.test", socialLinks: ["https://linkedin.com/in/narensecure"], hourlyRate: 42 },
  { id: 19, name: "Divya Content", role: "freelancer",skill: "Content Writer", rate: "$18/hr", rating: "⭐ 4.8", skills: ["Content Writing", "SEO", "Copywriting"], experienceYears: 3, email: "divya@proconnect.test", socialLinks: ["https://linkedin.com/in/divyacontent"], hourlyRate: 18 },
  { id: 20, name: "Ajay Digital", role: "freelancer",skill: "Digital Marketer", rate: "$25/hr", rating: "⭐ 4.7", skills: ["SEO", "Google Ads", "Analytics"], experienceYears: 4, email: "ajay@proconnect.test", socialLinks: ["https://linkedin.com/in/ajaydigital"], hourlyRate: 25 },
  { id: 21, name: "Yuvan Chain", role: "freelancer",skill: "Blockchain Developer", rate: "$45/hr", rating: "⭐ 4.8", skills: ["Blockchain", "Solidity", "Web3"], experienceYears: 4, email: "yuvan@proconnect.test", socialLinks: ["https://linkedin.com/in/yuvanchain"], hourlyRate: 45 }
];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
  const fetchFreelancers = async () => {
    try {
      const data = await getFreelancers();

      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((f, index) => ({
          ...f,
          id: f._id,
          skill: f.skill || f.role || f.skills?.[0] || "Freelancer",
          rate: `$${f.hourlyRate || 0}/hr`,
          rating: f.rating ? `⭐ ${f.rating}` : "⭐ 5.0",
          skills: Array.isArray(f.skills) ? f.skills : [],
          experienceYears: f.experienceYears || 0,
          socialLinks: Array.isArray(f.socialLinks) ? f.socialLinks : [],
          hourlyRate: f.hourlyRate || 0,
        }));

        setFreelancers(formatted);
      } else {
        // fallback if API returns empty
        setFreelancers(fallbackFreelancers);
      }

    } catch (err) {
      console.error("API failed, using fallback:", err);

      // fallback if API fails
      //setFreelancers(fallbackFreelancers);
      setFreelancers([]);
    } finally {
      setLoading(false);
    }
  };

  fetchFreelancers();
}, []);
  const filteredFreelancers = freelancers.filter((freelancer) =>
    freelancer.skill?.toLowerCase().includes(search.toLowerCase()) ||
    freelancer.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="explore loading">
        <h2>Loading freelancers...</h2>
      </div>
    );
  }

  return (
    <div className="explore">
      <div className="top-bar">
        <h2>Explore Freelancers</h2>

        <button className="hire-btn" onClick={() => navigate("/match")}>
          Find Freelancer
        </button>
      </div>

      <input
        className="search"
        type="text"
        placeholder="Search skills (React, AI, UI...)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <div style={{ marginBottom: "15px", fontWeight: "600" }}>
        Total Freelancers: {filteredFreelancers.length}
      </div>

      <div className="card-grid">
        {filteredFreelancers.map((freelancer) => {

          return (
            <div className="card" key={freelancer.id}>
              <div className="avatar">{freelancer.name.charAt(0)}</div>

              <h3>{freelancer.name}</h3>
              <p>{freelancer.skill}</p>
              <span>{freelancer.rating}</span>
              <p className="rate">{freelancer.rate}</p>


              <div className="card-buttons">

                <button
  className="hire-btn"
  onClick={() => navigate(`/freelancer/${freelancer.id}`)}
>
  Hire
</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}