import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import imge from "../images/image.png"; // Correct image import
import toast from "react-hot-toast";

const FarmerLogin = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(""); // Tracks which extra section is active ("about" or "contact")

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
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("phoneNo", user.phoneNumber);
      localStorage.setItem("role", user.userType);

      toast.success("Login successful!");
      navigate("/crop-search"); // Navigate to the crop search page
    } catch (error) {
      setError("Login failed! Please check your credentials.");
      console.error("Login error:", error.response?.data || error.message);
      toast.error("Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection((prev) => (prev === section ? "" : section)); // Toggle the section
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-[#eef8ce] font-poppins">
      {/* Header */}
      <header className="fixed top-0 w-full backdrop-blur-md z-50 bg-[#1B1B1B11] border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-[#d1ff48]">Farm Connect</h1>
          <nav>
            <ul className="flex space-x-6 text-sm uppercase">
              <li>
                <button
                  onClick={() => handleSectionChange("about")}
                  className={`hover:text-[#d1ff48] ${
                    activeSection === "about" ? "text-[#d1ff48]" : ""
                  }`}
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionChange("contact")}
                  className={`hover:text-[#d1ff48] ${
                    activeSection === "contact" ? "text-[#d1ff48]" : ""
                  }`}
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Login Form Section */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-20">
        <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          {/* Image Section */}
          <div className="md:w-1/2 w-full bg-gray-900 flex items-center justify-center">
            <img
              src={imge}
              alt="Farmer Illustration"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Form Section */}
          <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#d1ff48] mb-6">
              Farmer Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#eef8ce] font-medium mb-2">
                  Phone Number:
                </label>
                <input
                  type="text"
                  name="identifier"
                  placeholder="Enter your phone number"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border text-[#020101] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[#eef8ce] font-medium mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border text-[#020101] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#d1ff48] text-gray-900 font-bold py-2 px-4 rounded-md transition duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Error message */}
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}

              {/* Register link */}
              <p className="text-gray-300 text-sm text-center">
                Don't have an account?{" "}
                <a href="/register-farmer" className="text-[#d1ff48] hover:underline">
                  Register
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="pt-8 px-4">
        {activeSection === "about" && (
          <div className="w-full max-w-5xl mx-auto bg-white shadow-md p-6 rounded-md mb-4">
            <h2 className="text-xl font-bold mb-4 text-green-800">About Us</h2>
            <p className="text-gray-700 leading-6">
              FarmConnect is a platform that bridges the gap between farmers and
              buyers. Our mission is to empower farmers by providing them with
              access to direct markets and fostering fair trade practices.
              Whether you're a buyer looking for fresh produce or a farmer
              wanting to expand your network, FarmConnect makes it easy to
              connect and thrive.
            </p>
          </div>
        )}

        {activeSection === "contact" && (
          <div className="w-full max-w-5xl mx-auto bg-white shadow-md p-6 rounded-md mb-4">
            <h2 className="text-xl font-bold mb-4 text-green-800">Contact Us</h2>
            <ul className="text-gray-700 leading-6 space-y-2">
              <li>
                <strong>Email:</strong> support@farmconnect.com
              </li>
              <li>
                <strong>Phone:</strong> +123 456 7890
              </li>
              <li>
                <strong>Address:</strong> 123 Greenfield Road, AgriCity, USA
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto bg-gray-50 p-4 mt-8 rounded-md shadow-md text-center">
        <p className="text-gray-600">
          © {new Date().getFullYear()} FarmConnect. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default FarmerLogin;
