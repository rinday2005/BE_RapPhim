import mongoose from "mongoose";
import Showtime from "../model/showtime.js";
import Movie from "../model/Movie.js";

// Kết nối database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/rapphim");
    console.log("✅ MongoDB connected for seeding");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Seed showtimes data
export const seedShowtimes = async () => {
  try {
    // Xóa tất cả showtimes cũ
    await Showtime.deleteMany({});
    console.log("🗑️ Cleared existing showtimes");

    // Lấy danh sách movies
    const movies = await Movie.find({});
    if (movies.length === 0) {
      console.log("❌ No movies found. Please seed movies first.");
      return;
    }

    console.log(`📽️ Found ${movies.length} movies`);

    // Dữ liệu showtimes mẫu
    const showtimesData = [];
    const today = new Date();
    
    // Tạo showtimes cho 7 ngày tới
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      movies.forEach((movie) => {
        // Tạo showtimes cho các hệ thống rạp khác nhau
        const systems = [
          { systemId: "CGV", clusterId: "CGV_A01", hallId: "A01_H1" },
          { systemId: "CGV", clusterId: "CGV_A02", hallId: "A02_H1" },
          { systemId: "BHD", clusterId: "BHD_B01", hallId: "B01_H1" },
          { systemId: "LOTTE", clusterId: "LOT_C01", hallId: "C01_H1" }
        ];

        systems.forEach((system) => {
          // Tạo 3-4 suất chiếu mỗi ngày cho mỗi rạp
          const timeSlots = [
            { start: "09:00", end: "11:30" },
            { start: "13:30", end: "16:00" },
            { start: "18:00", end: "20:30" },
            { start: "21:15", end: "23:45" }
          ];

          timeSlots.forEach((slot) => {
            const basePrice = Math.floor(Math.random() * 50000) + 80000; // 80k-130k
            const vipPrice = Math.round(basePrice * 1.4);
            
            showtimesData.push({
              movieId: movie.movieId,
              systemId: system.systemId,
              clusterId: system.clusterId,
              hallId: system.hallId,
              date: dateStr,
              startTime: slot.start,
              endTime: slot.end,
              price: basePrice,
              priceBySeatType: {
                regular: basePrice,
                vip: vipPrice
              },
              availableSeats: Math.floor(Math.random() * 80) + 20, // 20-100 seats
              totalSeats: 100,
              isActive: true
            });
          });
        });
      });
    }

    // Lưu vào database
    await Showtime.insertMany(showtimesData);
    console.log(`✅ Created ${showtimesData.length} showtimes`);

  } catch (error) {
    console.error("❌ Error seeding showtimes:", error);
  }
};

// Chạy seed nếu file được execute trực tiếp
if (import.meta.url === `file://${process.argv[1]}`) {
  const runSeed = async () => {
    await connectDB();
    await seedShowtimes();
    console.log("🎉 Showtimes seeding completed!");
    process.exit(0);
  };
  
  runSeed();
}
