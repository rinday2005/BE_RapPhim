import express from "express";
import {
  register,
  login,
  superAdminTest,
  userTest,
  forgotPassword,
  resetPassword,
} from "../controller/authController.js"; 
import {
  verifyToken as protect,
  requireAdmin,
  requireSuperAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/user-test", protect, userTest);
router.get("/admin-test", protect, requireAdmin, (req, res) => {
  res.json({ message: "Hello Admin " });
});
router.get("/superadmin-test", protect, requireSuperAdmin, superAdminTest);

export default router;
