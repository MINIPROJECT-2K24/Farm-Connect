dotenv.config();
import dotenv from "dotenv";
import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.URI);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);

    throw error;
  }
};

export default connectDb;
