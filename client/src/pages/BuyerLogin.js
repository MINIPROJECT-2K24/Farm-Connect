import { useState } from "react";
import axios from "axios";

const BuyerLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email, // Pass the email directly
          password,
          userType: "buyer", // Specify userType as "buyer"
        }
      );
      alert("Login successful!");
      console.log(response.data); // Handle successful login (e.g., redirect, save token)
    } catch (error) {
      console.error("Login error:", error);
      alert(
        "Login failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email" // Use email type for validation
        name="email"
        placeholder="Email"
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
      <button type="submit">Login</button>
    </form>
  );
};

export default BuyerLogin;
