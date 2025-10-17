// src/utils/seatLock.js
// ⚙️ MOCK REDIS (test tạm thời, không cần cài Redis thật)

// Giả lập Redis bằng Map lưu trong RAM
const mockLocks = new Map();

/**
 * 🔒 Giả lập khóa ghế
 * @param {Object} params
 * @param {string} params.showtimeId - ID của suất chiếu
 * @param {string[]} params.seatIds - Danh sách ghế muốn khóa
 * @param {string} params.lockId - Mã định danh người đặt
 * @param {number} [params.ttl=600] - Thời gian giữ ghế (giây)
 */
export const lockSeats = async ({ showtimeId, seatIds, lockId, ttl = 600 }) => {
  const key = `showtime:${showtimeId}`;
  if (!mockLocks.has(key)) mockLocks.set(key, new Map());
  const seatMap = mockLocks.get(key);

  // Kiểm tra nếu ghế đã bị khoá trước đó
  for (const seatId of seatIds) {
    const existing = seatMap.get(seatId);
    if (existing && existing.expiresAt > Date.now()) {
      return { success: false, message: `Seat ${seatId} is already locked` };
    }
  }

  // Ghi lại các ghế được khoá
  const expiresAt = Date.now() + ttl * 1000;
  for (const seatId of seatIds) {
    seatMap.set(seatId, { lockId, expiresAt });
  }

  console.log(
    `✅ [MOCK] Locked seats: ${seatIds.join(", ")} | lockId=${lockId}`
  );
  return { success: true, lockId, expiresIn: ttl };
};

/**
 * 🔓 Giả lập mở khoá ghế
 */
export const releaseSeats = async ({ showtimeId, seatIds, lockId }) => {
  const key = `showtime:${showtimeId}`;
  const seatMap = mockLocks.get(key);
  if (!seatMap) return;

  for (const seatId of seatIds) {
    const entry = seatMap.get(seatId);
    if (entry && entry.lockId === lockId) {
      seatMap.delete(seatId);
    }
  }

  console.log(
    `🔓 [MOCK] Released seats: ${seatIds.join(", ")} | lockId=${lockId}`
  );
};

/**
 * 🕵️ Kiểm tra ghế có đang bị khoá không
 */
export const isSeatLocked = async ({ showtimeId, seatId }) => {
  const key = `showtime:${showtimeId}`;
  const seatMap = mockLocks.get(key);
  if (!seatMap) return null;

  const entry = seatMap.get(seatId);
  if (!entry) return null;

  // Hết hạn thì tự xoá
  if (Date.now() > entry.expiresAt) {
    seatMap.delete(seatId);
    return null;
  }

  return entry.lockId;
};

/**
 * 🧹 Dọn dẹp toàn bộ mock (dành cho test)
 */
export const clearMockLocks = () => {
  mockLocks.clear();
  console.log("🧹 [MOCK] All locks cleared");
};

// ✅ Export default giả lập Redis (để không lỗi khi import)
export default {
  mockLocks,
  lockSeats,
  releaseSeats,
  isSeatLocked,
  clearMockLocks,
};