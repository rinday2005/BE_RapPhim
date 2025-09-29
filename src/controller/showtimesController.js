import { showtimeData } from "../data/showtimes.js";

export const listShowtimes = async (req, res) => {
  const { movieId, date, clusterId, hallId } = req.query;
  console.log('[Showtimes] LIST query:', { movieId, date, clusterId, hallId });
  let list = showtimeData;
  if (movieId) list = list.filter((s) => String(s.movieId) === String(movieId));
  if (date) list = list.filter((s) => s.date === date);
  if (clusterId) list = list.filter((s) => s.clusterId === clusterId);
  if (hallId) list = list.filter((s) => s.hallId === hallId);

  const withSeatPricing = list.map((s) => ({
    ...s,
    priceBySeatType: s.priceBySeatType || {
      regular: s.price,
      vip: Math.round((s.price || 0) * 1.4),
    },
  }));
  console.log('[Showtimes] LIST result count:', withSeatPricing.length);
  res.json({ showtimes: withSeatPricing });
};

// POST /api/showtimes
export const createShowtimes = async (req, res) => {
  try {
    const { movieId, showtimes } = req.body || {};
    console.log('[Showtimes] CREATE payload:', { movieId, count: Array.isArray(showtimes) ? showtimes.length : 0 });
    if (!movieId) return res.status(400).json({ message: "Thiếu movieId" });
    if (!Array.isArray(showtimes) || showtimes.length === 0) {
      return res.status(400).json({ message: "Thiếu danh sách showtimes" });
    }

    const created = showtimes.map((s) => {
      const nextId = `ST${String(showtimeData.length + 1).padStart(3, "0")}`;
      const regular = Number(s.priceRegular || s.price || 0);
      const vip = Number(s.priceVip || Math.round(regular * 1.4));
      const record = {
        showtimeId: nextId,
        movieId: String(movieId),
        hallId: String(s.hallId || ""),
        clusterId: String(s.clusterId || ""),
        startTime: String(s.startTime || ""),
        endTime: String(s.endTime || ""),
        price: regular,
        priceBySeatType: { regular, vip },
        date: String(s.date || ""),
        availableSeats: Number.isFinite(s.availableSeats) ? Number(s.availableSeats) : 100,
        totalSeats: Number.isFinite(s.totalSeats) ? Number(s.totalSeats) : 100,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      showtimeData.push(record);
      return record;
    });

    console.log('[Showtimes] CREATED records:', created.map(c => c.showtimeId));
    return res.status(201).json({ message: "Tạo lịch chiếu thành công", showtimes: created });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};




