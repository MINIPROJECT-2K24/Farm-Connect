import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BuyerLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

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
          email,
          password,
          userType: "buyer",
        }
      );
      console.log(response);
       const latitude = response.data.user.location.coordinates[0];
       const longitude = response.data.user.location.coordinates[1];
      const location=response.data.user.address
      const { token, buyerName, email: buyerEmail } = response.data;
      console.log(location);
      localStorage.setItem("token", token);

      // [77.1006208, 13.3400771]  farmer data
     
       localStorage.setItem("latitude", latitude);
      localStorage.setItem("longitude", longitude);
    //  localStorage.setItem(location);


      // localStorage.setItem('buyerData', JSON.stringify({
      //   buyerName,
      //   email: buyerEmail,
      //   location,
      // }));
      localStorage.setItem("role", response.data.user.userType);
      alert("Login successful!");

      navigate('/crop-search');
    } catch (error) {
      console.error("Login error:", error);
      alert(
        "Login failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Buyer Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default BuyerLogin;
