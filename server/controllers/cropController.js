// cropController.js
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { bucket } from "../config/firebase.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import Crop from "../models/cropSchema.js";
import axios from "axios";

const uploadFile = async (file) => {
  try {
    // Generate unique file name
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const fileUpload = bucket.file(`crops/${fileName}`);

    // Upload the file to Firebase Storage
    await fileUpload.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    //make public
    await fileUpload.makePublic();

    // Construct public URL to access the file
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/crops/${fileName}`;
    return fileUrl; // Return the URL to store in MongoDB
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Error uploading the file");
  }
};

// Function to add a new crop
export const addCrop = async (req, res) => {
  try {
    // Log request body and file
    console.log("Request Body:", req.body); // Add this log
    console.log("Uploaded File:", req.file); // Add this log

    // Verify JWT token
    const token = req.headers["authorization"];
    console.log(token);

    if (!token || !token.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }
    const tokenValue = token.split(" ")[1];
    const tokenData = jwt.verify(tokenValue, process.env.JWT_SECRET);
    console.log(tokenData);

    const { cropName, price, quantity } = req.body;
    if (!cropName || !price || !quantity) {
      return res.status(400).json({ message: "Invalid crop data" });
    }

    let photoURL = null;
    if (req.file) {
      try {
        photoURL = await uploadFile(req.file);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }
    const loc = tokenData.address;
    console.log(tokenData);

    const newCrop = new Crop({
      cropName,
      price: Number(price),
      quantity: Number(quantity),
      farmerName: tokenData.farmerName,
      phoneno: tokenData.phoneNumber,
      location: {
        City: loc.city,
        State: loc.state,
        District: loc.district,
        PostalCode: loc.postalCode,
      },
      geopoint: {
        type: "Point",
        coordinates: tokenData.Coordinates || [0, 0],
      },
      photo: photoURL,
    });

    // Save crop to MongoDB
    const savedCrop = await newCrop.save();
    console.log(savedCrop + "savedCrop");

    res.status(201).json({
      msg: "Crop added successfully",
      crop: savedCrop,
    });
  } catch (error) {
    console.error("Error adding crop:", error);
    res.status(500).json({ message: "Error adding crop" });
  }
};

const getAllcrops = async (req, res) => {
  try {
    const crops = await Crop.find({});

    res.json({ crops });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCrop = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const token = req.headers["authorization"];
    if (!token || !token.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }

    const tokenValue = token.split(" ")[1];
    const tokenData = jwt.verify(tokenValue, process.env.JWT_SECRET);

    const cropId = req.params.id;

    const { cropName, price, quantity } = req.body;
    if (!cropName || isNaN(price) || isNaN(quantity)) {
      return res.status(400).json({
        message:
          "Invalid crop data. Ensure cropName, price, and quantity are provided and valid.",
      });
    }

    let photoURL = null;

    if (req.file) {
      try {
        photoURL = await uploadFile(req.file);
      } catch (error) {
        console.error("File upload error:", error);
        return res
          .status(500)
          .json({ message: "Error uploading file to Firebase." });
      }
    }

    const updatedCrop = await Crop.findByIdAndUpdate(
      cropId,
      {
        cropName,
        price: Number(price),
        quantity: Number(quantity),
        farmerName: tokenData.farmerName,
        phoneno: tokenData.phoneNumber,
        location: {
          City: tokenData.location?.city || "Unknown City",
          State: tokenData.location?.state || "Unknown State",
          District: tokenData.location?.district || "Unknown District",
          PostalCode: tokenData.location?.postalCode || "000000",
        },
        geopoint: {
          type: "Point",
          coordinates: tokenData.Coordinates || [0, 0],
        },
        ...(photoURL && { photo: photoURL }),
      },
      { new: true }
    );

    if (!updatedCrop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    console.log("Updated Crop:", updatedCrop);

    res.status(200).json({
      message: "Crop updated successfully",
      crop: updatedCrop,
    });
  } catch (error) {
    console.error("Error updating crop:", error);
    res.status(500).json({
      message: "An unexpected error occurred while updating the crop.",
    });
  }
};

export const deleteCrop = async (req, res) => {
  try {
    const id = req.params.id;
    const crop = await Crop.findByIdAndDelete(id);
    if (!crop) {
      return res.status(404).send({ msg: "Crop not found" });
    }
    res.status(200).send({ msg: "Crop deleted successfully", crop });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

export const getCropbyUser = async (req, res) => {
  try {
    const phoneno = req.body;
    const crop = await Crop.find(phoneno);
    if (!crop) {
      return res.status(404).send({ msg: "Crop not found" });
    }
    res.status(200).send({ msg: "Crop fetched successfully", crop });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const cropanalyze = async (req, res) => {
  const { cropName, acreage, soilType, season } = req.body;
  console.log(req.body);

  if (!cropName || !acreage || !soilType || !season) {
    return res.status(400).json({
      error:
        "All fields (cropName, acreage, soilType, and season) are required.",
    });
  }

  try {
    // Construct the prompt asking for detailed recommendations
    const prompt = `
Provide comprehensive agricultural recommendations for the following crop, based on the provided details:

- **Crop Name**: ${cropName}
- **Acreage**: ${acreage}
- **Soil Type**: ${soilType}
- **Season**: ${season}

Please respond in a structured format with clear highligted high font size headings  and detailed explanations in normal font size , like the example below:

1. **Growing Methods**: 
   - Provide a detailed explanation of the best growing practices and techniques suitable for this crop in the given soil type and season.

2. **Water Requirements**: 
   - Specify the water needs for this crop, including the frequency and amount of irrigation required for the specific season and soil type.

3. **Fertilizer Recommendations**: 
   - Describe the types and quantities of fertilizers that are optimal for this crop’s growth in the selected soil and season.

4. **Harvesting Procedure**: 
   - Explain the harvesting process, including the timing, methods, and equipment required for the crop.

5. **Required Instruments and Tools**: 
   - List the tools and instruments needed for various stages of cultivation, including land preparation, irrigation, weeding, harvesting, and post-harvest handling.

Please provide the information in the following JSON structure:

{
  "growingMethods": "Detailed explanation about growing methods.",
  "waterNeeded": "Watering needs including frequency and amount.",
  "fertilizerNeeded": "Types and quantities of fertilizers.",
  "harvestProcedure": "Detailed harvesting procedure.",
  "instruments": "Tools and instruments needed."
}
`;

    // Start a chat session with the model
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send the prompt to Gemini
    const result = await chatSession.sendMessage(prompt);

    // Log the full candidates[0] for debugging
    console.log("Gemini API Candidates[0]:", result.response.candidates[0]);

    // Extract the full recommendations text from the response
    const parts = result?.response?.candidates?.[0]?.content?.parts;
    const recommendations =
      Array.isArray(parts) && parts[0] ? parts[0] : "No recommendations found.";

    // if (typeof recommendations !== "string") {
    //   console.error("Invalid recommendations format:", recommendations);
    //   return res.status(500).json({
    //     error:
    //       "Failed to fetch crop recommendations. Unexpected response format.",
    //   });
    // }

    // Log the entire recommendation text for debugging
    console.log("Full Recommendations:", recommendations);

    // Send the full text response to the frontend
    res.status(200).send({ response: recommendations });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to fetch crop recommendations." });
  }
};

export { getAllcrops };
