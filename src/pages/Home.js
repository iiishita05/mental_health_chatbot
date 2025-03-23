import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";

const Home = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 200);
  }, []);

  const handleStartChat = () => {
    navigate("/chatbot");
  };

  return (
    <div className={`home-container ${fadeIn ? "fade-in" : ""}`}>
      <Navbar />
      {/* Particle Elements for Background Animation */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <div className="content">
        <h1>
          Welcome to <span>MindEase</span>
        </h1>
        <p>Your AI-powered mental health companion.</p>
        <button className="start-btn" onClick={handleStartChat}>
          Start Chat
        </button>
      </div>
    </div>
  );
};

export default Home;
