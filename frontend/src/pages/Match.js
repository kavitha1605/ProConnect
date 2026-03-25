import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { matchFreelancers } from "../api";
import "./Explore.css";

export default function Match() {
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState(0);
  const [experience, setExperience] = useState(0);
  const [skills, setSkills] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleMatch = async () => {
    setError(null);

    if (!query) {
      setError("Write your project requirements for matching.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        clientText: query,
        budget: budget || null,
        experience: experience || null,
        desiredSkills: skills
          ? skills.split(",").map((s) => s.trim().toLowerCase())
          : [],
      };

      const response = await matchFreelancers(payload);

      // ✅ Remove alert completely
      // alert(JSON.stringify(response, null, 2));

      // Directly set results to render cards
      setResults(response.matches || []);
    } catch (err) {
      setError(err.message || "Unable to match freelancers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="explore">
      <h2>AI Profile Matching</h2>

      <textarea
        placeholder="Describe your project..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <input
        type="number"
        placeholder="Max budget ($)"
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="Experience (years)"
        value={experience}
        onChange={(e) => setExperience(Number(e.target.value))}
      />

      <input
        type="text"
        placeholder="Skills (comma-separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <button className="hire-btn" onClick={handleMatch}>
        {loading ? "Matching..." : "Find best freelancers"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ⭐ Best Match */}
      {results.length > 0 && (
        <h3 style={{ color: "#6c4cff", marginTop: "20px" }}>
          ⭐ Best Match: {results[0].name}
        </h3>
      )}

      {/* Results Cards */}
      {results.length > 0 && (
        <div className="card-grid" style={{ marginTop: "20px" }}>
          {results.map((item) => (
            <div className="card" key={item.freelancerId}>
              <div className="avatar">{item.name.charAt(0)}</div>

              <h3>{item.name}</h3>
              <p><strong>Score:</strong> {item.score}</p>
              <p>
                <strong>Skills:</strong>{" "}
                {item.matchedSkills && item.matchedSkills.length > 0
                  ? item.matchedSkills.join(", ")
                  : "None"}
              </p>

              <button
                className="hire-btn"
                onClick={() => navigate(`/freelancer/${item.freelancerId}`)}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !loading && (
        <p style={{ marginTop: "20px" }}>No matches yet.</p>
      )}
    </div>
  );
}