import { useState } from "react";
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
        desiredSkills: skills ? skills.split(",").map((s) => s.trim()) : [],
      };
      const response = await matchFreelancers(payload);
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
        placeholder="Describe what you need: e.g., Build a React dashboard with API integration, 2 weeks timeline"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <input
        type="number"
        placeholder="Max hourly budget ($)"
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="Minimum experience (years)"
        value={experience}
        onChange={(e) => setExperience(Number(e.target.value))}
      />

      <input
        type="text"
        placeholder="Desired skills (comma-separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <button className="hire-btn" onClick={handleMatch} disabled={loading}>
        {loading ? "Matching..." : "Find best freelancers"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <div className="card-grid" style={{ marginTop: "16px" }}>
          {results.map((item) => (
            <div className="card" key={item.freelancerId}>
              <div className="avatar">{item.name.charAt(0)}</div>
              <h3>{item.name}</h3>
              <p>Score: {item.score}</p>
              <p>Matched skills: {item.matchedSkills?.join(", ") || "(none)"}</p>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !loading && <p>No matches yet.</p>}
    </div>
  );
}
