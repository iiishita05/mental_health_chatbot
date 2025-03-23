import React from "react";
import Navbar from "../components/Navbar";
import "./Chatbot.css";

const Chatbot = () => {
  return (
    <div className="chatbot-container">
      <Navbar />
      <div className="chatbot-content">
        <h1>Chat with MindEase</h1>
        <p>Start a conversation with our AI-powered mental health companion.</p>
        <div className="chat-window">
          <p>AI: Hello! How can I assist you today?</p>
          {/* Add chat functionality here */}
        </div>
        <div className="chat-input">
          <input type="text" placeholder="Type your message..." />
          <button>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
