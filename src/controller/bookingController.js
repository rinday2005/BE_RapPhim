import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Showtime from "../model/showtime.js";
import Booking from "../model/Booking.js";
import Combo from "../model/Combo.js";

const seatLockStore = new Map();

// =====================
// 🔒 Mock Seat Lock
// =====================
export const lockSeats = async ({ showtimeId, seatIds, lockId, ttl = 600 }) => {
  const locked = [];
  for (const seatId of seatIds) {
    const key = `showtime:${showtimeId}:seat:${seatId}`;
    if (seatLockStore.has(key)) {
      for (const k of locked) seatLockStore.delete(k);
      return { success: false, message: "Some seats already locked" };
    }
    seatLockStore.set(key, lockId);
    locked.push(key);
    setTimeout(() => {
      if (seatLockStore.get(key) === lockId) seatLockStore.delete(key);
    }, ttl * 1000);
  }
  return { success: true, lockId, expiresIn: ttl };
};

export const releaseSeats = async ({ showtimeId, seatIds, lockId }) => {
  for (const seatId of seatIds) {
    const key = `showtime:${showtimeId}:seat:${seatId}`;
    if (seatLockStore.get(key) === lockId) seatLockStore.delete(key);
  }
};

export const isSeatLocked = async ({ showtimeId, seatId }) => {
  return seatLockStore.get(`showtime:${showtimeId}:seat:${seatId}`) || null;
};

// =====================
// 📍 GET SEATS
// =====================
export const getSeatsController = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    const showtime = await Showtime.findById(showtimeId).lean();
    if (!showtime)
      return res.status(404).json({ message: "Suất chiếu không tồn tại." });

    res.json({
      seats: showtime.seats || [],
      priceBySeatType: showtime.priceBySeatType || {
        regular: showtime.price,
        vip: Math.round(showtime.price * 1.4),
      },
    });
  } catch (error) {
    console.error("❌ getSeatsController error:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

// =====================
// 📍 LOCK SEATS
// =====================
export const lockSeatsController = async (req, res) => {
  try {
    const { showtimeId, seatIds } = req.body;
    if (!showtimeId || !Array.isArray(seatIds) || !seatIds.length)
      return res.status(400).json({ message: "Dữ liệu không hợp lệ." });

    const showtime = await Showtime.findById(showtimeId).lean();
    if (!showtime)
      return res.status(404).json({ message: "Suất chiếu không tồn tại." });

    for (const sId of seatIds) {
      const seat = showtime.seats.find((s) => s.seatNumber === sId);
      if (!seat)
        return res.status(400).json({ message: `Ghế ${sId} không tồn tại.` });
      if (seat.status === "sold")
        return res.status(409).json({ message: `Ghế ${sId} đã bán.` });
    }

    const lockId = uuidv4();
    const result = await lockSeats({ showtimeId, seatIds, lockId, ttl: 600 });
    if (!result.success)
      return res.status(409).json({ message: result.message });

    res.json({ message: "Khóa ghế thành công.", lockId });
  } catch (error) {
    console.error("❌ lockSeatsController error:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

// =====================
// 📍 RELEASE SEATS (mock)
// =====================
export const releaseSeatsController = async (req, res) => {
  try {
    const { showtimeId, seatIds, lockId } = req.body;

    if (!showtimeId || !Array.isArray(seatIds) || !seatIds.length || !lockId) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ." });
    }

    await releaseSeats({ showtimeId, seatIds, lockId });

    res.json({ message: "Đã mở khóa ghế (mock)." });
  } catch (error) {
    console.error("❌ releaseSeatsController error:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

// =====================
// 📍 CONFIRM BOOKING
// =====================
export const confirmBookingController = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const {
      showtimeId,
      seatIds,
      lockId,
      combos = [],
      paymentMethod = "momo",
    } = req.body;

    // 🧪 LOG: đầu vào
    console.log("[CONFIRM] headers.auth:", req.headers.authorization?.slice(0, 25) + "…");
    console.log("[CONFIRM] user decoded:", req.user);
    console.log("[CONFIRM] body:", { showtimeId, seatIds, lockId, combos, paymentMethod });

    const rawUserId = req.user?._id || req.user?.id;
if (!rawUserId) {
  return res.status(401).json({ message: "Unauthorized: missing user id" });
}

// ✅ Ép kiểu ObjectId để lưu đúng vào Mongo
const userId = new mongoose.Types.ObjectId(rawUserId);


    // Validate input
    if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0 || !lockId) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ (thiếu showtimeId/seatIds/lockId)." });
    }

    await session.startTransaction();
    console.log("[CONFIRM] transaction started");

    // Lấy showtime
    const showtime = await Showtime.findById(showtimeId).session(session);
    if (!showtime) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Suất chiếu không tồn tại." });
    }

    // Check khóa ghế (nếu chưa lock hợp lệ => không tạo booking)
    for (const sId of seatIds) {
      const lockedBy = await isSeatLocked({ showtimeId, seatId: sId });
      if (lockedBy !== lockId) {
        await session.abortTransaction();
        return res.status(409).json({ message: `Ghế ${sId} đã bị người khác giữ hoặc lockId không khớp.` });
      }
    }

    // Tính tổng tiền + chuẩn bị seats
    let total = 0;
    const seatRecords = seatIds.map((sId) => {
      const seat = showtime.seats.find((s) => s.seatNumber === sId);
      if (!seat) throw new Error(`Ghế ${sId} không tồn tại`);
      const seatPrice =
        seat.price ||
        showtime.priceBySeatType?.[seat.type] ||
        showtime.price ||
        0;
      total += seatPrice;
      return { seatNumber: sId, type: seat.type, price: seatPrice };
    });

    // Chuẩn bị combos
    const comboDetails = [];
    for (const c of combos) {
      const cb = await Combo.findById(c.comboId).lean();
      if (!cb) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Combo ${c.comboId} không tồn tại.` });
      }
      const qty = c.quantity || 1;
      total += (cb.price || 0) * qty;
      comboDetails.push({
        comboId: cb._id,
        name: cb.name,
        price: cb.price,
        quantity: qty,
      });
    }

    // Cập nhật ghế đã bán
    showtime.seats = showtime.seats.map((s) =>
      seatIds.includes(s.seatNumber)
        ? { ...s.toObject?.() ?? s, status: "sold" }
        : s
    );
    await showtime.save({ session });

    // Lấy info cho schema Booking (theo Booking.js của bạn)
    const userEmail = req.user?.email || "unknown@example.com";
    const bookingData = {
      bookingCode: `BK${Date.now()}`,
      userId, // ✅ ObjectId
      userEmail,
      showtimeId: showtime._id.toString(), // schema của bạn định nghĩa là String
      movieTitle: showtime.movieTitle || "Không rõ phim",
      moviePoster: showtime.moviePoster || "/images/default-poster.jpg",
      cinemaInfo: {
        systemName: showtime.systemName,
        clusterName: showtime.clusterName,
        hallName: showtime.hallId,
      },
      showtimeInfo: {
        date: showtime.date,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
      },
      seats: seatRecords,
      combos: comboDetails,
      total, // ✅ trùng field 'total' trong schema
      paymentMethod,
      paymentStatus: "paid",
      bookingStatus: "confirmed",
    };

    // 🧪 LOG: dữ liệu trước khi lưu
    console.log("[CONFIRM] bookingData preview:", {
      bookingCode: bookingData.bookingCode,
      userId: bookingData.userId,
      movieTitle: bookingData.movieTitle,
      total: bookingData.total,
      seatsCount: bookingData.seats?.length,
      combosCount: bookingData.combos?.length,
    });

    // Tạo booking (bật runValidators để phát hiện miss-field)
    const [booking] = await Booking.create([bookingData], {
      session,
      validateBeforeSave: true,
      // runValidators chỉ áp dụng với .update*, với .create Mongoose đã validate.
      // Giữ lại validateBeforeSave cho chắc chắn.
    });

    await session.commitTransaction();
    console.log("[CONFIRM] booking created:", booking._id?.toString());
    await releaseSeats({ showtimeId, seatIds, lockId });

    return res.status(201).json({ message: "Đặt vé thành công.", booking });
  } catch (error) {
    console.error("❌ confirmBookingController error:", error);
    try { await session.abortTransaction(); } catch {}
    // Trả lỗi rõ ràng để FE thấy và bạn dễ debug
    return res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  } finally {
    session.endSession();
  }
};

// =====================
// 📍 GET USER BOOKINGS
// =====================
export const getUserBookings = async (req, res) => {
  try {
    const rawId = req.user?._id || req.user?.id;
    if (!rawId) return res.status(401).json({ message: "Unauthorized" });

    const userId = new mongoose.Types.ObjectId(rawId); // ✅ ép kiểu trước khi query
    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ bookings });
  } catch (error) {
    console.error("getUserBookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
