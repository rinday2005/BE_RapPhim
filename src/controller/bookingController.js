import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Showtime from "../model/showtime.js";
import Booking from "../model/booking.js";
import Combo from "../model/Combo.js"


// ✅ Mock seat lock storage (thay Redis)
const seatLockStore = new Map(); // key = `showtime:seat`, value = lockId

// ✅ Mock lockSeats (không cần Redis)
export const lockSeats = async ({ showtimeId, seatIds, lockId, ttl = 600 }) => {
  const locked = [];
  for (const seatId of seatIds) {
    const key = `showtime:${showtimeId}:seat:${seatId}`;
    if (seatLockStore.has(key)) {
      // rollback nếu có ghế bị khóa
      for (const k of locked) seatLockStore.delete(k);
      return { success: false, message: "Some seats already locked" };
    }
    seatLockStore.set(key, lockId);
    locked.push(key);

    // Xóa sau ttl giây (giả lập Redis expire)
    setTimeout(() => {
      if (seatLockStore.get(key) === lockId) seatLockStore.delete(key);
    }, ttl * 1000);
  }

  return { success: true, lockId, expiresIn: ttl };
};

// ✅ Mock releaseSeats
export const releaseSeats = async ({ showtimeId, seatIds, lockId }) => {
  for (const seatId of seatIds) {
    const key = `showtime:${showtimeId}:seat:${seatId}`;
    if (seatLockStore.get(key) === lockId) seatLockStore.delete(key);
  }
};

// ✅ Mock isSeatLocked
export const isSeatLocked = async ({ showtimeId, seatId }) => {
  return seatLockStore.get(`showtime:${showtimeId}:seat:${seatId}`) || null;
};

// 📍 Lấy danh sách ghế
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

// 📍 Khóa ghế (mock)
export const lockSeatsController = async (req, res) => {
  try {
    const { showtimeId, seatIds } = req.body;

    // ✅ Validate input
    if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ." });
    }

    // ✅ Tìm showtime
    const showtime = await Showtime.findById(showtimeId).lean();
    if (!showtime) {
      return res.status(404).json({ message: "Suất chiếu không tồn tại." });
    }

    // ✅ CRITICAL FIX: Kiểm tra seats có tồn tại không
    if (
      !showtime.seats ||
      !Array.isArray(showtime.seats) ||
      showtime.seats.length === 0
    ) {
      return res.status(500).json({
        message: "Dữ liệu ghế không hợp lệ. Vui lòng kiểm tra lại suất chiếu.",
        debug: {
          showtimeId,
          hasSeats: !!showtime.seats,
          isArray: Array.isArray(showtime.seats),
          seatsLength: showtime.seats?.length || 0,
        },
      });
    }

    // ✅ Kiểm tra từng ghế
    for (const sId of seatIds) {
      const seat = showtime.seats.find((s) => s.seatNumber === sId);
      if (!seat) {
        return res.status(400).json({ message: `Ghế ${sId} không tồn tại.` });
      }
      if (seat.status === "sold") {
        return res.status(409).json({ message: `Ghế ${sId} đã bán.` });
      }
    }

    // ✅ Tạo lock
    const lockId = uuidv4();
    const result = await lockSeats({ showtimeId, seatIds, lockId, ttl: 600 });

    if (!result.success) {
      return res.status(409).json({ message: result.message });
    }

    return res.json({
      message: "Khóa ghế thành công (mock).",
      lockId,
      expiresIn: result.expiresIn,
    });
  } catch (error) {
    console.error("❌ lockSeatsController error:", error);
    res.status(500).json({
      message: "Lỗi máy chủ.",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// 📍 Mở khóa ghế (mock)
export const releaseSeatsController = async (req, res) => {
  try {
    const { showtimeId, seatIds, lockId } = req.body;

    if (
      !showtimeId ||
      !Array.isArray(seatIds) ||
      seatIds.length === 0 ||
      !lockId
    )
      return res.status(400).json({ message: "Dữ liệu không hợp lệ." });

    await releaseSeats({ showtimeId, seatIds, lockId });

    res.json({ message: "Đã mở khóa ghế (mock)." });
  } catch (error) {
    console.error("❌ releaseSeatsController error:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

// 📍 Xác nhận đặt vé (mock)
export const confirmBookingController = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const {
      showtimeId,
      seatIds,
      lockId,
      combos = [],
      paymentMethod = "card",
    } = req.body;
    const userId = req.user?._id || "mockUserId123"; // giả user

    if (
      !showtimeId ||
      !Array.isArray(seatIds) ||
      seatIds.length === 0 ||
      !lockId
    )
      return res.status(400).json({ message: "Dữ liệu không hợp lệ." });

    // ✅ Kiểm tra khóa ghế
    for (const sId of seatIds) {
      const lockedBy = await isSeatLocked({ showtimeId, seatId: sId });
      if (lockedBy !== lockId)
        return res
          .status(409)
          .json({ message: `Ghế ${sId} đã bị người khác giữ.` });
    }

    const showtime = await Showtime.findById(showtimeId).session(session);
    if (!showtime)
      return res.status(404).json({ message: "Suất chiếu không tồn tại." });

    // ✅ Kiểm tra seats
    if (!showtime.seats || !Array.isArray(showtime.seats)) {
      return res.status(500).json({ message: "Dữ liệu ghế không hợp lệ." });
    }

    // ✅ Tính tổng tiền
    let total = 0;
    const seatRecords = seatIds.map((sId) => {
      const seat = showtime.seats.find((s) => s.seatNumber === sId);
      if (!seat) {
        throw new Error(`Ghế ${sId} không tồn tại`);
      }
      const seatPrice =
        seat.price ||
        showtime.priceBySeatType?.[seat.type] ||
        showtime.price ||
        0;
      total += seatPrice;
      return { seatNumber: sId, seatType: seat.type, price: seatPrice };
    });

    const comboDetails = [];
    for (const c of combos) {
      const cb = await Combo.findById(c.comboId).lean();
      if (!cb)
        return res
          .status(400)
          .json({ message: `Combo ${c.comboId} không tồn tại.` });
      const qty = c.quantity || 1;
      const price = (cb.price || 0) * qty;
      total += price;
      comboDetails.push({
        comboId: cb._id,
        name: cb.name,
        quantity: qty,
        price: cb.price,
      });
    }

    const paymentStatus = "paid";

    await session.startTransaction();

    showtime.seats = showtime.seats.map((s) =>
      seatIds.includes(s.seatNumber) ? { ...s.toObject(), status: "sold" } : s
    );
    showtime.availableSeats = Math.max(
      0,
      showtime.availableSeats - seatIds.length
    );
    await showtime.save({ session });

    const [booking] = await Booking.create(
      [
        {
          bookingCode: `BK${Date.now()}`,
          userId,
          movieId: showtime.movieId,
          showtimeId: showtime._id,
          clusterId: showtime.clusterId,
          hallId: showtime.hallId,
          date: showtime.date,
          startTime: showtime.startTime,
          endTime: showtime.endTime,
          seats: seatRecords,
          combos: comboDetails,
          totalPrice: total,
          paymentStatus,
          paymentMethod,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    await releaseSeats({ showtimeId, seatIds, lockId });

    res.status(201).json({
      message: "Đặt vé thành công (mock).",
      booking,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("❌ confirmBookingController error:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  } finally {
    session.endSession();
  }
};

// 📍 Lấy lịch sử đặt vé của user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Chuẩn hoá dữ liệu cho FE Profile.jsx
    const result = bookings.map((b) => ({
      _id: b._id,
      movieTitle: b.movieTitle,
      moviePoster: b.moviePoster,
      systemName: b.cinemaInfo?.systemName,
      clusterName: b.cinemaInfo?.clusterName,
      hallName: b.cinemaInfo?.hallName,
      date: b.showtimeInfo?.date,
      startTime: b.showtimeInfo?.startTime,
      endTime: b.showtimeInfo?.endTime,
      seats: b.seats,
      total: b.total || b.totalPrice,
      status: b.bookingStatus || (b.paymentStatus === "paid" ? "confirmed" : "pending"),
    }));

    res.json({ bookings: result });
  } catch (error) {
    console.error("getUserBookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};