import mongoose from "mongoose";
import seedMovies from "./src/seed/seedMovies.js";
import { seedShowtimes } from "./src/seed/seedShowtimes.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/rapphim");
    console.log("✅ MongoDB connected for seeding");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const runSeeds = async () => {
  await connectDB();
  
  console.log("🌱 Starting database seeding...");
  
  // Seed movies first
  await seedMovies();
  
  // Then seed showtimes
  await seedShowtimes();
  
  console.log("🎉 All seeding completed!");
  process.exit(0);
};

runSeeds();



