import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

export default function MyBookings() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  // Fetch user's bookings from backend (replace URL with your API)
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(`/api/bookings/client/${user.id}`);
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    }
    fetchBookings();
  }, [user.id]);

  return (
    <section className="my-bookings-page">
      <h2>My Bookings</h2>
      <p>Hello {user.firstName}, here are all your bookings:</p>

      <div className="my-bookings-list">
        {bookings.length === 0 ? (
          <p>You have no bookings yet.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="my-booking-card">
              <h3>{booking.freelancerName}</h3>
              <p>Skills: {booking.skills}</p>
              <p>Date: {booking.date}</p>
              <p>Time: {booking.time}</p>
              <p>Status: {booking.status}</p>
              <button onClick={() => navigate(`/freelancer/${booking.freelancerId}`)}>
                View Freelancer
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}