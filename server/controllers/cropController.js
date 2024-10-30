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

export { getAllcrops };
