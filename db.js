import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const getDataBase = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("Mongo URI not found in .env");

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database connected!");
  } catch (error) {
    console.error("❌ Cannot connect to database:", error.message);
    throw error; // so server startup knows DB failed
  }
};
