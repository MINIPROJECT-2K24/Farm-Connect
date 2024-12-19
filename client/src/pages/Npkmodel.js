import React, { useState } from 'react';
import axios from 'axios';

const NpkModel = () => {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    district: '',
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
      const res = await axios.post('http://localhost:5000/api/process', formData);
      setResponse(res.data);
    } catch (error) {
      setResponse({ error: 'An error occurred while processing your request.' });
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h1>N-P-K Based Crop-Predictor</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>N:</label>
          <input
            type="number"
            name="N"
            value={formData.N}
            onChange={handleChange}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>P:</label>
          <input
            type="number"
            name="P"
            value={formData.P}
            onChange={handleChange}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>K:</label>
          <input
            type="number"
            name="K"
            value={formData.K}
            onChange={handleChange}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>District:</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            style={{ marginLeft: '10px' }}
          >
            <option value="" disabled>Select a district</option>
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default NpkModel;
