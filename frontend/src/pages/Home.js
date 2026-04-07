import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import heroImg from "../assets/hero.png";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  /* ================= GUEST VIEW ================= */
  if (!isSignedIn) {
    return (
      <div>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">

            {/* IMAGE FIRST (LEFT SIDE) */}
            <div className="hero-image">
              <img src={heroImg} alt="Hero" />
            </div>

            {/* TEXT SECOND (RIGHT SIDE) */}
            <div className="hero-text">
              <h1>
                Connect Smarter <br />
                with <span>ProConnect</span>
              </h1>

              <p>
                ProConnect helps you hire top freelancers faster using
                intelligent matching and secure collaboration tools.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary"
                  onClick={() => navigate("/register")}
                >
                  Get Started →
                </button>

                <button
                  className="secondary"
                  onClick={() => navigate("/login")}
                >
                  Login →
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2>Why Choose ProConnect?</h2>
          <div className="features-cards">
            <div className="feature-card">
              <h3>Verified Freelancers</h3>
              <p>All freelancers are verified and rated to ensure quality work.</p>
            </div>
            <div className="feature-card">
              <h3>Smart Matching</h3>
              <p>AI-assisted recommendations help you find the best talent fast.</p>
            </div>
            <div className="feature-card">
              <h3>Secure Payments</h3>
              <p>Pay safely after your project milestones are completed.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <h3>1. Explore Freelancers</h3>
              <p>Browse verified freelancers based on skills and ratings.</p>
            </div>
            <div className="step">
              <h3>2. Hire & Collaborate</h3>
              <p>Book freelancers directly and manage projects in one place.</p>
            </div>
            <div className="step">
              <h3>3. Secure Payment</h3>
              <p>Pay securely after project completion and leave reviews.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-banner">
          <h2>Ready to Hire the Best Freelancers?</h2>
          <button
            className="primary"
            onClick={() => navigate("/register")}
          >
            Get Started →
          </button>
        </section>
      </div>
    );
  }

  /* ================= DASHBOARD VIEW ================= */

  const recommended = [
    { id: 101, name: "Kannan", skills: "React / Node", rating: 4.8 },
    { id: 102, name: "John Durairaj", skills: "Full Stack", rating: 4.9 },
    { id: 103, name: "Sathya", skills: "UI/UX Designer", rating: 4.7 },
  ];

  const notifications = [
    "Your booking with Jane Doe has been confirmed ✅",
    "New freelancer John Smith is now available 🔔",
    "Your profile was viewed 10 times this week 👀",
  ];

  return (
    <section className="dashboard">
      <div className="dashboard-top">
        <h2>Welcome back, {user.firstName} 👋</h2>

        <button
          className="logout-btn"
          onClick={() => signOut(() => navigate("/"))}
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Jobs</h3>
          <p>15</p>
        </div>

        <div className="stat-card">
          <h3>Active Freelancers</h3>
          <p>28</p>
        </div>

        <div className="stat-card">
          <h3>Pending Applications</h3>
          <p>5</p>
        </div>

        <div className="stat-card">
          <h3>Completed Projects</h3>
          <p>12</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>

        <div className="actions">
          <button onClick={() => navigate("/explore")}>
            Explore Freelancers
          </button>

          <button onClick={() => navigate("/my-bookings")}>
            My Bookings
          </button>

          <button onClick={() => navigate("/profile")}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Recommended Freelancers */}
      <div className="recommended">
        <h3>Recommended Freelancers</h3>

        <div className="freelancer-list">
          {recommended.map((freelancer) => (
            <div
              key={freelancer.id}
              className="freelancer-card"
              onClick={() => navigate(`/freelancer/${freelancer.id}`)}
            >
              <p>{freelancer.name}</p>
              <p>{freelancer.skills}</p>
              <p>⭐ {freelancer.rating}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="notifications">
        <h3>Recent Notifications</h3>

        <ul>
          {notifications.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
