import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-page">

      {/* Hero Section */}
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>We would love to hear from you. Get in touch with us anytime.</p>
      </section>

      {/* Contact Form Section */}
      <section className="contact-section">
        <div className="contact-container">

          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Email     : proConnectSupport@gmail.com</p>
            <p>Phone     : +91 98765 43210</p>
            <p>Location  : Chennai, India</p>
          </div>

          <form className="contact-form">
            <h2>Send Message</h2>

            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="4" required></textarea>

            <button type="submit">Send Message</button>
          </form>

        </div>
      </section>

    </div>
  );
}
