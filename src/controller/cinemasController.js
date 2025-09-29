import Cinema from "../model/Cinema.js";
import Room from "../model/Room.js";

export const listCinemas = async (req, res) => {
  const { systemId } = req.query;
  const q = systemId ? { systemId } : {};
  const cinemas = await Cinema.find(q).sort({ createdAt: -1 });
  res.json({ cinemas });
};

export const createCinema = async (req, res) => {
  const { name, address, phone, systemId } = req.body;
  if (!name?.trim() || !systemId) {
    return res.status(400).json({ message: "Tên và systemId là bắt buộc" });
  }
  const doc = await Cinema.create({ name: name.trim(), address, phone, systemId });
  res.status(201).json({ cinema: doc });
};

export const updateCinema = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, systemId, isActive } = req.body;
  const doc = await Cinema.findByIdAndUpdate(
    id,
    { name, address, phone, systemId, isActive },
    { new: true }
  );
  if (!doc) return res.status(404).json({ message: "Không tìm thấy cụm rạp" });
  res.json({ cinema: doc });
};

export const deleteCinema = async (req, res) => {
  const { id } = req.params;
  await Cinema.findByIdAndDelete(id);
  res.json({ message: "Đã xóa" });
};

export const cinemasWithRooms = async (_req, res) => {
  const cinemas = await Cinema.find({ isActive: true }).lean();
  const cinemaIds = cinemas.map((c) => c._id);
  const rooms = await Room.find({ cinemaId: { $in: cinemaIds }, isActive: true }).lean();
  const byCinema = rooms.reduce((acc, r) => {
    (acc[r.cinemaId] = acc[r.cinemaId] || []).push(r);
    return acc;
  }, {});
  const result = cinemas.map((c) => ({ ...c, rooms: byCinema[c._id] || [] }));
  res.json({ cinemas: result });
};


