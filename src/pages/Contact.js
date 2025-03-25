import React from "react";
import Navbar from "../components/Navbar";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    query: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    // Form submission logic would go here
    alert("Thank you for your message. We will contact you soon.");
    setFormData({ name: "", email: "", query: "" });
  }

  function handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    setFormData(function (prev) {
      return Object.assign({}, prev, { [name]: value });
    });
  }

  return React.createElement(
    "div",
    { className: "contact-container" },
    React.createElement(Navbar, null),
    // Particle Elements for Background Animation
    React.createElement(
      "div",
      { className: "particles" },
      Array(10)
        .fill()
        .map(function (_, i) {
          return React.createElement("div", { key: i, className: "particle" });
        })
    ),
    React.createElement(
      "div",
      { className: "contact-content" },
      React.createElement("h1", null, "Contact Us"),
      React.createElement(
        "p",
        null,
        "Have questions? Reach out and we'll get back to you soon."
      ),

      React.createElement(
        "form",
        { className: "contact-form", onSubmit: handleSubmit },
        React.createElement("input", {
          type: "text",
          name: "name",
          placeholder: "Your Name",
          value: formData.name,
          onChange: handleChange,
          required: true,
        }),
        React.createElement("input", {
          type: "email",
          name: "email",
          placeholder: "Email Address",
          value: formData.email,
          onChange: handleChange,
          required: true,
        }),
        React.createElement("textarea", {
          name: "query",
          placeholder: "Your Query or Message",
          rows: "5",
          value: formData.query,
          onChange: handleChange,
          required: true,
        }),
        React.createElement("button", { type: "submit" }, "Send Message")
      ),
      React.createElement(
        "p",
        {
          className: "confirmation-message",
          style: { marginTop: "20px", fontStyle: "italic" },
        },
        "We'll review your message and contact you soon."
      )
    )
  );
}

export default Contact;
