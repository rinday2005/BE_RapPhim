import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createBooking,
  listMyBookings,
} from "../controller/bookingController.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/my", verifyToken, listMyBookings);

export default router;