import dotenv from "dotenv";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

dotenv.config();

const LOCATIONIQ_API_KEY = "pk.a3bd8ec1188a599c1b6a32248b5d0edd";

const getCoordinates = async (city, state, district, postalCode) => {
  const address = `${district ? district + ", " : ""}${city}, ${state}, ${postalCode}, India`;
  const url = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(address)}&format=json`;

  try {
    const response = await axios.get(url);
    const results = response.data;

    if (results.length > 0) {
      const { lat, lon } = results[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      throw new Error("No results found for the given address.");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    throw error;
  }
};

export const registerUser = async (req, res) => {
  const { fullName, email, phoneNumber, password, userType, address } = req.body;

  if (!fullName || !phoneNumber || !password || !userType || !address || !address.city || !address.state || !address.district || !address.postalCode) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    if (userType === "farmer") {
      const existingFarmer = await User.findOne({ phoneNumber });
      if (existingFarmer) {
        return res.status(400).json({
          message: "Farmer with this phone number already exists.",
          existingFarmer,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const coordinates = await getCoordinates(address.city, address.state, address.district, address.postalCode);

      const user = new User({
        fullName,
        phoneNumber,
        password: hashedPassword,
        userType,
        address,
        location: {
          type: "Point",
          coordinates: [coordinates.longitude, coordinates.latitude],
        },
      });

      await user.save();
      return res.status(201).json({ message: "Farmer registered successfully!", user });
    } else if (userType === "buyer") {
      if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            message: "Buyer with this email already exists.",
            existingUser,
          });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const coordinates = await getCoordinates(address.city, address.state, address.district, address.postalCode || "");

      const newUser = new User({
        fullName,
        email: email ? email.toLowerCase() : undefined,
        phoneNumber,
        password: hashedPassword,
        userType,
        address,
        location: {
          type: "Point",
          coordinates: [coordinates.longitude, coordinates.latitude],
        },
      });

      await newUser.save();
      return res.status(201).json({ message: "Buyer registered successfully!", user: newUser });
    } else {
      return res.status(400).json({ message: "Invalid user type." });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, phoneNumber, password, userType } = req.body;

    if (userType === "farmer") {
      if (!phoneNumber || !password) {
        return res.status(400).json({ msg: "Please provide both phone number and password." });
      }

      const user = await User.findOne({ phoneNumber });
      if (!user) return res.status(400).json({ msg: "Invalid credentials." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

      const token = jwt.sign(
        { userId: user._id, userType: user.userType, location: user.address, Coordinates: user.location.coordinates, phoneNumber: user.phoneNumber, farmerName: user.fullName },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        msg: "Login successful from farmer!",
        user: { fullName: user.fullName, phoneNumber: user.phoneNumber, userType: user.userType, userId: user._id, location: user.location },
        token,
      });
    } else if (userType === "buyer") {
      if (!email || !password) {
        return res.status(400).json({ message: "Please provide both email and password." });
      }

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

      const token = jwt.sign(
        { userId: user._id, userType: user.userType, location: user.address, phoneNumber: user.phoneNumber, buyerName: user.fullName },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        message: "Login successful!",
        user: { fullName: user.fullName, email: user.email, userType: user.userType, userId: user._id, location: user.location },
        token,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
