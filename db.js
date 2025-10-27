import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const getDataBase = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("Mongo URI not found in env");

  try {
    await mongoose.connect(uri); // simplified
    console.log("✅ Database connected!");
  } catch (error) {
    console.error("❌ Cannot connect to database:", error.message);
    throw error; // server knows DB failed
  }
};
