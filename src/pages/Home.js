import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import ChatbotImage from "../assets/WhatsApp Image 2025-03-23 at 1.04.46 AM.jpeg"; // Replace with your image path

const Home = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">MindEase</h2>
        <div className="menu-icon">&#9776;</div>
        <ul className="nav-links">
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/faq">FAQ</Link>
          </li>
          <li>
            <Link to="/help">Help</Link>
          </li>
          <li>
            <Link to="/profile">User Profile</Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to MindEase</h1>
          <p>Your AI-powered mental health companion.</p>
          <Link to="/chatbot">
            <button className="start-btn">Start Chat</button>
          </Link>
        </div>
        <div className="hero-image">
          <img src={ChatbotImage} alt="AI Chatbot" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 MindEase | All Rights Reserved</p>
        <div className="footer-links">
          <a href="#">Help & Support</a> |<a href="#">Contact Us</a> |
          <a href="#">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;