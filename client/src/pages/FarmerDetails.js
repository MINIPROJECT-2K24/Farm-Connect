import React from "react";
import { useLocation } from "react-router-dom";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa"; // Import WhatsApp and Phone icons

const FarmerDetails = () => {
  const location = useLocation();
  const { farmer } = location.state || {};
  console.log(farmer);

  // Construct WhatsApp and Phone call links
  const whatsappLink = `https://wa.me/${farmer?.phone}`;
  const phoneLink = `tel:${farmer?.phone}`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="border border-gray-300 rounded-lg p-4 w-80">
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
            <p className="text-gray-600">Call: {farmer.phone}</p>
            <p className="text-gray-600">Quantity: {farmer.quantity} kg</p>
            <p className="text-gray-600">Price: ₹{farmer.price}/kg</p>
            <p className="text-gray-600">
              Location: {farmer.location.District}
            </p>

            {/* Icons for WhatsApp and Phone */}
            <div className="flex justify-around mt-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 text-2xl"
                title="Message on WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a
                href={phoneLink}
                className="text-blue-500 text-2xl"
                title="Call Farmer"
              >
                <FaPhoneAlt />
              </a>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No farmer details available.
          </p>
        )}
      </div>
    </div>
  );
};

export default FarmerDetails;
