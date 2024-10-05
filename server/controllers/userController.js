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

  // Check for required fields
  if (
    !fullName ||
    !phoneNumber ||
    !password ||
    !userType ||
    !address ||
    !address.city ||
    !address.state ||
    !address.district ||
    !address.postalCode
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
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

      const coordinates = await getCoordinates(
        address.city,
        address.state,
        address.district,
        address.postalCode
      );

      const user = new User({
        fullName,
        phoneNumber,
        password: hashedPassword,
        userType,
        address,
        location: {
          type: "Point",
          coordinates: [coordinates.longitude, coordinates.latitude], // [lng, lat]
        },
      });

      await user.save();

      return res.status(201).json({
        message: "Farmer registered successfully!",
        user,
      });
    }

    // Buyer registration logic
    else if (userType === "buyer") {
      // Check for existing user only if email is provided
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

      const coordinates = await getCoordinates(
        address.city,
        address.state,
        address.district,
        address.postalCode || ""
      );

      const newUser = new User({
        fullName,
        email: email ? email.toLowerCase() : undefined, // Normalize email before saving, only if provided
        phoneNumber, // No uniqueness check for phoneNumber
        password: hashedPassword,
        userType,
        address,
        location: {
          type: "Point",
          coordinates: [coordinates.longitude, coordinates.latitude], // [lng, lat]
        },
      });

      await newUser.save();

      return res.status(201).json({
        message: "Buyer registered successfully!",
        user: newUser,
      });
    } else {
      return res.status(400).json({ message: "Invalid user type." });
    }
  } catch (error) {
    // if (error.code === 11000) {
    //   // Handle duplicate key error specifically for unique fields
    //   const field = Object.keys(error.keyValue)[0];
    //   return res.status(400).json({
    //     message: `A user with that ${field} already exists: ${error.keyValue[field]}.`,
    //   });
    // }
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

// export const registerUser = async (req, res) => {
//   const { fullName, email, phoneNumber, password, userType, address } =
//     req.body;

//   // Check for required fields
//   if (
//     !fullName ||
//     !phoneNumber ||
//     !password ||
//     !userType ||
//     !address ||
//     !address.city ||
//     !address.state
//   ) {
//     return res
//       .status(400)
//       .json({ message: "Please provide all required fields." });
//   }

//   try {
//     // Farmer registration logic
//     if (userType === "farmer") {
//       const existingFarmer = await User.findOne({ phoneNumber });

//       if (existingFarmer) {
//         return res.status(400).json({
//           message: "Farmer with this phone number already exists.",
//           existingFarmer,
//         });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const coordinates = await getCoordinates(
//         address.city,
//         address.state,
//         address.district,
//         address.postalCode
//       );

//       const user = new User({
//         fullName,
//         phoneNumber,
//         password: hashedPassword,
//         userType,
//         address,
//         location: {
//           type: "Point",
//           coordinates: [coordinates.longitude, coordinates.latitude], // [lng, lat]
//         },
//       });

//       await user.save();

//       return res.status(201).json({
//         message: "Farmer registered successfully!",
//         user,
//       });
//     }

//     // Buyer registration logic
//     else if (userType === "buyer") {
//       // Check for existing user only if email is provided
//       if (email) {
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//           return res.status(400).json({
//             message: "Buyer with this email already exists.",
//             existingUser,
//           });
//         }
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const coordinates = await getCoordinates(
//         address.city,
//         address.state,
//         address.district,
//         address.postalCode || ""
//       );

//       const newUser = new User({
//         fullName,
//         email: email ? email.toLowerCase() : undefined, // Normalize email before saving, only if provided
//         phoneNumber, // No uniqueness check for phoneNumber
//         password: hashedPassword,
//         userType,
//         address,
//         location: {
//           type: "Point",
//           coordinates: [coordinates.longitude, coordinates.latitude], // [lng, lat]
//         },
//       });

//       await newUser.save();

//       return res.status(201).json({
//         message: "Buyer registered successfully!",
//         user: newUser,
//       });
//     } else {
//       return res.status(400).json({ message: "Invalid user type." });
//     }
//   } catch (error) {
//     if (error.code === 11000) {
//       // Handle duplicate key error specifically for unique fields
//       const field = Object.keys(error.keyValue)[0];
//       return res.status(400).json({
//         message: `A user with that ${field} already exists: ${error.keyValue[field]}.`,
//       });
//     }
//     console.error("Registration error:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

export const loginUser = async (req, res) => {
  try {
    const { email, phoneNumber, password, userType } = req.body;

    if (userType === "farmer") {
      const { phoneNumber, password } = req.body;

      if (!phoneNumber || !password) {
        return res
          .status(400)
          .json({ msg: "Please provide both phone number and password." });
      }

      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials." });
      } else {
        const token = jwt.sign(
          {
            userId: user._id,
            userType: user.userType,
            location: user.address,
            Coordinates: user.location.coordinates,
            phoneNumber: user.phoneNumber,
            farmerName: user.fullName,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

        const decode = jwt.decode(token);
        console.log(decode);

        res.status(200).json({
          msg: "Login successfull from farmer!",
          user: {
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            userType: user.userType,
            userId: user._id,
          },
          token,
        });
      }
    }

    if (userType === "buyer") {
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Please provide both email and password." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          userType: user.userType,
          location: user.address,
          phoneNumber: user.phoneNumber,
          buyerName: user.fullName,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.status(200).json({
        message: "Login successful!",
        user: {
          fullName: user.fullName,
          email: user.email,
          userType: user.userType,
          userId: user._id,
        },
        token,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
