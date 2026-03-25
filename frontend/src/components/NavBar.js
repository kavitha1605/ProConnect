import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { NavLink, Link } from "react-router-dom";

import "./NavBar.css";

export default function Navbar() {
  return (
    <nav className="navbar">

      {/* Logo */}
      <Link to="/" className="logo">
        ProConnect
      </Link>

      {/* Center links */}
      <div className="navbar-center">
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/explore" className="nav-link">Explore</NavLink>
        <NavLink to="/about" className="nav-link">About</NavLink>
        <NavLink to="/contact" className="nav-link">Contact</NavLink>
        <NavLink to="/profile" className="nav-link">Profile</NavLink>
      </div>

      {/* Right side auth */}
      <div className="navbar-right">
        <SignedOut>
          <Link to="/login" className="btn login-btn">Login</Link>
          <Link to="/register" className="btn register-btn">Register</Link>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}