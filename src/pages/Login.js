import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./Login.css";
import GoogleAuth from "./google_auth";
import BASE from "../apis";
import { toast } from "react-toastify";

const Login = () => {
  const [LogIn, setSignIn] = useState(true);
  const [name, setName] = useState("");
  const [password,setPassword] = useState("");
  const [email, setEmail] = useState("");

  function Login(){
    fetch(BASE+"/self-auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email:email, password:password}),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Invalid usernmae/password")
      }
      return response.json();
    })
    .then((data) => {
      toast.success("Login successful");
      localStorage.setItem("User", data.user);
      localStorage.setItem("isLoggedIn", true);
      setTimeout(() => window.location.href = "/", 2000);
    }).catch((e) => toast.error("Wrong username/Password"))
  }

  function signup(){
    fetch(BASE+"/self-auth/signup", {                                  
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({name:name, email:email, password:password}),
    })
.then(response => {
  if (!response.ok) {
    throw new Error("Signup failed");
  }
  return response.json();
})
    .then((data) => {
      toast.success("Signed in")
      localStorage.setItem("User", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", true);
      setTimeout(() => window.location.href = "/", 2000);
    }).catch(() => toast.error("Error Logging in"))
  }


  return (
    <div className="login-container">
      <Navbar />
      <div className="login-content">
        <h1>Login</h1>
        <p>Access your MindEase account to continue.</p>
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          {LogIn?<></>:<input onChange={(e)=> setName(e.target.value)} type="text" placeholder="Name" required />}
          <input onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="Email" required />
          <input onChange={(e)=> setPassword(e.target.value)} type="password" placeholder="Password" required />
          {LogIn
          ?<button onClick={Login} type="submit">Login</button>
          :<button onClick={signup} type="submit">Sign up</button>}
        </form>
        <div className="signup-link">
          {LogIn
          ?<p>Don't have an account? <a onClick={() => setSignIn(!LogIn)}>Sign Up</a></p>
          :<p>Have an account? <a onClick={() => setSignIn(!LogIn)}>Sign in</a></p>}
        </div>
      </div>
      <GoogleAuth />
    </div>
  );
};

export default Login;
