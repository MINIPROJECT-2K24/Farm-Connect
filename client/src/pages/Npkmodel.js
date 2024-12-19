import React, { useState } from 'react';
import axios from 'axios';

const NpkModel = () => {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    District: '',
  });
  const [districts] = useState([
    'BAGALKOTE',
    'BENGALURU - URBAN',
    'BENGALURU - RURAL',
    'BELAGAVI',
    'BALLARI',
    'BIDAR',
    'VIJAYAPURA',
    'CHAMARAJANAGAR',
    'CHICKBALLAPUR',
    'CHIKMAGALUR',
    'CHITRADURGA',
    'DAKSHINA KANNADA',
    'DAVANAGERE',
    'DHARWAD',
    'GADAG',
    'KALBURGI',
    'HASSAN',
    'HAVERI',
    'KODAGU',
    'KOLAR',
    'KOPPAL',
    'MANDYA',
    'MYSURU',
    'RAICHUR',
    'RAMANAGARAM',
    'SHIVAMOGGA',
    'TUMAKURU',
    'UDUPI',
    'UTTARA KANNADA',
    'YADGIR',
  ]);
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/recommend', formData);
      console.log(res);
      
      setResponse(res.data);
    } catch (error) {
      setResponse({ error: 'An error occurred while processing your request.' });
    }
  };

  return (
    <div className="flex p-4 space-x-4">
      {/* Left Side: Form */}
      <div className="w-1/2 bg-gray-100 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">N-P-K Based Crop-Predictor</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">N:</label>
            <input
              type="number"
              name="N"
              value={formData.N}
              onChange={handleChange}
              required
              className="mt-2 p-2 w-full border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block">P:</label>
            <input
              type="number"
              name="P"
              value={formData.P}
              onChange={handleChange}
              required
              className="mt-2 p-2 w-full border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block">K:</label>
            <input
              type="number"
              name="K"
              value={formData.K}
              onChange={handleChange}
              required
              className="mt-2 p-2 w-full border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block">District:</label>
            <select
              name="District"
              value={formData.District}
              onChange={handleChange}
              required
              className="mt-2 p-2 w-full border border-gray-300 rounded"
            >
              <option value="" disabled>Select a district</option>
              {districts.map((District) => (
                <option key={District} value={District}>
                  {District}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mt-4"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right Side: Response */}
      <div className="w-1/2 bg-gray-50 p-6 rounded-lg shadow-lg">
        {response && (
          <>
            <h3 className="text-xl font-semibold mb-4">Recommended Crops:</h3>
            {response.crops && response.crops.length > 0 ? (
              <div>
                <h4 className="text-lg font-semibold">Crop with Highest Production:</h4>
                <p className="mb-4">{response.crops[0]}</p>

                <h4 className="text-lg font-semibold">Best Crops for Given NPK:</h4>
                <ul className="list-disc pl-5">
                  {response.crops.slice(1).map((crop, index) => (
                    <li key={index}>{crop}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No crops available for the given input.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NpkModel;