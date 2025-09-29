import express from "express";
import { verifyToken, requireAdmin } from "../middlewares/authMiddleware.js";
import { listCinemas, createCinema, updateCinema, deleteCinema, cinemasWithRooms } from "../controller/cinemasController.js";

const router = express.Router();

router.get("/", verifyToken, requireAdmin, listCinemas);
router.get("/with-rooms", verifyToken, requireAdmin, cinemasWithRooms);
router.post("/", verifyToken, requireAdmin, createCinema);
router.put("/:id", verifyToken, requireAdmin, updateCinema);
router.delete("/:id", verifyToken, requireAdmin, deleteCinema);

export default router;


