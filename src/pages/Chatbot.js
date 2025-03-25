import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Chatbot.css";
import BASE from "../apis";
import { toast } from "react-toastify";

const Chatbot = () => {
  const [userText, setuserText] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  let hoverTimeout;

  useEffect(()=>{
    fetch(BASE+"/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email:JSON.parse(localStorage.getItem("User")).email})
    })
      .then((res) => res.json())
      .then((data) => {        
        let message = JSON.parse(data.message);
        message = message["messages"];
        setMessages(message);
      })
      .catch((err) => console.error("Error:", err));
  },[])

  function get3(){
      if(messages.length < 3){
          return messages;
      }
      return messages.slice(messages.length - 3);
  }

  function sendMessage() {
    setMessages(prevMessages => [...prevMessages, { type: "user", msg: "You: " + userText }]);
    setTypingIndicator(true);

    fetch(BASE + "/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history: get3() })
    })
    .then(response => response.json())
    .then(data => {
        setMessages(prevMessages => [...prevMessages, { type: "bot", msg: "Bot: " + data.response }]);
        setTypingIndicator(false);
    })
    .catch(() => toast.error("Some error occurred"))
    .finally(() => {
        setTypingIndicator(false);
    });

    setuserText("");
}

  function handleKeyPress(event) {
    if (event.key === "Enter" && !typingIndicator) {
      sendMessage();
    }
  }

  function saveChat(){
    if(!localStorage.getItem("User")){      
      toast.error('Login To Save');
      return
    }
    const email = JSON.parse(localStorage.getItem("User")).email
    fetch(BASE+"/save-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email:email, messages:messages }),
    }).then((res) => res.json())
    .then((res) => toast.success("Messages Saved!"))
    .catch((e) => toast.error("Error occured while saving"));
  }

  function deleteChat(){
    if(!localStorage.getItem("User")){      
      toast.error('Login To Save');
      return
    }
    const email = JSON.parse(localStorage.getItem("User")).email
    fetch(BASE+"/delete-chat", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email:email }),
    }).then((res) => {
      toast.success("Messages Deleted!")
      setMessages([])
    })
    .catch(toast.error("Error occured while deleting"));
  }

  const confirmDelete = () => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this chat?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={() => {
              deleteChat();
              toast.dismiss(); 
            }}
            style={{ padding: "5px 10px", background: "red", color: "white", border: "none", cursor: "pointer" }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()} 
            style={{ padding: "5px 10px", background: "gray", color: "white", border: "none", cursor: "pointer" }}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const handleMouseEnter = () => {
    hoverTimeout = setTimeout(() => {
      setIsDeleteMode(true);
    }, 1500);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setIsDeleteMode(false);
  };

  const handleClick = () => {
    if (isDeleteMode) {
      confirmDelete();
    } else {
      saveChat();
    }
    setIsDeleteMode(false);
  };
    
  return (
    <div className="chatbot-container">
      <Navbar />
      <div className="chatbot-content">
        <h1>Chat with MindEase</h1>
        <p>Start a conversation with our AI-powered mental health companion.</p>
        <div className="chat-window">
          <p className="message bot">AI: Hello! How can I assist you today?</p>
          {messages.map(i => <p className={"message "+ i.type}>{i.msg}</p>)}
        {typingIndicator? <div id="typingIndicator">Bot is typing...</div> : <></>}
        </div>
        <div className="chat-input">
          <input value={userText} onChange={(a) => setuserText(a.target.value)} placeholder="Type a message..." onKeyDown={(e) => handleKeyPress(e)} />
          <div style={{ position: "relative", width: "150px" }}>
          {typingIndicator
          ? <button>Send</button> 
          : userText.length === 0
            ?<button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} className="chat-button" style={{ backgroundColor: isDeleteMode ? "red" : "#e91e63" }}>
                {isDeleteMode ? "Del" : "Save"} Chat
              </button>
            :<button onClick={sendMessage}>Send</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
