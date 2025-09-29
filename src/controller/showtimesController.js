import { showtimeData } from "../data/showtimes.js";

export const listShowtimes = async (req, res) => {
  const { movieId, date, clusterId, hallId } = req.query;
  let list = showtimeData;
  if (movieId) list = list.filter((s) => String(s.movieId) === String(movieId));
  if (date) list = list.filter((s) => s.date === date);
  if (clusterId) list = list.filter((s) => s.clusterId === clusterId);
  if (hallId) list = list.filter((s) => s.hallId === hallId);

  const withSeatPricing = list.map((s) => ({
    ...s,
    priceBySeatType: {
      regular: s.price,
      vip: Math.round((s.price || 0) * 1.4),
    },
  }));
  res.json({ showtimes: withSeatPricing });
};


