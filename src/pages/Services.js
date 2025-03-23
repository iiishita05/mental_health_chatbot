import React from "react";
import Navbar from "../components/Navbar";
import "./Services.css";

const Services = () => {
  return (
    <div className="services-container">
      <Navbar />
      <div className="services-content">
        <h1>Our Services</h1>
        <div className="service-item">
          <h2>AI Chat Support</h2>
          <p>
            Engage in real-time conversations with our AI to get emotional
            support and guidance.
          </p>
        </div>
        <div className="service-item">
          <h2>Mood Tracking</h2>
          <p>
            Monitor your emotional well-being with our mood tracking tools and
            insights.
          </p>
        </div>
        <div className="service-item">
          <h2>Guided Meditation</h2>
          <p>
            Access guided meditation sessions to help you relax and reduce
            stress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
