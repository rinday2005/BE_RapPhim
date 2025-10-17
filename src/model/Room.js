import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    capacity: { type: Number, default: 0 },
    type: { type: String, enum: ["2D", "3D", "IMAX"], default: "2D" },
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
    },
    // Layout thông tin ghế
    seatLayout: {
      rows: { type: Number, default: 8 },
      seatsPerRow: { type: Number, default: 8 },
      vipRows: { type: [Number], default: [6, 7, 8] }, // Các hàng VIP (từ 1)
      regularRows: { type: [Number], default: [1, 2, 3, 4, 5] }, // Các hàng thường
      aislePosition: { type: Number, default: 4 }, // Vị trí lối đi (sau cột thứ 4)
    },
    // Giá vé theo loại ghế
    pricing: {
      regular: { type: Number, default: 100000 },
      vip: { type: Number, default: 150000 },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;


