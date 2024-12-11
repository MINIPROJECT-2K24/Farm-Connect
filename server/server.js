import dotenv from "dotenv";  // Import dotenv first
dotenv.config();  // Then call config

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/Db.js";
import authRoutes from "./routes/authRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
const app = express();

const PORT = process.env.PORT || 5000;  // Default port to 5000 if not defined
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// MongoDB Connection
connectDB();
 
// Routes middleware
app.use("/api/users", authRoutes);
app.use("/api/crops", cropRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
