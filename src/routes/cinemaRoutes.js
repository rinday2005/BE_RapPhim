// routes/cinemaRoutes.js
import express from "express";
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";
import {
  // API cũ (MongoDB)
  listCinemas,
  createCinema,
  updateCinema,
  deleteCinema,
  cinemasWithRooms,
  // API mới (cinemaSystem / cluster / theater)
  listCinemaSystems,
  addCinemaSystem,
  listClusters,
  addCluster,
  listTheaters,
  addTheater,
} from "../controller/cinemasController.js";

const router = express.Router();

/* =======================
   API Cũ (MongoDB)
======================= */
router.get("/", verifyToken, requireAdmin, listCinemas);
router.get("/with-rooms", verifyToken, requireAdmin, cinemasWithRooms);
router.post("/", verifyToken, requireAdmin, createCinema);
router.put("/:id", verifyToken, requireAdmin, updateCinema);
router.delete("/:id", verifyToken, requireAdmin, deleteCinema);

/* =======================
   API Mới (cinemaSystem / cluster / theater)
======================= */
// Hệ thống rạp
router.get("/systems", verifyToken, requireAdmin, listCinemaSystems);
router.post("/systems", verifyToken, requireAdmin, addCinemaSystem);

// Cụm rạp
router.get("/clusters", verifyToken, requireAdmin, listClusters);
router.post("/clusters", verifyToken, requireAdmin, addCluster);

// Phòng chiếu
router.get("/theaters", verifyToken, requireAdmin, listTheaters);
router.post("/theaters", verifyToken, requireAdmin, addTheater);

export default router;