import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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
      toast.success("Crop added successfully!");

      // Reset form fields
      setCropName("");
      setPrice("");
      setQuantity("");
      setPhoto(null);
    } catch (error) {
      toast.error("Error adding crop:")
      console.error("Error adding crop:", error);
      setError("Error adding crop. Please try again."); // Set a generic error message
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#1B1B1B] rounded-lg shadow-md mt-12 border-4 border-[#d1ff48]">
      {/* Form for adding crop details */}
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-[#eef8ce] mb-4">
          Add Crop Details
        </h2>

        <div className="mb-4">
          <label className="block text-[#eef8ce] font-semibold mb-1">
            Crop Name:
          </label>
          <input
            type="text"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            required
            className="w-full border-2 border-[#eef8ce] p-2 rounded-md focus:outline-none focus:ring focus:ring-[#d1ff48] text-[#eef8ce] bg-[#1B1B1B]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#eef8ce] font-semibold mb-1">
            Price:
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border-2 border-[#eef8ce] p-2 rounded-md focus:outline-none focus:ring focus:ring-[#d1ff48] text-[#eef8ce] bg-[#1B1B1B]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#eef8ce] font-semibold mb-1">
            Quantity:
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="w-full border-2 border-[#eef8ce] p-2 rounded-md focus:outline-none focus:ring focus:ring-[#d1ff48] text-[#eef8ce] bg-[#1B1B1B]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#eef8ce] font-semibold mb-1">
            Photo:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            required
            className="w-full border-2 border-[#eef8ce] p-2 rounded-md focus:outline-none focus:ring focus:ring-[#d1ff48] text-[#eef8ce] bg-[#1B1B1B]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading ? "bg-gray-500" : "bg-[#d1ff48] hover:bg-[#b8e228]"
          } transition duration-200`}
        >
          {loading ? "Adding Crop..." : "Add Crop"}
        </button>
      </form>

      {/* Error message display */}
      {error && <p className="text-[#d1ff48] mt-4">{error}</p>}
    </div>
  );
};

export default CropDetails;
