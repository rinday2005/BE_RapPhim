import express from "express";
import { 
  lockSeats, 
  unlockSeats, 
  getLockedSeats, 
  confirmBooking 
} from "../controller/seatLockController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Lock seats - cần authentication
router.post("/lock", verifyToken, lockSeats);

// Unlock seats - cần authentication
router.post("/unlock", verifyToken, unlockSeats);

// Get locked seats for a showtime - public (để hiển thị trạng thái ghế)
router.get("/showtime/:showtimeId", getLockedSeats);

// Confirm booking - cần authentication
router.post("/confirm", verifyToken, confirmBooking);

export default router;
