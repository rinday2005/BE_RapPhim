import SeatLock from "../model/SeatLock.js";
import Showtime from "../model/showtime.js";

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
    const { lockId, userId, bookingData } = req.body;
    if (!lockId || !userId || !bookingData)
      return res.status(400).json({ message: "Thiếu dữ liệu." });

    // 1️⃣ Kiểm tra lock hợp lệ
    const seatLock = await SeatLock.findOne({
      _id: lockId,
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });
    if (!seatLock)
      return res.status(404).json({ message: "Không tìm thấy lock hoặc đã hết hạn." });

    // 2️⃣ Cập nhật trạng thái ghế → "occupied"
    const showtime = await Showtime.findById(seatLock.showtimeId);
    if (!showtime)
      return res.status(404).json({ message: "Không tìm thấy suất chiếu." });

    // Hỗ trợ cả 2 cấu trúc dữ liệu ghế: seatData hoặc seats
    const hasSeatData = Array.isArray(showtime.seatData) && showtime.seatData.length >= 0;
    const currentSeats = hasSeatData
      ? Array.isArray(showtime.seatData) ? showtime.seatData : []
      : Array.isArray(showtime.seats) ? showtime.seats : [];

    if (!Array.isArray(currentSeats) || currentSeats.length === 0) {
      return res.status(500).json({ message: "Dữ liệu ghế của suất chiếu không hợp lệ." });
    }

    let updated = 0;
    const updatedSeats = currentSeats.map((seat) => {
      if (seatLock.seatNumbers.includes(seat.seatNumber)) {
        seat.status = "occupied";
        updated++;
      }
      return seat;
    });

    if (hasSeatData) {
      showtime.seatData = updatedSeats;
    } else {
      showtime.seats = updatedSeats;
    }

    await showtime.save();

    // 3️⃣ Hủy hiệu lực lock (vì đã đặt vé xong)
    seatLock.isActive = false;
    await seatLock.save();

    console.log(`✅ Đặt vé thành công: ${updated} ghế chuyển sang trạng thái 'occupied'.`);

    res.json({
      success: true,
      message: "Đặt vé thành công — ghế đã được đánh dấu 'đã đặt'.",
      bookingCode: `BK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    });
  } catch (error) {
    console.error("❌ confirmBooking error:", error);
    res.status(500).json({ message: error.message || "Lỗi khi xác nhận đặt vé." });
  }
};
