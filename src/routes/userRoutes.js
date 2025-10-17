import express from "express";
import {
  verifyToken as protect,
  requireAdmin,
} from "../middleware/authMiddleware.js";
import {
  getMe,
  updateMe,
  changePassword,
  listUsers,
  updateUserRole,
  deleteUser,
} from "../controller/userController.js";

const router = express.Router();

// Self profile
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/me", protect, updateMe);
router.put("/change-password", protect, changePassword);

// Admin
router.get("/", protect, requireAdmin, listUsers);
router.put("/:id/role", protect, requireAdmin, updateUserRole);
router.delete("/:id", protect, requireAdmin, deleteUser);

export default router;