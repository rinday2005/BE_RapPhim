import SeatLock from "../model/SeatLock.js";
import mongoose from "mongoose";
import Showtime from "../model/showtime.js";
import Booking from "../model/Booking.js";

// ✅ Giữ ghế (lock seats)
export const lockSeats = async (req, res) => {
  try {
    const { showtimeId, seatNumbers, userId, userEmail } = req.body;

    if (!showtimeId || !seatNumbers?.length) {
      return res.status(400).json({ message: "Thiếu thông tin suất chiếu hoặc danh sách ghế." });
    }

    if (!userId || !userEmail) {
      return res.status(400).json({ message: "Thiếu thông tin người dùng." });
    }

    // 1️⃣ Kiểm tra suất chiếu tồn tại
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: "Không tìm thấy suất chiếu." });
    }

    // 2️⃣ Nếu seatData chưa có, gán mảng trống để tránh lỗi filter
    const seatData = Array.isArray(showtime.seatData) ? showtime.seatData : [];

    // 3️⃣ Chặn trùng ghế: kiểm tra ghế đã bị "occupied" hoặc đang được lock bởi người khác
    const occupiedSeats = new Set(
      seatData
        .filter((s) => s && seatNumbers.includes(s.seatNumber) && (s.status === "occupied" || s.status === "sold"))
        .map((s) => s.seatNumber)
    );

    const activeLocks = await SeatLock.find({
      showtimeId,
      isActive: true,
      expiresAt: { $gt: new Date() },
      seatNumbers: { $in: seatNumbers },
    }).lean();

    const lockedSeats = new Set();
    for (const lock of activeLocks) {
      for (const sn of lock.seatNumbers) {
        if (seatNumbers.includes(sn)) lockedSeats.add(sn);
      }
    }

    const conflictingSeats = Array.from(new Set([...occupiedSeats, ...lockedSeats]));
    if (conflictingSeats.length > 0) {
      return res.status(409).json({
        message: "Một số ghế đã được giữ hoặc đặt.",
        conflictingSeats,
      });
    }

    // 4️⃣ Deactivate lock cũ của user (đã hết hạn)
    await SeatLock.updateMany(
      { userId, showtimeId, isActive: true, expiresAt: { $lt: new Date() } },
      { $set: { isActive: false } }
    );

    // 5️⃣ Tạo lock mới (10 phút)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const seatLock = await SeatLock.create({
      showtimeId,
      seatNumbers,
      userId,
      userEmail,
      expiresAt,
      isActive: true
    });

    res.json({
      success: true,
      lockId: seatLock._id,
      expiresAt,
      expiresIn: Math.floor((expiresAt - new Date()) / 1000),
      message: "Đã giữ ghế thành công."
    });

  } catch (error) {
    console.error("❌ lockSeats error:", error);
    res.status(500).json({ message: "Lỗi server khi giữ ghế.", error: error.message });
  }
};

// ✅ Lấy danh sách ghế đang bị lock
export const getLockedSeats = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    if (!showtimeId)
      return res.status(400).json({ message: "Thiếu showtimeId" });

    const lockedSeats = await SeatLock.find({
      showtimeId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).select("seatNumbers userId userEmail expiresAt");

    const allLockedSeats = lockedSeats.flatMap(lock =>
      lock.seatNumbers.map(seatNumber => ({
        seatNumber,
        lockedBy: lock.userId,
        lockedByEmail: lock.userEmail,
        expiresAt: lock.expiresAt
      }))
    );

    res.json({ success: true, lockedSeats: allLockedSeats });
  } catch (error) {
    console.error("❌ getLockedSeats error:", error);
    res.status(500).json({ message: "Lỗi server khi lấy ghế bị giữ." });
  }
};

// ✅ Hủy giữ ghế (unlock)
export const unlockSeats = async (req, res) => {
  try {
    const { lockId, userId } = req.body;
    if (!lockId || !userId)
      return res.status(400).json({ message: "Thiếu thông tin." });

    const result = await SeatLock.updateOne(
      { _id: lockId, userId, isActive: true },
      { $set: { isActive: false } }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Không tìm thấy lock hoặc không có quyền unlock." });

    res.json({ success: true, message: "Đã hủy giữ ghế thành công." });
  } catch (error) {
    console.error("❌ unlockSeats error:", error);
    res.status(500).json({ message: "Lỗi server khi hủy giữ ghế." });
  }
};

// ✅ Xác nhận đặt vé (confirm booking)
export const confirmBooking = async (req, res) => {
  try {
    const { lockId, bookingData } = req.body;
    // Trust authenticated user from token, not client-sent userId
    const authUserId = req.user?._id || req.user?.id;
    const userId = authUserId ? String(authUserId) : undefined;
    const userObjectId = authUserId ? new mongoose.Types.ObjectId(authUserId) : undefined;

    console.log("[confirmBooking] body:", {
      lockId,
      userIdFromToken: userId,
      bookingDataKeys: bookingData ? Object.keys(bookingData) : null,
    });
    if (!lockId || !userId || !bookingData) {
      return res.status(400).json({ message: "Thiếu dữ liệu." });
    }

    // 1️⃣ Kiểm tra lock hợp lệ
    let seatLock = await SeatLock.findOne({ _id: lockId, userId });
    if (!seatLock) {
      return res.status(404).json({ message: "Không tìm thấy lock cho người dùng." });
    }
    const isExpired = !(seatLock.isActive && seatLock.expiresAt > new Date());
    if (isExpired) {
      // Cho phép confirm idempotent: nếu đã inactive nhưng seats đã occupied, vẫn tạo booking
      console.warn("confirmBooking: lock inactive or expired, tiếp tục theo idempotent mode");
    }

    // 2️⃣ Cập nhật trạng thái ghế → "occupied"
    console.log("[confirmBooking] seatLock:", {
      showtimeId: seatLock?.showtimeId,
      seatNumbers: seatLock?.seatNumbers,
    });
    const showtime = await Showtime.findById(seatLock.showtimeId);
    if (!showtime)
      return res.status(404).json({ message: "Không tìm thấy suất chiếu." });

    // Hỗ trợ cả 2 cấu trúc dữ liệu ghế: seatData hoặc seats
    const hasSeatData = Array.isArray(showtime.seatData) && showtime.seatData.length >= 0;
    const currentSeats = hasSeatData
      ? (Array.isArray(showtime.seatData) ? showtime.seatData : [])
      : (Array.isArray(showtime.seats) ? showtime.seats : []);

    let updated = 0;
    if (Array.isArray(currentSeats) && currentSeats.length > 0 && Array.isArray(seatLock.seatNumbers)) {
      const updatedSeats = currentSeats.map((seat) => {
        if (seatLock.seatNumbers.includes(seat.seatNumber)) {
          seat.status = "occupied";
          updated++;
        }
        return seat;
      });

      if (updatedSeats.length > 0) {
        if (hasSeatData) {
          showtime.seatData = updatedSeats;
        } else {
          showtime.seats = updatedSeats;
        }
        await showtime.save();
      }
    } else {
      console.warn("confirmBooking: seats array missing or empty; skipping seat update", {
        showtimeId: showtime._id?.toString?.(),
        seatNumbers: seatLock.seatNumbers,
      });
    }

    // 3️⃣ Hủy hiệu lực lock (vì đã đặt vé xong)
    if (seatLock.isActive) {
      seatLock.isActive = false;
      await seatLock.save();
    }

    console.log(`✅ Đặt vé thành công: ${updated} ghế chuyển sang trạng thái 'occupied'.`);

    // 4️⃣ Tạo bản ghi Booking để hiển thị ở lịch sử
      const bookingCode = `BK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const seats = Array.isArray(bookingData.selectedSeats)
        ? bookingData.selectedSeats.map((s) => ({
            seatNumber: s.seatNumber || s,
            type: s.type || "regular",
            price: Number(s.price || 0),
          }))
        : [];
      const combosArr = Object.entries(bookingData.selectedCombos || {})
        .filter(([, q]) => q > 0)
        .map(([comboId, quantity]) => ({ comboId, name: String(comboId), price: 0, quantity }));

      // Ensure required fields align with Booking schema
      const userEmail = req.user?.email || bookingData.userEmail;
      if (!userEmail) {
        return res.status(400).json({ message: "Thiếu email người dùng để tạo booking." });
      }

      await Booking.create({
        userId: userObjectId,
        userEmail,
        showtimeId: String(seatLock.showtimeId || bookingData.showtimeId || ""),
        movieTitle: bookingData.movieTitle,
        moviePoster: bookingData.moviePoster,
        cinemaInfo: {
          systemName: bookingData.systemName,
          clusterName: bookingData.clusterName,
          hallName: bookingData.hallName,
        },
        showtimeInfo: {
          date: bookingData.date,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
        },
        seats,
        combos: combosArr,
        total: Number(bookingData.total || 0),
        paymentMethod: bookingData.paymentMethod || "momo",
        paymentStatus: "paid",
        bookingStatus: "confirmed",
        bookingCode,
      });

      return res.json({
        success: true,
        message: "Đặt vé thành công",
        bookingCode,
      });
  } catch (error) {
    console.error("❌ confirmBooking error:", error);
    return res.status(500).json({ message: error.message || "Lỗi khi xác nhận đặt vé." });
  }
};
