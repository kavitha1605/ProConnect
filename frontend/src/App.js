import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import DashboardClient from "./pages/DashboardClient";
import DashboardFreelancer from "./pages/DashboardFreelancer";
import Profile from "./pages/Profile";
import FreelancerDetails from "./pages/FreelancerDetails";
import Bookings from "./pages/Bookings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyBookings from "./pages/MyBookings";
import Match from "./pages/Match";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/dashboard-client" element={<DashboardClient />} />
        <Route path="/dashboard-freelancer" element={<DashboardFreelancer />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/freelancer/:id" element={<FreelancerDetails />} />
        <Route path="/book/:id" element={<Bookings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/match" element={<Match />} />
      </Routes>
    </>
  );
}

export default App;