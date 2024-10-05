import { useState } from "react";
import axios from "axios";

const FarmerRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
    city: "",
    state: "",
    district: "",
    postalCode: "", // Predefined as 'farmer'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      fullName,
      phoneNumber,
      password,
      city,
      state,
      district,
      postalCode,
    } = formData;

    // Registration payload
    const registrationData = {
      fullName,
      phoneNumber,
      password,
      userType: "farmer", // Ensure 'farmer' is passed
      address: {
        city,
        state,
        district,
        postalCode,
      },
    };

    console.log(registrationData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        registrationData
      );
      alert("Farmer registration successful!");
      console.log(response.data);
    } catch (error) {
      setError("Registration failed! Please check the details and try again.");
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="farmer-register-form">
      {/* Full Name Input */}
      <div className="form-group">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Phone Number Input */}
      <div className="form-group">
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>

      {/* Password Input */}
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

      {/* City Input */}
      <div className="form-group">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>

      {/* State Input */}
      <div className="form-group">
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
        />
      </div>

      {/* District Input */}
      <div className="form-group">
        <input
          type="text"
          name="district"
          placeholder="District"
          value={formData.district}
          onChange={handleChange}
        />
      </div>

      {/* Postal Code Input */}
      <div className="form-group">
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
        />
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default FarmerRegister;
