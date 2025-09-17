import express from "express";
import {
  register,
  login,
  superAdminTest,
  userTest,
} from "..//controller/authController.js";
import {
  verifyToken as protect,
  requireAdmin,
  requireSuperAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/user-test", protect, userTest);
router.get("/admin-test", protect, requireAdmin, (req, res) => {
  res.json({ message: "Hello Admin " });
});
router.get("/superadmin-test", protect, requireSuperAdmin, superAdminTest);

export default router;