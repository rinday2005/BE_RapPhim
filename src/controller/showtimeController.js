import Showtime from "../model/showtime.js";

// GET /api/showtimes
export const listShowtimes = async (req, res) => {
  try {
    const { movieId, date, clusterId, hallId, systemId } = req.query;
    const filter = {};
    if (movieId) filter.movieId = movieId;
    if (date) filter.date = date;
    if (systemId) filter.systemId = systemId;
    if (clusterId) filter.clusterId = clusterId;
    if (hallId) filter.hallId = hallId;

    const showtimes = await Showtime.find(filter);
    res.json({ showtimes });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/showtimes/:showtimeId
export const getShowtimeById = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    // Tìm showtime bằng _id hoặc showtimeId (nếu có)
    const showtime = await Showtime.findById(showtimeId) || 
                     await Showtime.findOne({ showtimeId });
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    res.json(showtime);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/showtimes
// POST /api/showtimes
export const createShowtimes = async (req, res) => {
  try {
    const { movieId, showtimes } = req.body;
    if (!movieId || !Array.isArray(showtimes) || !showtimes.length) {
      return res.status(400).json({ message: "Thiếu movieId hoặc showtimes" });
    }

    const created = [];
    for (const s of showtimes) {
      // Lấy giá ưu tiên: priceBySeatType -> priceRegular -> price
      const regular = Number(
        s.priceBySeatType?.regular ?? s.priceRegular ?? s.price ?? 0
      );
      const vip = Number(
        s.priceBySeatType?.vip ?? s.priceVip ?? Math.round(regular * 1.4)
      );

      const newShowtime = new Showtime({
        movieId,
        systemId: String(s.systemId),
        clusterId: String(s.clusterId),
        hallId: String(s.hallId),
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        price: regular, // giá mặc định
        priceBySeatType: { regular, vip }, // giá theo loại ghế
        availableSeats: s.availableSeats || 100,
        totalSeats: s.totalSeats || 100,
        isActive: true,
      });

      await newShowtime.save();
      created.push(newShowtime);
    }

    res
      .status(201)
      .json({ message: "Tạo lịch chiếu thành công", showtimes: created });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/showtimes/movie/:movieId
export const deleteShowtimesByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    if (!movieId) {
      return res.status(400).json({ message: "Thiếu movieId" });
    }

    const result = await Showtime.deleteMany({ movieId });
    res.json({ 
      message: "Xóa lịch chiếu thành công", 
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};