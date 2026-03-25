import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookings } from "../api"; 
import "./Dashboard.css";

export default function DashboardClient() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser || savedUser.role !== "client") {
      navigate("/login");
      return;
    }
    setUser(savedUser);

    getBookings(savedUser._id)
      .then(res => setBookings(res))
      .catch(err => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Client Dashboard</h2>
        <p>Welcome, {user.name}</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* ROLE ACTION BUTTON */}
      <button className="role-button">Post a Job</button>

      {/* BOOKINGS */}
      <h3 className="booking-title">My Bookings</h3>

      {bookings.length === 0 ? (
        <p className="no-bookings">No bookings yet.</p>
      ) : (
        <ul className="booking-list">
          {bookings.map(b => (
            <li key={b._id} className="booking-card">
              <p><b>Freelancer:</b> {b.freelancerName}</p>
              <p><b>Title:</b> {b.title}</p>
              <p><b>Date:</b> {b.date}</p>
              <p><b>Budget:</b> ${b.budget}</p>
              <p><b>Status:</b> {b.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
