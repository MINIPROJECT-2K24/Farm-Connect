// cropController.js
import { bucket } from "../config/firebase.js"; // Firebase bucket
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import { v4 as uuidv4 } from "uuid"; // UUID for unique file names
import path from "path"; // For handling file paths
import Crop from "../models/cropSchema.js"; // Ensure Crop model is correctly set up

// Function to upload file to Firebase Storage
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
    if (!token || !token.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }
    const tokenValue = token.split(" ")[1];
    const tokenData = jwt.verify(tokenValue, process.env.JWT_SECRET);

    // Validate crop data in req.body
    const { cropName, price, quantity } = req.body;
    if (!cropName || !price || !quantity) {
      return res.status(400).json({ message: "Invalid crop data" });
    }

    // Upload file to Firebase Storage
    let photoURL = null;
    if (req.file) {
      try {
        photoURL = await uploadFile(req.file); // Upload the file and get the URL
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }

    // Create new crop document in MongoDB
    const newCrop = new Crop({
      cropName,
      price: Number(price), // Ensure price is a number
      quantity: Number(quantity), // Ensure quantity is a number
      farmerName: tokenData.farmerName,
      phoneno: tokenData.phoneNumber,
      location: {
        City: tokenData.location.city,
        State: tokenData.location.state,
        District: tokenData.location.district,
        PostalCode: tokenData.location.postalCode,
      },
      geopoint: {
        type: "Point",
        coordinates: tokenData.Coordinates || [0, 0],
      },
      photo: photoURL, // Store Firebase Storage URL in MongoDB
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
    const { cropName } = req.params;

    const crops = await Crop.find({
      cropName: { $regex: new RegExp(cropName, "i") },
    });

    res.json({ crops });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getAllcrops };
