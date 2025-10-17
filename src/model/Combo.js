import mongoose from "mongoose";

const ComboSchema = new mongoose.Schema(
  {
    comboId: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number, default: 0 },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number, default: 0 },
      },
    ],
    category: {
      type: String,
      enum: ["basic", "family", "premium", "couple", "kids", "vip"],
      default: "basic",
    },
    isActive: { type: Boolean, default: true },
    stock: { type: Number, default: 100 },
  },
  { timestamps: true }
);

export default mongoose.models.Combo || mongoose.model("Combo", ComboSchema);