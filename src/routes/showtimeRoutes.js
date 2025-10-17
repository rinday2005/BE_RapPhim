import express from "express";
import {
  listShowtimes,
  getShowtimeById,
  createShowtimes,
  deleteShowtimesByMovie,
} from "../controller/showtimeController.js";

const router = express.Router();

// GET /api/showtimes
router.get("/", listShowtimes);

// DELETE /api/showtimes/movie/:movieId (phải đặt trước /:showtimeId)
router.delete("/movie/:movieId", deleteShowtimesByMovie);

// GET /api/showtimes/:showtimeId
router.get("/:showtimeId", getShowtimeById);

// POST /api/showtimes
router.post("/", createShowtimes);

export default router;