import { useState } from "react";
import axios from "axios";

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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // console.log(`Field changed: ${name} = ${value}`); // Log the changed field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, city, state, district, postalCode } =
      formData;
    const registrationData = {
      fullName,
      email,
      phoneNumber: formData.phoneNumber,
      password,
      userType: "buyer",
      address: {
        city,
        state,
        district,
        postalCode,
      },
    };

    console.log("Registration Data:", registrationData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        registrationData
      );
      alert("Buyer registration successful!");
      console.log("Response:", response.data); // Log the response data
    } catch (error) {
      // Log the error response if it exists
      if (error.response) {
        console.error("Error Response:", error.response.data); // Log the error response data
        alert(`Registration failed: ${error.response.data.message}`);
      } else {
        console.error("Error:", error.message); // Log the error message if no response is available
        alert("Registration failed! Please try again later.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="district"
        placeholder="District"
        onChange={handleChange}
      />
      <input
        type="text"
        name="postalCode"
        placeholder="Postal Code"
        onChange={handleChange}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default BuyerRegister;
