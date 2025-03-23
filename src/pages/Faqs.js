import React from "react";
import Navbar from "../components/Navbar";
import "./Faqs.css";

const Faqs = () => {
  return (
    <div className="faqs-container">
      <Navbar />
      <div className="faqs-content">
        <h1>Frequently Asked Questions</h1>
        <div className="faq-item">
          <h2>How does MindEase work?</h2>
          <p>
            MindEase uses AI to provide emotional support through chat, mood
            tracking, and guided meditation.
          </p>
        </div>
        <div className="faq-item">
          <h2>Is my data private?</h2>
          <p>
            Yes, we prioritize your privacy and use encryption to protect your
            data.
          </p>
        </div>
        <div className="faq-item">
          <h2>Can I use MindEase for free?</h2>
          <p>
            We offer a free tier with basic features, and premium plans for
            additional services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
