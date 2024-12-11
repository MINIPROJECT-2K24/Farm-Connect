import React, { useState } from "react";
import axios from "axios";

const CropDetails = () => {
  const [cropName, setCropName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [photo, setPhoto] = useState(null); // For the photo upload
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message state

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]); // Get the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!cropName || !price || !quantity || !photo) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true); // Start loading state
    setError(""); // Reset error state

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      //localStorage.setItem("token")

      if (!token) {
        alert("Unauthorized. Please log in.");
        return;
      }

      // Create FormData object to send multipart/form-data
      const formData = new FormData();
      formData.append("cropName", cropName);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("photo", photo); // Append the photo file

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include the JWT token in the request headers
        },
      };

      // Send POST request to backend
      const response = await axios.post(
        "http://localhost:5000/api/crops/add",
        formData,
        config
      );

      console.log("Crop added:", response.data);
      alert("Crop added successfully!");

      // Reset form fields
      setCropName("");
      setPrice("");
      setQuantity("");
      setPhoto(null);
    } catch (error) {
      console.error("Error adding crop:", error);
      setError("Error adding crop. Please try again."); // Set a generic error message
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Handle Logout function
  // const handleLogout = () => {
  //   localStorage.removeItem("token"); // Remove the token from localStorage
  //   window.location.href = "/login-farmer"; // Redirect to login page after logout
  // };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Logout button */}
      {/* <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mb-4"
      >
        Logout
      </button> */}

      {/* Form for adding crop details */}
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Add Crop Details
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Crop Name:
          </label>
          <input
            type="text"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Price:
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Quantity:
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Photo:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          } transition duration-200`}
        >
          {loading ? "Adding Crop..." : "Add Crop"}
        </button>
      </form>

      {/* Error message display */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default CropDetails;
