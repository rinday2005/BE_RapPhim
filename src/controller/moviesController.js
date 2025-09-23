import Movie from "../model/Movie.js";

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

    // Accept either uploaded files or URLs
    const posterPath = req.files?.poster?.[0]?.path?.replace(/\\/g, "/");
    const trailerPath = req.files?.trailer?.[0]?.path?.replace(/\\/g, "/");

    const poster = posterPath ? `/${posterPath}` : body.poster;
    const trailer = trailerPath ? `/${trailerPath}` : body.trailer;

    if (!body.title || !body.description || !body.duration || !body.releaseDate || !poster || !trailer) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    // Validate release date > today
    const releaseDate = new Date(body.releaseDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!(releaseDate instanceof Date) || isNaN(releaseDate.getTime()) || releaseDate <= today) {
      return res.status(400).json({ message: "Ngày chiếu phải sau hôm nay" });
    }

    const payload = {
      title: String(body.title).trim(),
      description: String(body.description).trim(),
      duration: Number(body.duration),
      releaseDate,
      language: body.language || "Tiếng Anh - Phụ đề Việt",
      rating: body.rating || "C13",
      genre: Array.isArray(body.genre)
        ? body.genre
        : typeof body.genre === "string" && body.genre
        ? body.genre.split(",").map((g) => g.trim()).filter(Boolean)
        : [],
      poster,
      trailer,
      director: body.director || "",
      cast: Array.isArray(body.cast)
        ? body.cast
        : typeof body.cast === "string" && body.cast
        ? body.cast.split(",").map((c) => c.trim()).filter(Boolean)
        : [],
      imdbRating: body.imdbRating ? Number(body.imdbRating) : 0,
      isHot: Boolean(body.isHot),
      isComingSoon: Boolean(body.isComingSoon),
      status: body.status === "coming_soon" ? "coming_soon" : "showing",
    };

    const movie = await Movie.create(payload);
    return res.status(201).json({ message: "Tạo phim thành công", movie });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

// PUT /api/movies/:movieId
export const updateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const body = req.body || {};

    const updates = { ...body };

    if (body.releaseDate) {
      const releaseDate = new Date(body.releaseDate);
      if (isNaN(releaseDate.getTime())) {
        return res.status(400).json({ message: "Ngày chiếu không hợp lệ" });
      }
      updates.releaseDate = releaseDate;
    }

    if (typeof body.genre === "string") {
      updates.genre = body.genre.split(",").map((g) => g.trim()).filter(Boolean);
    }
    if (typeof body.cast === "string") {
      updates.cast = body.cast.split(",").map((c) => c.trim()).filter(Boolean);
    }

    const posterPath = req.files?.poster?.[0]?.path?.replace(/\\/g, "/");
    const trailerPath = req.files?.trailer?.[0]?.path?.replace(/\\/g, "/");
    if (posterPath) updates.poster = `/${posterPath}`;
    if (trailerPath) updates.trailer = `/${trailerPath}`;

    const movie = await Movie.findOneAndUpdate({ movieId }, updates, { new: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    return res.json({ message: "Cập nhật thành công", movie });
  } catch (e) {
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


