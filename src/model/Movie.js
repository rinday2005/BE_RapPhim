import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    movieId: { type: String, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true, min: 1 },
    releaseDate: { type: Date, required: true },
    language: { type: String, default: "Tiếng Anh - Phụ đề Việt" },
    rating: { type: String, default: "C13" },
    genre: { type: [String], default: [] },
    poster: { type: String, required: true },
    trailer: { type: String, required: true },
    director: { type: String, default: "" },
    cast: { type: [String], default: [] },
    imdbRating: { type: Number, default: 0 },
    isHot: { type: Boolean, default: false },
    isComingSoon: { type: Boolean, default: false },
    status: { type: String, enum: ["showing", "coming_soon"], default: "showing" },
  },
  { timestamps: true }
);

// Auto-generate movieId like M001 if not provided
MovieSchema.pre("save", async function (next) {
  if (this.movieId) return next();
  try {
    const Model = this.constructor;
    const count = await Model.countDocuments();
    this.movieId = `M${String(count + 1).padStart(3, "0")}`;
    next();
  } catch (e) {
    next(e);
  }
});

const Movie = mongoose.model("Movie", MovieSchema);
export default Movie;