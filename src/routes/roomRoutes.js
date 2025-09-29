import express from "express";
import { verifyToken, requireAdmin } from "../middlewares/authMiddleware.js";
import { listRooms, createRoom, updateRoom, deleteRoom } from "../controller/roomsController.js";

const router = express.Router();

router.get("/", verifyToken, requireAdmin, listRooms);
router.post("/", verifyToken, requireAdmin, createRoom);
router.put("/:id", verifyToken, requireAdmin, updateRoom);
router.delete("/:id", verifyToken, requireAdmin, deleteRoom);

export default router;




