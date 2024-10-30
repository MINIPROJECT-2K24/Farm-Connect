import React from 'react';
import { useLocation } from 'react-router-dom';

const FarmerDetails = () => {
    const location = useLocation();
    const { farmer } = location.state || {}; // Using optional chaining to avoid errors if state is undefined

    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="border border-gray-300 rounded-lg p-4 w-80"> {/* Adjusted width for a medium card */}
                <h2 className="text-2xl font-bold text-center mb-4">Farmer Details</h2>
                {farmer ? (
                    <>
                        <div className="flex justify-center mb-4">
                            <img 
                                src={farmer.photo} 
                                alt={farmer.crop} 
                                className="w-64 h-64 object-cover rounded-lg" // Increased image size
                            />
                        </div>
                        <h3 className="text-lg font-semibold">Crop: {farmer.crop}</h3>
                        <p className="text-gray-600">Farmer: {farmer.name}</p>
                        {/* <p className="text-gray-600">call: {farmer.phoneno}</p> */}
                        <p className="text-gray-600">Quantity: {farmer.quantity} kg</p>
                        <p className="text-gray-600">Price: ₹{farmer.price}/kg</p>
                        <p className="text-gray-600">Location: {farmer.location.District}</p>
                    </>
                ) : (
                    <p className="text-center text-gray-500 mt-4">No farmer details available.</p>
                )}
            </div>
        </div>
    );
};

export default FarmerDetails;
