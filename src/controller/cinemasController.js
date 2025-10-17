// controller/cinemaController.js
import Cinema from "../model/Cinema.js";
import Room from "../model/Room.js";

import {
  getClustersBySystem,
  getTheatersByCluster,
  getActiveCinemaSystems,
  createCinemaSystem,
  createCinemaCluster,
  createTheater,
} from "../data/cinemas.js";

/* =======================
   API Cũ (MongoDB)
======================= */

// Danh sách cụm rạp trong DB
export const listCinemas = async (req, res) => {
  try {
    const { systemId } = req.query;
    const q = systemId ? { systemId } : {};
    const cinemas = await Cinema.find(q).sort({ createdAt: -1 });
    res.json({ cinemas });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Tạo cụm rạp trong DB
export const createCinema = async (req, res) => {
  try {
    const { name, address, phone, systemId } = req.body;
    if (!name?.trim() || !systemId) {
      return res.status(400).json({ message: "Tên và systemId là bắt buộc" });
    }
    const doc = await Cinema.create({
      name: name.trim(),
      address,
      phone,
      systemId,
    });
    res.status(201).json({ cinema: doc });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update cụm rạp trong DB
export const updateCinema = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, systemId, isActive } = req.body;
    const doc = await Cinema.findByIdAndUpdate(
      id,
      { name, address, phone, systemId, isActive },
      { new: true }
    );
    if (!doc)
      return res.status(404).json({ message: "Không tìm thấy cụm rạp" });
    res.json({ cinema: doc });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Xóa cụm rạp trong DB
export const deleteCinema = async (req, res) => {
  try {
    const { id } = req.params;
    await Cinema.findByIdAndDelete(id);
    res.json({ message: "Đã xóa" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Lấy cụm rạp kèm phòng chiếu trong DB
export const cinemasWithRooms = async (req, res) => {
  try {
    const cinemas = await Cinema.find({ isActive: true }).lean();
    const cinemaIds = cinemas.map((c) => c._id);
    const rooms = await Room.find({
      cinemaId: { $in: cinemaIds },
      isActive: true,
    }).lean();
    const byCinema = rooms.reduce((acc, r) => {
      (acc[r.cinemaId] = acc[r.cinemaId] || []).push(r);
      return acc;
    }, {});
    const result = cinemas.map((c) => ({ ...c, rooms: byCinema[c._id] || [] }));
    res.json({ cinemas: result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* =======================
   API Mới (cinemaSystemData - cinemaClusterData - theaterData)
======================= */

// Hệ thống rạp
export const listCinemaSystems = (req, res) => {
  const systems = getActiveCinemaSystems();
  res.json({ systems });
};

export const addCinemaSystem = (req, res) => {
  const { name, logo, address, website, phone, description } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ message: "Tên hệ thống rạp là bắt buộc" });
  }
  const newSystem = createCinemaSystem({
    name: name.trim(),
    logo,
    address,
    website,
    phone,
    description,
    isActive: true,
  });
  res.status(201).json({ system: newSystem });
};

// Cụm rạp
export const listClusters = (req, res) => {
  const { systemId } = req.query;
  if (!systemId) {
    return res.status(400).json({ message: "systemId là bắt buộc" });
  }
  const clusters = getClustersBySystem(systemId);
  res.json({ clusters });
};

export const addCluster = (req, res) => {
  const { name, address, phone, systemId, facilities, parking, foodCourt } =
    req.body;
  if (!name?.trim() || !systemId) {
    return res.status(400).json({ message: "Tên và systemId là bắt buộc" });
  }
  const newCluster = createCinemaCluster({
    name: name.trim(),
    address,
    phone,
    systemId,
    facilities,
    parking,
    foodCourt,
    isActive: true,
  });
  res.status(201).json({ cluster: newCluster });
};

// Phòng chiếu
export const listTheaters = (req, res) => {
  const { clusterId } = req.query;
  if (!clusterId) {
    return res.status(400).json({ message: "clusterId là bắt buộc" });
  }
  const theaters = getTheatersByCluster(clusterId);
  res.json({ theaters });
};

export const addTheater = (req, res) => {
  const { name, clusterId, capacity, screenType, soundSystem, seatLayout } =
    req.body;
  if (!name?.trim() || !clusterId) {
    return res.status(400).json({ message: "Tên và clusterId là bắt buộc" });
  }
  const newTheater = createTheater({
    name: name.trim(),
    clusterId,
    capacity,
    screenType,
    soundSystem,
    seatLayout,
    isActive: true,
  });
  res.status(201).json({ theater: newTheater });
};


