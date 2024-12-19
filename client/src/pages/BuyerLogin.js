import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import imge from "../images/image2.png"; // Correct image import
import toast from "react-hot-toast"; // For displaying toast notifications

const BuyerLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [activeSection, setActiveSection] = useState(""); // To track the active section (about or contact)
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (login logic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
        userType: "buyer",
      });

      const latitude = response.data.user.location.coordinates[0];
      const longitude = response.data.user.location.coordinates[1];
      const location = response.data.user.address;
      const { token } = response.data;

      // Store user information in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("latitude", latitude);
      localStorage.setItem("longitude", longitude);
      localStorage.setItem("role", response.data.user.userType);

      // Success Toast and redirection
      toast.success("Login successful!");
      navigate("/crop-search"); // Redirect to crop search page after login
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        "Login failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  // Toggle active sections for About and Contact
  const handleSectionChange = (section) => {
    setActiveSection((prev) => (prev === section ? "" : section));
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
              alt="Buyer Illustration"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Form Section */}
          <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#d1ff48] mb-6">
              Buyer Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#eef8ce] font-medium mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 text-[#020101] py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#d1ff48] text-gray-900 font-bold py-2 px-4 rounded-md transition duration-300 hover:bg-green-500"
              >
                Login
              </button>
              <p className="text-gray-300 text-sm text-center">
                Don't have an account?{" "}
                <a href="/register-buyer" className="text-[#d1ff48] hover:underline">
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Additional Sections (About & Contact) */}
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

export default BuyerLogin;
