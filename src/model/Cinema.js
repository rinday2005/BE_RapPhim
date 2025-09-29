import mongoose from "mongoose";

const cinemaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    systemId: { type: mongoose.Schema.Types.ObjectId, ref: "CinemaSystem", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Cinema = mongoose.model("Cinema", cinemaSchema);
export default Cinema;


