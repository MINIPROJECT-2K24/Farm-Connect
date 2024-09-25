dotenv.config();
import dotenv from "dotenv";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

const API_KEY = process.env.API_KEY;

const getCoordinates = async (city, state, district, postalCode) => {
  const address = `${
    district ? district + ", " : ""
  }${city}, ${state}, ${postalCode}, India`;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    address
  )}&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const results = response.data.results;

    if (results.length > 0) {
      const { lat, lng } = results[0].geometry;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("No results found for the given address.");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    throw error;
  }
};

export const registerUser = async (req, res) => {
  const { fullName, email, phoneNumber, password, userType, address } =
    req.body;

  if (
    !fullName ||
    !email ||
    !phoneNumber ||
    !password ||
    !userType ||
    !address ||
    !address.city ||
    !address.state
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const coordinates = await getCoordinates(
      address.city,
      address.state,
      address.district,
      address.postalCode || ""
    );

    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      userType,
      address,
      location: {
        type: "Point",
        coordinates: [coordinates.longitude, coordinates.latitude], // [lng, lat]
      },
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful!",
      user: {
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
