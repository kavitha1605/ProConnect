import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { matchFreelancers, fraudCheckFreelancer } from "../api";
import "./Explore.css";

export default function Match() {
  const navigate = useNavigate();

  const [clientText, setClientText] = useState("");
  const [budget, setBudget] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [fraudLoadingId, setFraudLoadingId] = useState(null);
  const [fraudResults, setFraudResults] = useState({});

  const handleMatch = async () => {
    setLoading(true);
    setHasSearched(true);

    const desiredSkills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const data = await matchFreelancers({
      clientText,
      budget: Number(budget),
      experience: Number(experience),
      desiredSkills,
    });

    const top3 = (data.matches || []).slice(0, 3).map((f) => ({
      ...f,
      id: f.freelancerId,
      skill: f.role || f.matchedSkills?.[0] || "Freelancer",
      rate: `$${f.hourlyRate || 0}/hr`,
      rating:
        typeof f.rating === "number" ? `⭐ ${f.rating}` : f.rating || "⭐ 5.0",
    }));

    setMatches(top3);
    setLoading(false);
  };

  const handleFraudCheck = async (freelancer) => {
    setFraudLoadingId(freelancer.freelancerId);

    const result = await fraudCheckFreelancer({
      id: freelancer.freelancerId,
      name: freelancer.name,
      email: freelancer.email,
      skills: freelancer.matchedSkills || [],
      experienceYears: freelancer.experienceYears,
      rating: freelancer.rating,
      socialLinks: freelancer.socialLinks || [],
      hourlyRate: freelancer.hourlyRate || 0,
    });

    setFraudResults((prev) => ({
      ...prev,
      [freelancer.freelancerId]: result.fraudCheck,
    }));

    setFraudLoadingId(null);
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

  return (
    <div className="explore">
      <div className="top-bar">
        <h2>Find Best Match</h2>
      </div>

      <textarea
        rows="4"
        placeholder="Describe your project..."
        value={clientText}
        onChange={(e) => setClientText(e.target.value)}
      />

      <input
        type="number"
        placeholder="Budget ($/hr)"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />

      <input
        type="number"
        placeholder="Minimum Experience (years)"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      />

      <input
        type="text"
        placeholder="Skills (comma separated: React, Node.js, UI/UX)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <button className="hire-btn" onClick={handleMatch}>
        {loading ? "Matching..." : "Find Best Match"}
      </button>

      {hasSearched && (
        <div className="card-grid" style={{ marginTop: "30px" }}>
          {matches.length > 0 ? (
            matches.map((freelancer) => {
              const fraud = fraudResults[freelancer.freelancerId];

              return (
                <div className="card" key={freelancer.freelancerId}>
                  <div className="avatar">{freelancer.name?.charAt(0)}</div>

                  <h3>{freelancer.name}</h3>
                  <p>{freelancer.skill}</p>
                  <span>{freelancer.rating}</span>
                  <p className="rate">{freelancer.rate}</p>

                  <p>
                    <strong>Matched Skills:</strong>{" "}
                    {freelancer.matchedSkills?.length > 0
                      ? freelancer.matchedSkills.join(", ")
                      : "No exact skill match"}
                  </p>

                  <p>
                    <strong>Experience:</strong> {freelancer.experienceYears || 0} Years
                  </p>

                  <p>
                    <strong>Match Score:</strong> {freelancer.score}
                  </p>

                  {fraud && (
                    <div
                      className="fraud-badge"
                      style={{
                        backgroundColor: getRiskColor(fraud.risk),
                      }}
                    >
                      {fraud.risk.toUpperCase()} RISK ({fraud.riskScore})
                    </div>
                  )}

                  <div className="card-buttons">
                    <button
                      className="fraud-btn"
                      onClick={() => handleFraudCheck(freelancer)}
                      disabled={fraudLoadingId === freelancer.freelancerId}
                    >
                      {fraudLoadingId === freelancer.freelancerId
                        ? "Checking..."
                        : "Run Fraud Check"}
                    </button>

                    <button
                      className="hire-btn"
                      onClick={() =>
                        navigate(`/freelancer/${freelancer.freelancerId}`)
                      }
                      disabled={fraud?.risk === "high"}
                      style={{
                        opacity: fraud?.risk === "high" ? 0.6 : 1,
                        cursor: fraud?.risk === "high" ? "not-allowed" : "pointer",
                      }}
                    >
                      {fraud?.risk === "high" ? "Blocked" : "Hire"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            !loading && <p style={{ marginTop: "20px" }}>No matches found.</p>
          )}
        </div>
      )}
    </div>
  );
}