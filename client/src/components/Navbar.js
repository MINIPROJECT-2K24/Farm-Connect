import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./Navbar.css";

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("selectedLanguage") || "en"
  );

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNo");
    localStorage.removeItem("role");
    localStorage.removeItem("latitude");
    localStorage.removeItem("longitude");
    localStorage.removeItem("selectedLanguage");
    navigate("/");
  };

  const handleLanguageChange = (selectedOption) => {
    const selectedLanguage = selectedOption.value;
    setSelectedLanguage(selectedLanguage);
    localStorage.setItem("selectedLanguage", selectedLanguage);
    window.location.reload();
  };

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "kn", label: "Kannada" },
    { value: "hi", label: "Hindi" },
    { value: "te", label: "Telugu" },
    { value: "ta", label: "Tamil" },
    { value: "ml", label: "Malayalam" },
  ];

  return (
    <nav className="navbar">
      {/* Language Dropdown with react-select */}
      <div className="language-selector"></div>

      {/* Right-side: Dashboard (for farmers) and Logout button */}
      <div className="navbar-right">
        {role === "farmer" && (
          <button
            onClick={() => navigate("/dashboard")}
            className="dashboard-button"
          >
            Dashboard
          </button>
        )}
        <button onClick={handleLogout} className="navbar-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
