// src/routes/bookingRoutes.js
import express from "express";
import {
  getSeatsController,
  lockSeatsController,
  releaseSeatsController,
  confirmBookingController,
  getUserBookings,
} from "../controller/bookingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Public route - Lấy danh sách ghế (không cần auth)
router.get("/showtimes/:showtimeId/seats", getSeatsController);

// ✅ Protected routes - Cần đăng nhập
router.post("/lock", verifyToken, lockSeatsController);
router.post("/release", verifyToken, releaseSeatsController);
router.post("/confirm", verifyToken, confirmBookingController);

// ✅ Lịch sử đặt vé của user
router.get("/user", verifyToken, getUserBookings);

export default router;