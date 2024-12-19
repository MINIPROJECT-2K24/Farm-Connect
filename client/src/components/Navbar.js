import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

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

  return (
    <nav className="navbar">
      <div className="navbar-right">
        {role === "farmer" && (
          <>
          <button onClick={()=>navigate("/npk-model")}
           className="model-button"
           >
          N-P-k predictor
          </button>
          <button
          onClick={() => navigate("/cropanalyze")}
          className="ai-button"
          >
          CropAI  
          </button>
            <button onClick={handleWeatherForecast} className="navbar-button">
              Weather Forecast
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="dashboard-button"
            >
              Dashboard
            </button>
            
          </>
        )}
        <button onClick={handleLogout} className="navbar-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
