import React from "react";
import Navbar from "../components/Navbar";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <Navbar />
      <div className="login-content">
        <h1>Login</h1>
        <p>Access your MindEase account to continue.</p>
        <form className="login-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
