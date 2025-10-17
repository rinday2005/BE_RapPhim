// routes/combos.js
import express from "express";
import {
  getAllCombos,
  getComboById,
  createCombo,
  updateCombo,
  deleteCombo,
} from "../controller/comboController.js";

const router = express.Router();

// ✅ Lấy danh sách tất cả combo
router.get("/", getAllCombos);

// ✅ Lấy 1 combo cụ thể theo ID
router.get("/:id", getComboById);

// ✅ Thêm combo mới
router.post("/", createCombo);

// ✅ Cập nhật combo
router.put("/:id", updateCombo);

// ✅ Xóa combo
router.delete("/:id", deleteCombo);

export default router;