import React, { useState } from 'react';
import axios from 'axios';

function Weather() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWeatherData(null);
    setError(null);

    const API_KEY = '5115a4cf329c1157828bac9cf305b091';
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;

    try {
      const geoResponse = await axios.get(geoUrl);
      const coordinates = geoResponse.data[0];

      if (coordinates) {
        const { lat, lon } = coordinates;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        const weatherResponse = await axios.get(forecastUrl);
        setWeatherData(weatherResponse.data.list);
      } else {
        setError('City not found');
      }
    } catch (error) {
      setError('Error fetching weather data');
    }
  };

  const groupByDay = (data) => {
    const grouped = {};
    data.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const day = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(forecast);
    });
    return grouped;
  };

  const formattedWeatherData = weatherData ? groupByDay(weatherData) : {};

  const getWeatherCondition = (weather) => {
    if (weather && weather[0]) {
      const condition = weather[0].main.toLowerCase();
      switch (condition) {
        case 'clear':
          return 'Sunny';
        case 'rain':
          return 'Rainy';
        case 'clouds':
          return 'Cloudy';
        default:
          return condition.charAt(0).toUpperCase() + condition.slice(1);
      }
    }
    return 'Unknown';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">5-Day Weather Forecast</h1>

      <form onSubmit={handleSubmit} className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleCityChange}
          className="p-3 w-1/3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="ml-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Get Weather
        </button>
      </form>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {weatherData && (
        <div className="space-y-8">
          {Object.keys(formattedWeatherData).map((day, index) => {
            return (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-gray-700 mb-4">{day}</h3>
                <table className="min-w-full table-auto bg-black text-white">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-white-600">Icon</th>
                      <th className="px-4 py-2 text-left text-white-600">Time</th>
                      <th className="px-4 py-2 text-left text-white-600">Temperature</th>
                      <th className="px-4 py-2 text-left text-white-600">Condition</th>
                      <th className="px-4 py-2 text-left text-white-600">Description</th>
                      <th className="px-4 py-2 text-left text-white-600">Wind Speed</th>
                      <th className="px-4 py-2 text-left text-white-600">Humidity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formattedWeatherData[day].sort((a, b) => a.dt - b.dt).map((forecast, idx) => {
                      const date = new Date(forecast.dt * 1000);
                      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
                      return (
                        <tr key={idx}>
                          <td className="px-4 py-2">
                            <img src={iconUrl} alt="weather icon" className="w-8 h-8" />
                          </td>
                          <td className="px-4 py-2">{time}</td>
                          <td className="px-4 py-2">{forecast.main.temp}°C</td>
                          <td className="px-4 py-2 capitalize">{getWeatherCondition(forecast.weather)}</td>
                          <td className="px-4 py-2">{forecast.weather[0].description}</td>
                          <td className="px-4 py-2">{forecast.wind.speed} m/s</td>
                          <td className="px-4 py-2">{forecast.main.humidity}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Weather;
