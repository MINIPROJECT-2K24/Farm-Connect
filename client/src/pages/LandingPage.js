import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import imge from "../images/image3.png"; // Example placeholder image

const LandingPage = () => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

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
                  className="hover:text-[#d1ff48]"
                  onClick={() => {
                    setShowAbout(!showAbout);
                    setShowContact(false); // Close Contact Us when About is opened
                  }}
                >
                  About
                </button>
              </li>
              <li>
                <button
                  className="hover:text-[#d1ff48]"
                  onClick={() => {
                    setShowContact(!showContact);
                    setShowAbout(false); // Close About when Contact Us is opened
                  }}
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-20">
        <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          {/* Image Section */}
          <div className="md:w-1/2 w-full bg-gray-900 flex items-center justify-center">
            <img
              src={imge}
              alt="Welcome Illustration"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Options Section */}
          <div className="md:w-1/2 w-full p-8 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-[#d1ff48] mb-6">
              Welcome to Farm Connect
            </h1>
            <p className="text-gray-300 text-center mb-8">
              Join the platform that bridges the gap between farmers and buyers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/register-farmer")}
                className="bg-indigo-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-600 transition"
              >
                Register as Farmer
              </button>
              <button
                onClick={() => navigate("/register-buyer")}
                className="bg-indigo-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-600 transition"
              >
                Register as Buyer
              </button>
              <button
                onClick={() => navigate("/login-farmer")}
                className="bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600 transition"
              >
                Login as Farmer
              </button>
              <button
                onClick={() => navigate("/login-buyer")}
                className="bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600 transition"
              >
                Login as Buyer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      {showAbout && (
        <div
          id="about"
          className="w-full max-w-5xl mx-auto bg-white shadow-md p-6 rounded-md mb-4 mt-8"
        >
          <h2 className="text-xl font-bold mb-4 text-green-800">
            About FarmConnect
          </h2>
          <p className="text-gray-700 leading-6">
            FarmConnect is a platform that bridges the gap between farmers and
            buyers. Our mission is to empower farmers by providing them with
            access to direct markets and fostering fair trade practices. Whether
            you're a buyer looking for fresh produce or a farmer wanting to
            expand your network, FarmConnect makes it easy to connect and
            thrive.
          </p>
        </div>
      )}

      {/* Contact Section */}
      {showContact && (
        <div
          id="contact"
          className="w-full max-w-5xl mx-auto bg-white shadow-md p-6 rounded-md mb-4 mt-8"
        >
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

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto bg-gray-50 p-4 mt-8 rounded-md shadow-md text-center">
        <p className="text-gray-600">
          © {new Date().getFullYear()} FarmConnect. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
