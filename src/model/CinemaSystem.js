import mongoose from "mongoose";

const cinemaSystemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CinemaSystem = mongoose.model("CinemaSystem", cinemaSystemSchema);
export default CinemaSystem;


