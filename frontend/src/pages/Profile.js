import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  if (!isSignedIn) {
    return (
      <div className="profile">
        <div className="profile-card">
          <h2>Please login first</h2>
          <button className="primary-btn" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Generate initials
  const initials = user.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="profile">
      <div className="profile-card">
        
        {/* Avatar */}
        <div className="profile-avatar">
          {initials}
        </div>

        <h2>{user.fullName}</h2>
        <p className="profile-email">
          {user.primaryEmailAddress?.emailAddress}
        </p>

        <div className="profile-info">
          <div className="info-box">
            <span>Member Since</span>
            <p>{new Date(user.createdAt).toDateString()}</p>
          </div>

          <div className="info-box">
            <span>User ID</span>
            <p>{user.id}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="primary-btn"
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/dashboard-client")}
          >
            Go to Dashboard
          </button>
        </div>

        <button
          className="logout-btn"
          onClick={() => signOut(() => navigate("/"))}
        >
          Logout
        </button>
      </div>
    </div>
  );
}