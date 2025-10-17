import Movie from "../model/Movie.js";

// Helper: sinh movieId mới theo dạng Mxxx
const generateMovieId = async () => {
  const lastMovie = await Movie.findOne({})
    .sort({ createdAt: -1 })
    .select("movieId")
    .lean();
  if (!lastMovie) return "M001";

  const lastId = lastMovie.movieId; // ví dụ "M009"
  const num = parseInt(lastId.replace("M", ""), 10) + 1;
  return "M" + String(num).padStart(3, "0");
};

// GET /api/movies
export const listMovies = async (_req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    return res.json({ movies });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

// GET /api/movies/:movieId
export const getMovieDetail = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findOne({ movieId });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    return res.json({ movie });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

// POST /api/movies
export const createMovie = async (req, res) => {
  try {
    const body = req.body || {};

    // Lấy poster/trailer từ file upload nếu có
    if (req.files?.poster?.[0]) body.poster = req.files.poster[0].path;
    if (req.files?.trailer?.[0]) body.trailer = req.files.trailer[0].path;

    if (
      !body.title ||
      !body.description ||
      !body.duration ||
      !body.releaseDate ||
      !body.poster ||
      !body.trailer
    ) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    // Validate releaseDate
    const releaseDate = new Date(body.releaseDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (
      !(releaseDate instanceof Date) ||
      isNaN(releaseDate) ||
      releaseDate <= today
    ) {
      return res.status(400).json({ message: "Ngày chiếu phải sau hôm nay" });
    }

    // Validate rating
    const allowedRatings = ["C13", "C16", "C18"];
    const rating = allowedRatings.includes(body.rating) ? body.rating : "C13";

    // Tạo movieId tự động
    const movieId = await generateMovieId();

    const payload = {
      movieId,
      title: String(body.title).trim(),
      description: String(body.description).trim(),
      duration: Number(body.duration),
      releaseDate,
      language: body.language || "Tiếng Anh - Phụ đề Việt",
      rating,
      genre:
        typeof body.genre === "string"
          ? body.genre
              .split(",")
              .map((g) => g.trim())
              .filter(Boolean)
          : Array.isArray(body.genre)
          ? body.genre
          : [],
      poster: body.poster,
      trailer: body.trailer,
      director: body.director || "",
      cast:
        typeof body.cast === "string"
          ? body.cast
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : Array.isArray(body.cast)
          ? body.cast
          : [],
      imdbRating: body.imdbRating ? Number(body.imdbRating) : 0,
      isHot: Boolean(body.isHot),
      status: body.status === "coming_soon" ? "coming_soon" : "showing",
    };

    const movie = await Movie.create(payload);
    return res.status(201).json({ message: "Tạo phim thành công", movie });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

// PUT /api/movies/:movieId
export const updateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findOne({ movieId });
    if (!movie) return res.status(404).json({ message: "Không tìm thấy phim" });

    // Lấy file upload mới nếu có
    if (req.files?.poster?.[0]) movie.poster = req.files.poster[0].path;
    if (req.files?.trailer?.[0]) movie.trailer = req.files.trailer[0].path;

    movie.title = req.body.title || movie.title;
    movie.description = req.body.description || movie.description;
    movie.releaseDate = req.body.releaseDate || movie.releaseDate;
    movie.genre = req.body.genre || movie.genre;
    movie.rating = req.body.rating || movie.rating;
    movie.language = req.body.language || movie.language;
    movie.director = req.body.director || movie.director;
    movie.cast = req.body.cast || movie.cast;
    movie.imdbRating = req.body.imdbRating ?? movie.imdbRating;
    movie.isHot = req.body.isHot !== undefined ? Boolean(req.body.isHot) : movie.isHot;
    movie.status = req.body.status || movie.status;

    const updatedMovie = await movie.save();
    return res.json({
      message: "Cập nhật phim thành công",
      movie: updatedMovie,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

// DELETE /api/movies/:movieId
export const deleteMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findOneAndDelete({ movieId });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    return res.json({ message: "Xóa phim thành công" });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};