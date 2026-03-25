import "./About.css";

export default function About() {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <h1>About Us</h1>
        <p>
          Empowering users with secure, fast, and modern digital experiences.
        </p>
      </section>

      {/* Who We Are */}
      <section className="about-section">
        <h2>Who We Are</h2>
        <p>
          We are a passionate team dedicated to building secure and scalable
          web applications. Our goal is to provide seamless user experiences
          with modern technologies.
        </p>
      </section>

      {/* What We Do */}
      <section className="about-section light-bg">
        <h2>What We Do</h2>
        <p>
          We develop secure authentication systems, responsive web platforms,
          and user-friendly interfaces that help businesses grow digitally.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="about-section">
        <h2>Why Choose Us?</h2>
        <ul>
          <li>🔒 Secure Authentication</li>
          <li>⚡ Fast & Responsive Design</li>
          <li>🎯 Simple & User-Friendly Interface</li>
          <li>🚀 Modern Technologies</li>
        </ul>
      </section>

      {/* Call To Action */}
      <section className="about-cta">
        <h2>Join Us Today</h2>
        <p>Experience a smarter and safer digital platform.</p>
      </section>

    </div>
  );
}
