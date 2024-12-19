import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ role, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNo");
    localStorage.removeItem("role");
    localStorage.removeItem("latitude");
    localStorage.removeItem("longitude");
    localStorage.removeItem("selectedLanguage");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleWeatherForecast = () => {
    navigate("/weather");
  };

  const navbarStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1B1B1B",
    padding: "10px 20px",
    flexWrap: "wrap", // Allows items to wrap on smaller screens
  };

  const buttonContainerStyles = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    width: "100%",
  };

  const buttonStyles = {
    backgroundColor: "#1B1B1B",
    color: "#d1ff48",
    border: "2px solid #eef8ce",
    padding: "8px 15px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    textTransform: "uppercase",
    fontWeight: "bold",
    transition: "background-color 0.3s, color 0.3s",
    flex: "1 1 auto", // Ensures buttons adjust to available space
    maxWidth: "200px",
  };

  const hoverStyles = {
    backgroundColor: "#d1ff48",
    color: "#1B1B1B",
  };

  return (
    <nav style={navbarStyles}>
      <div style={buttonContainerStyles}>
        {role === "farmer" && (
          <>
            <button
              onClick={() => navigate("/npk-model")}
              style={buttonStyles}
              onMouseOver={(e) => Object.assign(e.target.style, hoverStyles)}
              onMouseOut={(e) => Object.assign(e.target.style, buttonStyles)}
            >
              N-P-K Predictor
            </button>
            <button
              onClick={() => navigate("/cropanalyze")}
              style={buttonStyles}
              onMouseOver={(e) => Object.assign(e.target.style, hoverStyles)}
              onMouseOut={(e) => Object.assign(e.target.style, buttonStyles)}
            >
              CropAI
            </button>
            <button
              onClick={handleWeatherForecast}
              style={buttonStyles}
              onMouseOver={(e) => Object.assign(e.target.style, hoverStyles)}
              onMouseOut={(e) => Object.assign(e.target.style, buttonStyles)}
            >
              Weather Forecast
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              style={buttonStyles}
              onMouseOver={(e) => Object.assign(e.target.style, hoverStyles)}
              onMouseOut={(e) => Object.assign(e.target.style, buttonStyles)}
            >
              Dashboard
            </button>
          </>
        )}
        <button
          onClick={handleLogout}
          style={buttonStyles}
          onMouseOver={(e) => Object.assign(e.target.style, hoverStyles)}
          onMouseOut={(e) => Object.assign(e.target.style, buttonStyles)}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
