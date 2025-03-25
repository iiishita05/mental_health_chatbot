import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { toast } from "react-toastify";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  function Logout() {
    localStorage.clear();
    toast.success("Logged out");
    setTimeout(() => window.location.href = "/" , 2000);
  }

  return (
    <>
      {/* Navigation Button */}
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Sidebar Menu */}
      <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
          </li>
          <li>
            <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          </li>
          <li>
            <Link to="/faqs" onClick={() => setMenuOpen(false)}>FAQs</Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </li>
          <li>
            {localStorage.getItem("isLoggedIn")
            ?<><p>Logged in as :</p> <p>{JSON.parse(localStorage.getItem("User")).name}</p><p onClick={Logout}>Logout</p></> 
            : <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>}
          </li>
        </ul>
      </div>

      <div
        className={`overlay ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>
    </>
  );
};

export default Navbar;