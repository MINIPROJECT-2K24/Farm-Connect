import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FarmerRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
    city: "",
    state: "",
    district: "",
    postalCode: "",
  });

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false); // Loader for location
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getLocation = () => {
    setFetchingLocation(true); // Start location fetch
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setFetchingLocation(false);
          toast.success("Location fetched successfully!");
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setFetchingLocation(false);
          toast.error(
            "Unable to access your location. Please allow location access and try again."
          );
        }
      );
    } else {
      setFetchingLocation(false);
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { fullName, phoneNumber, password, city, state, district, postalCode } = formData;

    if (!location) {
      setError("Location is required. Please allow location access.");
      setLoading(false);
      return;
    }

    const registrationData = {
      fullName,
      phoneNumber,
      password,
      userType: "farmer",
      address: {
        city,
        state,
        district,
        postalCode,
      },
      location,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/users/register", registrationData);
      toast.success("Farmer registration successful!");
      console.log("Registration Response:", response.data);
    } catch (error) {
      setError(error.response?.data.message || "Registration failed! Please check the details and try again.");
      console.error("Registration error:", error.response?.data || error.message);
      toast.error(error.response?.data.message || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-[#eef8ce] font-poppins flex items-center justify-center">
      <div className="w-full max-w-md mx-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="w-full p-6 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#d1ff48] mb-6">
            Farmer Registration
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 text-[#020101] border rounded-md focus:outline-none focus:ring-2"
              required
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-[#020101] rounded-md focus:outline-none focus:ring-2"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-[#020101] rounded-md focus:outline-none focus:ring-2"
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
                className="w-full px-4 py-2 text-[#020101] border rounded-md focus:outline-none focus:ring-2"
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
                className="w-full px-4 py-2 text-[#020101] border rounded-md focus:outline-none focus:ring-2"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full px-4 py-2 text-[#020101] border rounded-md focus:outline-none focus:ring-2"
              />
            </div>
            <button
              type="button"
              onClick={getLocation}
              className="w-full bg-green-500 text-gray-900 py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              {fetchingLocation ? "Fetching Location..." : "Get Location"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#d1ff48] text-gray-900 py-2 rounded-md hover:bg-green-500 ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FarmerRegister;
