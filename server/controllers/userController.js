import dotenv from "dotenv";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

// Register Function
export const registerUser = async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    password,
    userType,
    address,
    location,
  } = req.body;

  if (
    !fullName ||
    !phoneNumber ||
    !password ||
    !userType ||
    !address ||
    !address.city ||
    !address.state ||
    !address.district ||
    !address.postalCode ||
    !location
  ) {
    return res.status(400).json({
      message: "Please provide all required fields, including location.",
    });
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

      const user = new User({
        fullName,
        phoneNumber,
        password: hashedPassword,
        userType,
        address,
        location: {
          type: "Point",
          coordinates: [location.longitude, location.latitude],
        },
      });

      await user.save();
      return res
        .status(201)
        .json({ message: "Farmer registered successfully!", user });
    } else {
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

      const newUser = new User({
        fullName,
        email: email ? email.toLowerCase() : undefined,
        phoneNumber,
        password: hashedPassword,
        userType,
        address,
        location: {
          type: "Point",
          coordinates: [location.longitude, location.latitude],
        },
      });

      await newUser.save();
      return res
        .status(201)
        .json({ message: "Buyer registered successfully!", user: newUser });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

// Login Function
export const loginUser = async (req, res) => {
  const { phoneNumber, email, password, userType } = req.body;
  console.log(req.body);

  // Ensure at least one identifier (phone or email) is provided
  if (!phoneNumber && !email) {
    return res.status(400).json({
      message: "Please provide identifier (email/phone).",
    });
  }

  // Ensure password and userType are provided
  if (!password || !userType) {
    return res.status(400).json({
      message: "Please provide password, and userType.",
    });
  }

  try {
    let user;

    // Check if the userType is 'farmer' or 'buyer' and fetch user accordingly
    if (userType === "farmer") {
      if (!phoneNumber) {
        return res.status(400).json({
          message: "Please provide a phone number for farmer login.",
        });
      }
      user = await User.findOne({ phoneNumber });
    } else if (userType === "buyer") {
      if (!email) {
        return res.status(400).json({
          message: "Please provide an email for buyer login.",
        });
      }
      user = await User.findOne({ email });
    } else {
      return res.status(400).json({
        message: "Invalid userType provided.",
      });
    }

    // If user not found, return 404 error
    if (!user) {
      return res.status(404).json({
        message: `No ${userType} found with the provided identifier.`,
      });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        userType: user.userType,
        address: user.address,
        farmerName: user.fullName,
        phoneNumber: user.phoneNumber,
        location: user.location,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send the response with user details and token
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        userType: user.userType,
        phoneNumber: user.phoneNumber,
        email: user.email,
        address: user.address,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};
