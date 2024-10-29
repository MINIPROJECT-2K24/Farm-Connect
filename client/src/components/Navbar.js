import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role")); // Initialize role directly

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);  // Only update if not set
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar">
      {/* Right-side: Dashboard (for farmers) and Logout button */}
      <div className="navbar-right">
        {role === "farmer" && (
          <button
            onClick={() => navigate("/Dashboard")}
            className="dashboard-button"
          >
            Dashboard
          </button>
        )}
        <button
          onClick={handleLogout}
          className="navbar-button"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
