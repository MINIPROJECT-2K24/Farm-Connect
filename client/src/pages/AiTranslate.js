import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
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
            `**3. Fertilizer Requirements:** ${
              jsonData.fertilizerNeeded || "N/A"
            }`,
            `**4. Harvesting Procedure:** ${
              jsonData.harvestProcedure || "N/A"
            }`,
            `**5. Instruments Needed:** ${jsonData.instruments || "N/A"}`,
          ];

          setMessages((prev) => [
            ...prev,
            { type: "bot", text: "Here are the recommendations for your crop:" },
            { type: "steps", steps },
          ]);
        } catch (parseError) {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              text: "Sorry, the server returned an invalid response format.",
            },
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
    <div className="bg-[#041604]">
    <div className="flex flex-col lg:flex-row w-full max-w-screen-lg mx-auto bg-[#1B1B1B]  text-[#eef8ce] min-h-screen">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-[#1B1B1B] text-[#eef8ce]">
        <h2 className="text-2xl font-bold mb-4 text-[#d1ff48]">Crop Details Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="cropName" className="block text-[#eef8ce] font-medium mb-2">
              Crop Name:
            </label>
            <input
              type="text"
              id="cropName"
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-[#1B1B1B] text-[#eef8ce] focus:outline-none focus:ring-2 focus:ring-[#d1ff48]"
              placeholder="Enter crop name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="acreage" className="block text-[#eef8ce] font-medium mb-2">
              Acreage of Land (in acres):
            </label>
            <input
              type="number"
              id="acreage"
              name="acreage"
              value={formData.acreage}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-[#1B1B1B] text-[#eef8ce] focus:outline-none focus:ring-2 focus:ring-[#d1ff48]"
              placeholder="Enter acreage"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="soilType" className="block text-[#eef8ce] font-medium mb-2">
              Soil Type:
            </label>
            <select
              id="soilType"
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-[#1B1B1B] text-[#eef8ce] focus:outline-none focus:ring-2 focus:ring-[#d1ff48]"
              required
            >
              <option value="">Select soil type</option>
              <option value="loamy">Loamy</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="silty">Silty</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="season" className="block text-[#eef8ce] font-medium mb-2">
              Season:
            </label>
            <select
              id="season"
              name="season"
              value={formData.season}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-[#1B1B1B] text-[#eef8ce] focus:outline-none focus:ring-2 focus:ring-[#d1ff48]"
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
            className="w-full bg-[#d1ff48] text-[#1B1B1B] py-2 px-4 rounded hover:bg-[#eef8ce] focus:outline-none focus:ring-2 focus:ring-[#d1ff48] mt-4"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      {/* Right Side: AI Responses */}
      <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-[#1B1B1B] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-[#d1ff48]">AI Crop Advisor</h2>
        <div className="space-y-5">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                msg.type === "bot"
              
              }`}
            >
              {msg.type === "steps" ? (
                <StepsComponent steps={msg.steps} />
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          ))}
          {loading && (
            <div className="bg-[#2E2E2E] text-[#eef8ce] p-3 rounded-lg">
              Typing...
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};
