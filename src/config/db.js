import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function initialize() {
  const options = {
    serverSelectionTimeoutMS: 300000,
    socketTimeoutMS: 300000,
  };

  try {
    await mongoose.connect(process.env.DB_URI, options);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.error("Could not connect to MongoDB...", error);
  }
}
