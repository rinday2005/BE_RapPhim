import express from "express";
import { verifyToken, requireAdmin } from "../middlewares/authMiddleware.js";
import { listSystems, createSystem, updateSystem, deleteSystem } from "../controller/cinemaSystemsController.js";

const router = express.Router();

router.get("/", verifyToken, requireAdmin, listSystems);
router.post("/", verifyToken, requireAdmin, createSystem);
router.put("/:id", verifyToken, requireAdmin, updateSystem);
router.delete("/:id", verifyToken, requireAdmin, deleteSystem);

export default router;


