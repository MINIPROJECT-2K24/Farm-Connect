import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FarmerLogin = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const loginData = {
      phoneNumber: formData.identifier,
      password: formData.password,
      userType: "farmer",
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        loginData
      );

      // Assuming the token is returned in response.data.token
      const { token, farmerName, location, phoneNumber, latitude, longitude } = response.data;

      // Store JWT token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem('farmerData', JSON.stringify({
        farmerName,
        phoneNumber,
        location: {
          latitude,
          longitude,
        },
      }));

      // Redirect to Add Crop page
      navigate('/add-crop');
    } catch (error) {
      setError("Login failed! Please check your credentials.");
      console.error("Login error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="farmer-login-form">
      <div className="form-group">
        <input
          type="text"
          name="identifier"
          placeholder="Phone Number"
          value={formData.identifier}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default FarmerLogin;
