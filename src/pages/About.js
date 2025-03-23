import React from "react";
import Navbar from "../components/Navbar";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <Navbar />
      <div className="about-content">
        <h1>About Us</h1>
        <p>
          MindEase is an AI-powered mental health platform designed to provide
          support and companionship. Our mission is to make mental health
          resources accessible to everyone, anytime, anywhere.
        </p>
        <p>
          We combine cutting-edge AI technology with compassionate care to help
          you navigate life's challenges. Whether you're feeling stressed,
          anxious, or just need someone to talk to, MindEase is here for you.
        </p>
      </div>
    </div>
  );
};

export default About;
