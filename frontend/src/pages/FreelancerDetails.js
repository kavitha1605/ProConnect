import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFreelancerById, fraudCheckFreelancer } from "../api";
import "./FreelancerDetails.css";

const freelancers = [
  {
    id: 1,
    name: "Arjun Dev",
    role: "React Developer",
    rating: "⭐ 4.8",
    price: "$25/hr",
    experience: "4+ Years Experience",
    about:
      "Frontend developer specializing in React applications. Built scalable UI systems for startups and enterprise products.",
    skills: ["React", "JavaScript", "CSS", "API", "Redux"],
  },
  {
    id: 2,
    name: "Priya UX",
    role: "UI/UX Designer",
    rating: "⭐ 4.9",
    price: "$30/hr",
    experience: "5+ Years Experience",
    about:
      "Creative UI/UX designer focused on user-centered design. Delivered 100+ web and mobile designs for global clients.",
    skills: ["Figma", "Adobe XD", "UX Research", "Wireframes"],
  },
  {
    id: 3,
    name: "Karthik AI",
    role: "AI Engineer",
    rating: "⭐ 5.0",
    price: "$40/hr",
    experience: "6+ Years Experience",
    about:
      "AI engineer building machine learning models and intelligent systems using Python and deep learning frameworks.",
    skills: ["Python", "Machine Learning", "TensorFlow", "Data Science"],
  },
];

export default function FreelancerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [freelancer, setFreelancer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fraudResult, setFraudResult] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getFreelancerById(id);
        if (data) {
          setFreelancer({ ...data, id: data._id });
          setError(null);
        } else {
          const fallback = freelancers.find((f) => f.id === parseInt(id));
          if (fallback) {
            setFreelancer(fallback);
            setError(null);
          } else {
            setFreelancer(null);
            setError("Freelancer not found");
          }
        }
      } catch (err) {
        const fallback = freelancers.find((f) => f.id === parseInt(id));
        if (fallback) {
          setFreelancer(fallback);
          setError(null);
        } else {
          setError(err.message || "Error loading freelancer");
          setFreelancer(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h3>Loading freelancer...</h3>
      </div>
    );
  }

  if (error) {
    return <h2 style={{ textAlign: "center" }}>{error}</h2>;
  }

  if (!freelancer) {
    return <h2 style={{ textAlign: "center" }}>Freelancer not found</h2>;
  }

  const runFraudCheck = async () => {
    if (!freelancer) return;
    setChecking(true);
    try {
      const payload = {
        name: freelancer.name,
        email: freelancer.email,
        skills: freelancer.skills,
        experienceYears: freelancer.experienceYears,
        rating: freelancer.rating,
        socialLinks: freelancer.socialLinks,
      };

      if (freelancer._id) {
        payload.id = freelancer._id;
      }

      const result = await fraudCheckFreelancer(payload);
      setFraudResult(result.fraudCheck);
    } catch (err) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="details">
      <div className="details-card">

        <div className="profile-header">

          <div className="avatar-big">
            {freelancer.name.charAt(0)}
          </div>

          <div className="profile-info">
            <h2>{freelancer.name}</h2>
            <p className="role">{freelancer.role}</p>
            <p className="rating">{freelancer.rating}</p>
            <p className="experience">{freelancer.experience}</p>
          </div>

        </div>

        <div className="about">
          <h3>About</h3>
          <p>{freelancer.about}</p>
        </div>

        <div className="skills">
          {freelancer.skills.map((skill, index) => (
            <span key={index}>{skill}</span>
          ))}
        </div>

        <div className="hire-section">
          <h3 className="price">{freelancer.price}</h3>

          <button
            className="hire-btn"
            onClick={() => navigate(`/book/${freelancer.id}`)}
          >
            Hire Now
          </button>

          <button
            className="hire-btn"
            style={{ marginLeft: "8px", background: "#f44336" }}
            onClick={runFraudCheck}
            disabled={checking}
          >
            {checking ? "Checking..." : "Run Fraud Check"}
          </button>
        </div>

        {fraudResult && (
          <div style={{ marginTop: "16px", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
            <h4>Fraud Check</h4>
            <p>
              <strong>Risk:</strong> {fraudResult.risk} ({fraudResult.riskScore})
            </p>
            <ul>
              {fraudResult.reasons?.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}