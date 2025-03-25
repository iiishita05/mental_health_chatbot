import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";
import BASE from "../apis";
import { toast } from "react-toastify";

const Home = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 200);
    fetch(BASE+'/validate', { credentials: 'include' })
    .then(response => response.json())
    .then(data => {
      if(!data.valid){
        localStorage.removeItem("isLogedIn");
        localStorage.removeItem("User");
      }
    })
    .catch(() => toast.error("Unable to login"));
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
