import CinemaSystem from "../model/CinemaSystem.js";

export const listSystems = async (_req, res) => {
  const systems = await CinemaSystem.find().sort({ createdAt: -1 });
  res.json({ systems });
};

export const createSystem = async (req, res) => {
  const { name, logo, address } = req.body;
  if (!name?.trim() || !logo?.trim()) {
    return res.status(400).json({ message: "Tên và logo là bắt buộc" });
  }
  const doc = await CinemaSystem.create({ name: name.trim(), logo: logo.trim(), address: address || "" });
  res.status(201).json({ system: doc });
};

export const updateSystem = async (req, res) => {
  const { id } = req.params;
  const { name, logo, address, isActive } = req.body;
  const doc = await CinemaSystem.findByIdAndUpdate(
    id,
    { name, logo, address, isActive },
    { new: true }
  );
  if (!doc) return res.status(404).json({ message: "Không tìm thấy hệ thống" });
  res.json({ system: doc });
};

export const deleteSystem = async (req, res) => {
  const { id } = req.params;
  await CinemaSystem.findByIdAndDelete(id);
  res.json({ message: "Đã xóa" });
};




