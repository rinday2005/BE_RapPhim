import mongoose from "mongoose";

const SeatLockSchema = new mongoose.Schema(
  {
    showtimeId: {
      type: String,
      required: true,
      index: true
    },
    seatNumbers: [
      {
        type: String,
        required: true
      }
    ],
    userId: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    lockedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// ✅ Index tối ưu
SeatLockSchema.index({ showtimeId: 1, seatNumbers: 1 });
SeatLockSchema.index({ userId: 1 });

// ✅ TTL Index (Mongo tự xóa sau khi expiresAt < now)
SeatLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SeatLock = mongoose.model("SeatLock", SeatLockSchema);

export default SeatLock;
