//D:\D-Luxury-Car-Showroom\Backend\src\config\database.ts
import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("MongoDB Databse connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}