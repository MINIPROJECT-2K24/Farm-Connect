// CropDetails.js (Frontend Component)
import React, { useState } from "react";
import axios from "axios";

const CropDetails = () => {
  const [cropName, setCropName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [photo, setPhoto] = useState(null); // For the photo upload

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]); // Get the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      alert("Crop added successfully!");

    } catch (error) {
      console.error("Error adding crop:", error);
      alert("Error adding crop.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Crop Name:</label>
        <input
          type="text"
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div>
        <label>Photo:</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
      </div>
      <button type="submit">Add Crop</button>
    </form>
  );
};

export default CropDetails;
