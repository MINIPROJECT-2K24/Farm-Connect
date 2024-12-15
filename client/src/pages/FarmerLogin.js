import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FarmerLogin = ({ setIsLoggedIn }) => {
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

      const { token, user } = response.data;

      // Store token and user details in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("phoneNo", user.phoneNumber);
      localStorage.setItem("role", user.userType);

      // Set isLoggedIn state to true
      setIsLoggedIn(true);

      // Navigate to crop search page
      navigate("/crop-search");
    } catch (error) {
      setError("Login failed! Please check your credentials.");
      console.error("Login error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Farmer Login</h2>
        
        <div className="mb-4">
          <input
            type="text"
            name="identifier"
            placeholder="Phone Number"
            value={formData.identifier}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200 ${loading && 'opacity-50 cursor-not-allowed'}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default FarmerLogin;
