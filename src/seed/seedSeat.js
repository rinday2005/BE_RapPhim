import mongoose from "mongoose";
import Showtime from "../model/showtime.js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Hàm tạo ghế cho 1 phòng chiếu
const generateSeats = (rows = 8, seatsPerRow = 10) => {
  const seats = [];
  const rowLabels = "ABCDEFGHIJ".split("");

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const rowLabel = rowLabels[rowIndex];

    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      // ✅ Format số ghế với 2 chữ số (A01, A02, ..., A10)
      const seatNumber = `${rowLabel}${String(seatNum).padStart(2, "0")}`;

      // VIP rows (2 hàng cuối: G, H cho 8 hàng)
      const isVIP = rowIndex >= rows - 2;

      seats.push({
        seatNumber,
        type: isVIP ? "vip" : "regular",
        status: "available", // available, sold, locked
        price: null, // Sẽ lấy từ priceBySeatType
      });
    }
  }

  return seats;
};

// ✅ Main function
const seedSeats = async () => {
  try {
    // ✅ Kiểm tra MONGODB_URI
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI không được cấu hình trong .env");
    }

    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // ✅ Lấy tất cả showtime chưa có seats hoặc seats rỗng
    const showtimes = await Showtime.find({
      $or: [
        { seats: { $exists: false } },
        { seats: null },
        { seats: [] },
        { "seats.0": { $exists: false } }, // Array rỗng
      ],
    });

    if (showtimes.length === 0) {
      console.log("ℹ️  Không có showtime nào cần seed ghế");
      process.exit(0);
    }

    console.log(`📊 Found ${showtimes.length} showtimes without seats`);

    let successCount = 0;
    let failCount = 0;

    for (const showtime of showtimes) {
      try {
        // ✅ Tạo 80 ghế (8 hàng x 10 ghế)
        const seats = generateSeats(8, 10);

        showtime.seats = seats;
        showtime.availableSeats = seats.length;

        // ✅ Đặt giá theo loại ghế nếu chưa có
        if (
          !showtime.priceBySeatType ||
          Object.keys(showtime.priceBySeatType).length === 0
        ) {
          const basePrice = showtime.price || 80000;
          showtime.priceBySeatType = {
            regular: basePrice,
            vip: Math.round(basePrice * 1.5), // VIP = 150% giá thường
          };
        }

        // ✅ Validate trước khi save
        await showtime.validate();
        await showtime.save();

        successCount++;
        console.log(
          `✅ [${successCount}/${showtimes.length}] Added ${seats.length} seats to showtime ${showtime._id}`
        );
      } catch (error) {
        failCount++;
        console.error(
          `❌ Failed to seed showtime ${showtime._id}:`,
          error.message
        );
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`🎉 Seed completed!`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log("=".repeat(50));

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  } finally {
    // ✅ Đảm bảo đóng kết nối MongoDB
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("🔌 MongoDB connection closed");
    }
  }
};

// ✅ Handle unhandled rejections
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Rejection:", error);
  process.exit(1);
});

// ✅ Chạy seed
seedSeats();