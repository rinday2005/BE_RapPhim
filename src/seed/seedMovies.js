import Movie from "../model/Movie.js";
import { moviesData } from "../data/movies.js";
import mongoose from "mongoose";

const normalizeSeed = (m) => ({
  ...m,
  releaseDate: new Date(m.releaseDate),
});

async function seedMovies() {
  try {
    const count = await Movie.countDocuments();
    if (count > 0) {
      console.log(`📽️ Movies already exist (${count} movies)`);
      return;
    }
    const docs = moviesData.map(normalizeSeed);
    await Movie.insertMany(docs);
    console.log(`✅ Created ${docs.length} movies`);
  } catch (error) {
    console.error("❌ Error seeding movies:", error);
  }
}

// Chạy seed nếu file được execute trực tiếp
if (import.meta.url === `file://${process.argv[1]}`) {
  
  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/rapphim");
      console.log("✅ MongoDB connected for seeding movies");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      process.exit(1);
    }
  };

  const runSeed = async () => {
    await connectDB();
    await seedMovies();
    console.log("🎉 Movies seeding completed!");
    process.exit(0);
  };

  runSeed();
}

export default seedMovies;
