import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";
import { getFreelancers } from "../api";

const fallbackFreelancers = [
  { id: 1, name: "Arjun Dev", skill: "React Developer", rate: "$25/hr", rating: "⭐ 4.8" },
  { id: 2, name: "Priya UX", skill: "UI/UX Designer", rate: "$30/hr", rating: "⭐ 4.9" },
  { id: 3, name: "Karthik AI", skill: "AI Engineer", rate: "$40/hr", rating: "⭐ 5.0" },
  { id: 4, name: "Sneha Web", skill: "Frontend Developer", rate: "$22/hr", rating: "⭐ 4.7" },
  { id: 5, name: "Rahul Node", skill: "Backend Developer", rate: "$28/hr", rating: "⭐ 4.8" },
  { id: 6, name: "Meera Cloud", skill: "Cloud Engineer", rate: "$35/hr", rating: "⭐ 4.9" },
  { id: 7, name: "Vikram Data", skill: "Data Analyst", rate: "$27/hr", rating: "⭐ 4.6" },
  { id: 8, name: "Divya ML", skill: "Machine Learning", rate: "$45/hr", rating: "⭐ 5.0" },
  { id: 9, name: "Rohit DevOps", skill: "DevOps Engineer", rate: "$38/hr", rating: "⭐ 4.9" },
  { id: 10, name: "Asha Mobile", skill: "Flutter Developer", rate: "$26/hr", rating: "⭐ 4.8" },
  { id: 11, name: "Manoj UI", skill: "Graphic Designer", rate: "$20/hr", rating: "⭐ 4.5" },
  { id: 12, name: "Nisha SEO", skill: "SEO Specialist", rate: "$18/hr", rating: "⭐ 4.6" },
  { id: 13, name: "Harish Python", skill: "Python Developer", rate: "$29/hr", rating: "⭐ 4.8" },
  { id: 14, name: "Lavanya QA", skill: "QA Tester", rate: "$21/hr", rating: "⭐ 4.7" },
  { id: 15, name: "Sanjay FullStack", skill: "Full Stack Developer", rate: "$32/hr", rating: "⭐ 4.9" }
];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getFreelancers();
        if (data?.length) {
          setFreelancers(data.map((f) => ({ ...f, id: f._id })));
        } else {
          setFreelancers(fallbackFreelancers);
        }
      } catch (err) {
        setError(err.message);
        setFreelancers(fallbackFreelancers);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredFreelancers = freelancers.filter((freelancer) =>
    freelancer.skill.toLowerCase().includes(search.toLowerCase()) ||
    freelancer.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="explore" style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Loading freelancers...</h2>
      </div>
    );
  }

  return (
    <div className="explore">
      <h2>Explore Freelancers</h2>

      <input
        className="search"
        type="text"
        placeholder="Search skills (React, AI, UI...)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="card-grid">
        {filteredFreelancers.map((freelancer) => (
          <div className="card" key={freelancer.id}>
            <div className="avatar">
              {freelancer.name.charAt(0)}
            </div>

            <h3>{freelancer.name}</h3>
            <p>{freelancer.skill}</p>
            <span>{freelancer.rating}</span>
            <p className="rate">{freelancer.rate}</p>

            <button
              className="hire-btn"
              onClick={() => navigate(`/freelancer/${freelancer.id}`)}
            >
              Hire
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}