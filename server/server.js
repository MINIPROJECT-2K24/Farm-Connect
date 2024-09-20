dotenv.config();
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/Db.js";

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
connectDB();

// Sample route
app.get("/fetch", (req, res) => {
  res.send("Hello, FarmConnect API!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
