import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';

import axios from "axios";
export const AiCropAdvisor = () => {
  const [formData, setFormData] = useState({
    cropName: "",
    acreage: "",
    soilType: "",
    season: "",
  });

  const [messages, setMessages] = useState([
    { type: "bot", text: "Welcome! Enter your crop details to get started." },
  ]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setMessages((prev) => [
      ...prev,
      { type: "user", text: `Crop Details: ${JSON.stringify(formData)}` },
    ]);
  
    try {
      setLoading(true);
  
      const { data } = await axios.post(
        "http://localhost:5000/api/crops/ai-crop-advisor",
        formData
      );
      console.log("Backend Response:", data);
  
      if (data && data.response && data.response.text) {
        const cleanedResponse = data.response.text
          .replace(/```json/, "")
          .replace(/```/, "")
          .trim();
  
        try {
          const jsonData = JSON.parse(cleanedResponse);
  
          const steps = [
            `**1. Growing Methods:** ${jsonData.growingMethods || "N/A"}`,
            `**2. Water Requirements:** ${jsonData.waterNeeded || "N/A"}`,
            `**3. Fertilizer Requirements:** ${jsonData.fertilizerNeeded || "N/A"}`,
            `**4. Harvesting Procedure:** ${jsonData.harvestProcedure || "N/A"}`,
            `**5. Instruments Needed:** ${jsonData.instruments || "N/A"}`,
          ];
  
          setMessages((prev) => [
            ...prev,
            { type: "bot", text: "Here are the recommendations for your crop:" },
            { type: "steps", steps },
          ]);
  
          steps.forEach((step, i) => {
            setTimeout(() => {
              setMessages((prev) => [...prev, { type: "bot", text: step }]);
            }, (i + 1) * 1000); // 1-second delay per step
          });
        } catch (parseError) {
          setMessages((prev) => [
            ...prev,
            { type: "bot", text: "Sorry, the server returned an invalid response format." },
          ]);
          console.error("JSON Parse Error:", parseError);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "Sorry, no valid response received from the server." },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Sorry, there was an error processing your request. Please try again.",
        },
      ]);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  function StepsComponent({ steps }) {
    return (
      <div>
        {steps.map((step, index) => (
          <ReactMarkdown key={index}>{step}</ReactMarkdown>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-gray-100 mb-20">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 p-6 bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Crop Details Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="cropName"
              className="block text-gray-700 font-medium mb-2"
            >
              Crop Name:
            </label>
            <input
              type="text"
              id="cropName"
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter crop name"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="acreage"
              className="block text-gray-700 font-medium mb-2"
            >
              Acreage of Land (in acres):
            </label>
            <input
              type="number"
              id="acreage"
              name="acreage"
              value={formData.acreage}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter acreage"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="soilType"
              className="block text-gray-700 font-medium mb-2"
            >
              Soil Type:
            </label>
            <select
              id="soilType"
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select soil type</option>
              <option value="loamy">Loamy</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="silty">Silty</option>
            </select>
          </div>
          <div className="flex justify-between p-4">
            {/* Loamy Soil Image */}
            <div className="w-1/4 px-2 text-center">
              <img
                src="./images/loamy.jpeg"
                alt="Loamy Soil"
                className="w-full h-40 object-cover rounded-lg shadow-lg"
              />
              <p className="mt-2 font-medium text-gray-700">Loamy Soil</p>
            </div>

            {/* Clay Soil Image */}
            <div className="w-1/4 px-2 text-center">
              <img
                src="./images/clay.jpeg"
                alt="Clay Soil"
                className="w-full h-40 object-cover rounded-lg shadow-lg"
              />
              <p className="mt-2 font-medium text-gray-700">Clay Soil</p>
            </div>

            {/* Sandy Soil Image */}
            <div className="w-1/4 px-2 text-center">
              <img
                src="./images/sandy.jpeg"
                alt="Sandy Soil"
                className="w-full h-40 object-cover rounded-lg shadow-lg"
              />
              <p className="mt-2 font-medium text-gray-700">Sandy Soil</p>
            </div>

            {/* Silty Soil Image */}
            <div className="w-1/4 px-2 text-center">
              <img
                src="./images/silty.jpeg"
                alt="Silty Soil"
                className="w-full h-40 object-cover rounded-lg shadow-lg"
              />
              <p className="mt-2 font-medium text-gray-700">Silty Soil</p>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="season"
              className="block text-gray-700 font-medium mb-2"
            >
              Season:
            </label>
            <select
              id="season"
              name="season"
              value={formData.season}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select season</option>
              <option value="summer">Summer</option>
              <option value="winter">Winter</option>
              <option value="rainy">Rainy</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      {/* Right Side: AI Responses */}
      {/* Right Side: AI Responses */}
      <div className="w-full lg:w-1/2 p-6 bg-gray-50 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">AI Crop Advisor</h2>
      <div className="space-y-5">
      {messages.map((msg, index) => {
      if (msg.type === "steps") {
      return (
        <div
          key={index}
          className={`${
            msg.type==="bot"
              ? "bg-gray-200 text-grey-900"
              : "bg-grey-500 text-black"
          } p-3 rounded-lg max-w-2xl ${
            msg.type === "bot" ? "self-start" : "self-end"
          }`}
        >
         <StepsComponent  steps={msg.steps} />
        </div>
      );
    }
    })}
    {loading && (
      <div className="bg-gray-200 text-gray-900 p-3 rounded-lg max-w-lg self-start">
        Typing...
      </div>
    )}
  </div>
</div>
    </div>
  );
};
