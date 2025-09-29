import Room from "../model/Room.js";

export const listRooms = async (req, res) => {
  const { cinemaId } = req.query;
  const q = cinemaId ? { cinemaId } : {};
  const rooms = await Room.find(q).sort({ createdAt: -1 });
  res.json({ rooms });
};

export const createRoom = async (req, res) => {
  const { name, capacity, type, cinemaId } = req.body;
  if (!name?.trim() || !cinemaId) {
    return res.status(400).json({ message: "Tên và cinemaId là bắt buộc" });
  }
  const doc = await Room.create({ name: name.trim(), capacity, type, cinemaId });
  res.status(201).json({ room: doc });
};

export const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { name, capacity, type, cinemaId, isActive } = req.body;
  const doc = await Room.findByIdAndUpdate(
    id,
    { name, capacity, type, cinemaId, isActive },
    { new: true }
  );
  if (!doc) return res.status(404).json({ message: "Không tìm thấy phòng" });
  res.json({ room: doc });
};

export const deleteRoom = async (req, res) => {
  const { id } = req.params;
  await Room.findByIdAndDelete(id);
  res.json({ message: "Đã xóa" });
};




