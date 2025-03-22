import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages([
        ...messages,
        { text: "I'm here for you! 💙", sender: "bot" },
      ]);
      setTyping(false);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Chat History</h3>
        <ul>
          <li>Session 1</li>
          <li>Session 2</li>
        </ul>
      </aside>

      {/* Chat Section */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {typing && <p className="typing-indicator">Bot is typing...</p>}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input & Buttons */}
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
        <button className="voice-btn">🎤</button>
        <button className="attach-btn">📎</button>
      </div>

      {/* Reset Chat */}
      <button
        className="reset-btn"
        onClick={() =>
          setMessages([{ text: "Hello! How can I help?", sender: "bot" }])
        }
      >
        Reset Chat
      </button>
    </div>
  );
};

export default Chatbot;
