import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComp from '../components/LeafletMap';
import axios from 'axios';
import { toast } from 'react-toastify';

const CropSearch = () => {
  const [district, setDistrict] = useState('');
  const [cropName, setCropName] = useState('');
  const [allFarmers, setAllFarmers] = useState([]); // Original unfiltered data
  const [farmers, setFarmers] = useState([]); // Filtered data for display

  const navigate = useNavigate();

  const districts = [
    'Bagalkot', 'Bangalore', 'Bangalore Rural', 'Belgaum', 'Bellary', 'Bidar',
    'Chamarajanagar', 'Chikkaballapur', 'Chikmagalur', 'Chitradurga', 'Dakshina Kannada',
    'Davangere', 'Dharwad', 'Gadag', 'Gulbarga', 'Hassan', 'Haveri', 'Kodagu',
    'Kolar', 'Koppal', 'Mandya', 'Mysore', 'Raichur', 'Ramanagara', 'Shimoga',
    'Tumkur', 'Udupi', 'Uttara Kannada', 'Yadgir'
  ];

  useEffect(() => {
    fetchFarmersData();
  }, []);

  const fetchFarmersData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/crops/getcrops');
      setAllFarmers(response.data.crops); // Assuming response structure is { crops: [...] }
      setFarmers(response.data.crops); // Initialize filtered data with all data
    } catch (error) {
      toast.error("Error fetching farmers data")
      console.error("Error fetching farmers data:", error);
    }
  };

  const handleSearch = () => {
    const searchDistrict = district?.trim().toLowerCase();
    const searchCropName = cropName?.trim().toLowerCase();

    const filteredFarmers = allFarmers.filter((farmer) => {
      const farmerDistrict = farmer.location.District?.trim().toLowerCase();
      const farmerCropName = farmer.cropName?.trim().toLowerCase();

      if (searchDistrict && searchCropName) {
        return farmerDistrict === searchDistrict && farmerCropName === searchCropName;
      }
      if (searchDistrict) {
        return farmerDistrict === searchDistrict;
      }
      if (searchCropName) {
        return farmerCropName === searchCropName;
      }
      return true;
    });

    setFarmers(filteredFarmers);
  };

  const userType = localStorage.getItem("role");

  const handleCardClick = (farmer) => {
    navigate(`/farmer-details`, { state: { farmer: { 
        name: farmer.farmerName,
        phone: farmer.phoneno,
        crop: farmer.cropName,
        quantity: farmer.quantity,
        price: farmer.price,
        photo: farmer.photo,
        location: farmer.location,
    }}});
  };
  

  return (
    <div className="p-8 bg-[#1B1B1B] min-h-screen mt-0">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#d1ff48]">Search for Crops in Karnataka</h2>

      <div className="flex flex-col md:flex-row md:items-center mb-6">
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 mb-4 md:mb-0 md:mr-4 text-[#eef8ce] bg-[#1B1B1B]"
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
          className="border border-gray-300 rounded-lg p-2 mb-4 md:mb-0 md:mr-4 flex-grow text-[#eef8ce] bg-[#1B1B1B]"
        />

        <button
          onClick={handleSearch}
          className="bg-[#d1ff48] text-[#1B1B1B] font-semibold py-2 px-4 rounded-lg hover:bg-[#eef8ce] hover:text-[#1B1B1B] transition duration-200"
        >
          Search
        </button>
      </div>

      {userType === 'buyer' && <MapComp />}
      {farmers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {farmers.map((farmer, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleCardClick(farmer)}
            >
              <img src={farmer.photo} alt={farmer.cropName} className="w-full h-32 object-cover rounded-lg mb-2" />
              <h3 className="text-lg font-semibold text-[#d1ff48]">{farmer.cropName}</h3>
              <p className="text-[#eef8ce]">Farmer: {farmer.farmerName}</p>
              <p className="text-[#eef8ce]">Quantity: {farmer.quantity} kg</p>
              <p className="text-[#eef8ce]">Price: ₹{farmer.price}/kg</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-[#eef8ce] mt-4">No farmers found for the selected search criteria.</p>
      )}
    </div>
  );
};

export default CropSearch;
