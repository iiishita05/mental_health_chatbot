import React from "react";
import Navbar from "../components/Navbar";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <Navbar />
      <div className="contact-content">
        <h1>Contact Us</h1>
        <p>
          Have questions or need support? Reach out to us using the form below.
        </p>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
