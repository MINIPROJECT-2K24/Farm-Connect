import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

const FarmerDetails = () => {
  const { state } = useLocation();

  // Check if farmer data exists; if not, redirect to CropSearch or a fallback page
  if (!state || !state.farmer) {
    return <Navigate to="/crop-search" replace />;
  }

  const farmer = state.farmer;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">{farmer.cropName}</h2>
      <img 
        src={farmer.cropImage} 
        alt={farmer.cropName} 
        className="w-96 h-72 object-cover mb-4" // Adjusted width and height
      />
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <p className="text-xl font-semibold">Farmer Name: {farmer.farmerName}</p>
        <p className="text-xl">Location: {farmer.location}</p>
        <p className="text-xl">Phone: {farmer.phoneNumber}</p>
        <p className="text-xl">Quantity: {farmer.quantity} kg</p>
        <p className="text-xl">Price: ₹{farmer.price}/kg</p>
      </div>
    </div>
  );
};

export default FarmerDetails;
