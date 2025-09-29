import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    capacity: { type: Number, default: 0 },
    type: { type: String, enum: ["2D", "3D", "IMAX"], default: "2D" },
    cinemaId: { type: mongoose.Schema.Types.ObjectId, ref: "Cinema", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;


