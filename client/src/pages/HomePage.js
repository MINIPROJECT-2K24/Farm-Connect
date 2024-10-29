import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CropSearch = () => {
  const [district, setDistrict] = useState('');
  const [cropName, setCropName] = useState('');
  const [farmers, setFarmers] = useState([]);
  
  const navigate = useNavigate();

  const districts = [
    'Bagalkot', 'Bangalore', 'Bangalore Rural', 'Belgaum', 'Bellary', 'Bidar',
    'Chamarajanagar', 'Chikkaballapur', 'Chikmagalur', 'Chitradurga', 'Dakshina Kannada',
    'Davangere', 'Dharwad', 'Gadag', 'Gulbarga', 'Hassan', 'Haveri', 'Kodagu',
    'Kolar', 'Koppal', 'Mandya', 'Mysore', 'Raichur', 'Ramanagara', 'Shimoga',
    'Tumkur', 'Udupi', 'Uttara Kannada', 'Yadgir'
  ];

  const mockFarmersData = [
    {
      district: 'Bangalore',
      cropImage: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Wheat",
      cropName: "Wheat",
      farmerName: "Farmer A",
      quantity: 150,
      price: 25,
      phoneNumber: '123-456-7890',
      location: 'Bangalore'
    },
    {
      district: 'Bangalore',
      cropImage: "https://via.placeholder.com/150/33FF57/FFFFFF?text=Rice",
      cropName: "Rice",
      farmerName: "Farmer B",
      quantity: 200,
      price: 30,
      phoneNumber: '987-654-3210',
      location: 'Bangalore'
    },
    {
      district: 'Mysore',
      cropImage: "https://via.placeholder.com/150/3357FF/FFFFFF?text=Maize",
      cropName: "Maize",
      farmerName: "Farmer C",
      quantity: 180,
      price: 20,
      phoneNumber: '456-789-1230',
      location: 'Mysore'
    },
    {
      district: 'Bangalore Rural',
      cropImage: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Wheat",
      cropName: "Wheat",
      farmerName: "Farmer D",
      quantity: 130,
      price: 22,
      phoneNumber: '321-654-9870',
      location: 'Bangalore Rural'
    },
    {
      district: 'Gulbarga',
      cropImage: "https://via.placeholder.com/150/3357FF/FFFFFF?text=Rice",
      cropName: "Rice",
      farmerName: "Farmer E",
      quantity: 160,
      price: 35,
      phoneNumber: '654-321-0987',
      location: 'Gulbarga'
    },
  ];

  useEffect(() => {
    setFarmers(mockFarmersData);
  }, []);

  const handleSearch = () => {
    let filteredFarmers = mockFarmersData;

    if (district && cropName) {
      filteredFarmers = mockFarmersData.filter((farmer) =>
        farmer.district.toLowerCase() === district.toLowerCase() &&
        farmer.cropName.toLowerCase() === cropName.toLowerCase()
      );
    } else if (district) {
      filteredFarmers = mockFarmersData.filter(
        (farmer) => farmer.district.toLowerCase() === district.toLowerCase()
      );
    } else if (cropName) {
      filteredFarmers = mockFarmersData.filter(
        (farmer) => farmer.cropName.toLowerCase() === cropName.toLowerCase()
      );
    }

    setFarmers(filteredFarmers);
  };

  const handleCardClick = (farmer) => {
    navigate(`/farmer-details`, { state: { farmer } });
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">Search for Crops in Karnataka</h2>

      <div className="flex flex-col md:flex-row md:items-center mb-6">
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 mb-4 md:mb-0 md:mr-4"
        >
          <option value="">--Select District--</option>
          {districts.map((district) => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>

        <input
          type="text"
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
          placeholder="Enter crop name"
          className="border border-gray-300 rounded-lg p-2 mb-4 md:mb-0 md:mr-4 flex-grow"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Search
        </button>
      </div>

      {farmers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {farmers.map((farmer, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleCardClick(farmer)}
            >
              <img src={farmer.cropImage} alt={farmer.cropName} className="w-full h-32 object-cover rounded-lg mb-2" />
              <h3 className="text-lg font-semibold">{farmer.cropName}</h3>
              <p className="text-gray-600">Farmer: {farmer.farmerName}</p>
              <p className="text-gray-600">Quantity: {farmer.quantity} kg</p>
              <p className="text-gray-600">Price: ₹{farmer.price}/kg</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">No farmers found for the selected search criteria.</p>
      )}
    </div>
  );
};

export default CropSearch;
