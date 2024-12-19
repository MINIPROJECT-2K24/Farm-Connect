import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BuyerRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    city: "",
    state: "",
    district: "",
    postalCode: "",
    location: { latitude: null, longitude: null },
  });

  const navigate = useNavigate();

  // Function to fetch user location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
          toast.success("Location fetched successfully!");
        },
        (error) => {
          console.error("Error getting location", error);
          toast.error("Unable to retrieve your location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password, city, state, district, postalCode, location } = formData;

    // Ensure the location data is available
    if (!location.latitude || !location.longitude) {
      toast.error("Please fetch your location first.");
      return;
    }

    const registrationData = {
      fullName,
      email,
      phoneNumber: formData.phoneNumber,
      password,
      userType: "buyer",
      address: { city, state, district, postalCode },
      location: { latitude: location.latitude, longitude: location.longitude },
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        registrationData
      );
      toast.success("Buyer registration successful!");
      navigate("/login-buyer");
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
        toast.error(
          `Registration failed: ${error.response.data.message || "Unexpected error occurred"}`
        );
      } else {
        console.error("Error:", error.message);
        toast.error("Registration failed! Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-[#eef8ce] font-poppins flex items-center justify-center">
      <div className="w-full max-w-md mx-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="w-full p-8 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#d1ff48] mb-6">
            Buyer Registration
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full text-[#020101] px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-[#020101] px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              required
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full text-[#020101] px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full text-[#020101] px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 text-[#020101] py-2 border rounded-md focus:outline-none focus:ring-2"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 text-[#020101] py-2 border rounded-md focus:outline-none focus:ring-2"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="district"
                placeholder="District"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 text-[#020101] py-2 border rounded-md focus:outline-none focus:ring-2"
                required
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full px-4 text-[#020101] py-2 border rounded-md focus:outline-none focus:ring-2"
                required
              />
            </div>
            <button
              type="button"
              onClick={fetchLocation}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            >
              Fetch Location
            </button>
            <button
              type="submit"
              className="w-full bg-[#d1ff48] text-gray-900 py-2 rounded-md hover:bg-green-500"
            >
              Register
            </button>
            <p className="text-gray-300 text-sm text-center">
              Already have an account?{" "}
              <a
                href="/login-buyer"
                className="text-[#d1ff48] hover:underline"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyerRegister;
