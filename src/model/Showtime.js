// models/Showtime.js
import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  row: { type: String },
  number: { type: Number },
  type: { type: String, enum: ["regular", "vip"], default: "regular" },
  price: { type: Number, default: 0 },
  status: { type: String, enum: ["available", "sold"], default: "available" },
});

const ShowtimeSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true },
    systemId: { type: String, required: true },
    clusterId: { type: String, required: true },
    hallId: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String },
    price: { type: Number, required: true }, // Giá cơ bản (regular)
    priceBySeatType: {
      regular: { type: Number, default: 100000 },
      vip: { type: Number, default: 150000 },
    },
    date: { type: String, required: true },
    availableSeats: { type: Number, default: 100 },
    totalSeats: { type: Number, default: 100 },
    seats: { type: [SeatSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Showtime ||
  mongoose.model("Showtime", ShowtimeSchema);