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
    experienceYears: 4,
    hourlyRate: 25,
    email: "arjun@proconnect.test",
    about:
      "Frontend developer specializing in React applications. Built scalable UI systems for startups and enterprise products.",
    skills: ["React", "JavaScript", "CSS", "API", "Redux"],
    socialLinks: ["https://linkedin.com/in/arjundev"],
  },
  {
    id: 2,
    name: "Priya UX",
    role: "UI/UX Designer",
    rating: "⭐ 4.9",
    price: "$30/hr",
    experience: "5+ Years Experience",
    experienceYears: 5,
    hourlyRate: 30,
    email: "priya@proconnect.test",
    about:
      "Creative UI/UX designer focused on user-centered design. Delivered 100+ web and mobile designs for global clients.",
    skills: ["Figma", "Adobe XD", "UX Research", "Wireframes"],
    socialLinks: ["https://linkedin.com/in/priyaux"],
  },
  {
    id: 3,
    name: "Karthik AI",
    role: "AI Engineer",
    rating: "⭐ 5.0",
    price: "$40/hr",
    experience: "6+ Years Experience",
    experienceYears: 6,
    hourlyRate: 40,
    email: "karthik@proconnect.test",
    about:
      "AI engineer building machine learning models and intelligent systems using Python and deep learning frameworks.",
    skills: ["Python", "Machine Learning", "TensorFlow", "Data Science"],
    socialLinks: ["https://linkedin.com/in/karthikai"],
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
          setFreelancer({
            ...data,
            id: data._id || data.id,
            role: data.role || data.skill || "Freelancer",
            about: data.about || "No description available.",
            experience:
              data.experience ||
              `${data.experienceYears || 0}+ Years Experience`,
            price: data.price || `$${data.hourlyRate || 0}/hr`,
            rating:
              typeof data.rating === "number"
                ? `⭐ ${data.rating}`
                : data.rating || "⭐ 5.0",
            skills: data.skills || [],
            socialLinks: data.socialLinks || [],
          });
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

  const runFraudCheck = async () => {
    if (!freelancer) return;

    setChecking(true);
    setError(null);

    try {
      const numericRating =
        typeof freelancer.rating === "string"
          ? parseFloat(freelancer.rating.replace(/[^\d.]/g, "")) || 5
          : freelancer.rating || 5;

      const payload = {
        id: freelancer._id || freelancer.id,
        name: freelancer.name,
        email: freelancer.email || "",
        skills: freelancer.skills || [],
        experienceYears: freelancer.experienceYears || 0,
        rating: numericRating,
        socialLinks: freelancer.socialLinks || [],
        hourlyRate: freelancer.hourlyRate || 0,
      };

      const result = await fraudCheckFreelancer(payload);
      setFraudResult(result.fraudCheck);
    } catch (err) {
      setError(err.message || "Fraud check failed");
    } finally {
      setChecking(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "low":
        return "#2e7d32";
      case "medium":
        return "#f57c00";
      case "high":
        return "#d32f2f";
      default:
        return "#666";
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h3>Loading freelancer...</h3>
      </div>
    );
  }

  if (error && !freelancer) {
    return <h2 style={{ textAlign: "center" }}>{error}</h2>;
  }

  if (!freelancer) {
    return <h2 style={{ textAlign: "center" }}>Freelancer not found</h2>;
  }

  return (
    <div className="details">
      <div className="details-card">
        <div className="profile-header">
          <div className="avatar-big">{freelancer.name.charAt(0)}</div>

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
          {freelancer.skills?.map((skill, index) => (
            <span key={index}>{skill}</span>
          ))}
        </div>

        <div className="hire-section">
          <h3 className="price">{freelancer.price}</h3>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="hire-btn"
              onClick={() => navigate(`/book/${freelancer.id}`)}
              disabled={fraudResult?.risk === "high"}
              style={{
                opacity: fraudResult?.risk === "high" ? 0.6 : 1,
                cursor: fraudResult?.risk === "high" ? "not-allowed" : "pointer",
              }}
            >
              {fraudResult?.risk === "high" ? "Hiring Blocked" : "Hire Now"}
            </button>

            <button
              className="hire-btn"
              style={{ background: "#f44336" }}
              onClick={runFraudCheck}
              disabled={checking}
            >
              {checking ? "Checking..." : "Run Fraud Check"}
            </button>
          </div>
        </div>

        {error && (
          <p style={{ color: "red", marginTop: "15px", fontWeight: "500" }}>
            {error}
          </p>
        )}

        {fraudResult && (
          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              borderRadius: "12px",
              background: "#f9f9f9",
              border: `2px solid ${getRiskColor(fraudResult.risk)}`,
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>Fraud Check Result</h4>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: getRiskColor(fraudResult.risk),
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {fraudResult.risk}
              </span>
            </p>

            <p>
              <strong>Risk Score:</strong> {fraudResult.riskScore} / 100
            </p>

            {fraudResult.reasons?.length > 0 && (
              <>
                <p style={{ marginTop: "10px", fontWeight: "600" }}>
                  Reasons:
                </p>
                <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
                  {fraudResult.reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}