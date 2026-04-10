import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import "./Bookings.css";

export default function Bookings() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { id: freelancerId } = useParams();

  const [loading, setLoading] = useState(true);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [projectBudget, setProjectBudget] = useState("");

  // ✅ Auth check
  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [user, isLoaded, navigate]);

  // ✅ Handle booking
  const handleBooking = async () => {
    if (!projectTitle || !projectDate || !projectBudget) {
      alert("Please fill all required fields");
      return;
    }

    try {
      // 🔥 Fetch freelancer details
      const resFreelancer = await fetch(`/api/freelancers/${freelancerId}`);
      const freelancer = await resFreelancer.json();

      // ✅ Booking data with required fields
      const bookingData = {
        freelancerId,
        userId: user.id,
        title: projectTitle,
        description: projectDescription,
        date: projectDate,
        budget: projectBudget,

        // ✅ Important for MyBookings UI
        freelancerName: freelancer.name,
        skills: freelancer.skills ? freelancer.skills.join(", ") : "",
        status: "Pending",
      };

      console.log("Booking Data:", bookingData);

      // 🔥 Save booking
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Booking successful!");
        navigate("/my-bookings"); // ✅ go to bookings page
      } else {
        alert(result.error || "Booking failed!");
      }

    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong!");
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="booking">
      <div className="booking-card">
        <h2>Book Freelancer #{freelancerId}</h2>

        <input
          type="text"
          placeholder="Project Title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />

        <textarea
          placeholder="Project Description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />

        <input
          type="date"
          value={projectDate}
          onChange={(e) => setProjectDate(e.target.value)}
        />

        <div className="budget-input">
          <span className="rupee">₹</span>
          <input
            type="number"
            placeholder="Amount"
            value={projectBudget}
            onChange={(e) => setProjectBudget(e.target.value)}
          />
        </div>

        <button className="primary-btn" onClick={handleBooking}>
          Book Now
        </button>
      </div>
    </div>
  );
}