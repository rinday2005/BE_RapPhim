// controllers/comboController.js
import Combo from "../model/Combo.js";

// 🟢 Lấy tất cả combo (FE sẽ gọi endpoint này để hiển thị)
export const getAllCombos = async (req, res) => {
  try {
    const combos = await Combo.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, combos });
  } catch (error) {
    console.error("Error fetching combos:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy danh sách combo" });
  }
};

// 🟢 Lấy 1 combo cụ thể theo ID
export const getComboById = async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.id);
    if (!combo)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy combo" });
    res.status(200).json({ success: true, combo });
  } catch (error) {
    console.error("Error fetching combo:", error);
    res.status(500).json({ success: false, message: "Lỗi khi lấy combo" });
  }
};

// 🟡 Thêm combo mới
export const createCombo = async (req, res) => {
  try {
    const combo = new Combo(req.body);
    await combo.save();
    res.status(201).json({ success: true, combo });
  } catch (error) {
    console.error("Error creating combo:", error);
    res.status(500).json({ success: false, message: "Lỗi khi thêm combo" });
  }
};

// 🟠 Cập nhật combo
export const updateCombo = async (req, res) => {
  try {
    const combo = await Combo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!combo)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy combo" });
    res.status(200).json({ success: true, combo });
  } catch (error) {
    console.error("Error updating combo:", error);
    res.status(500).json({ success: false, message: "Lỗi khi cập nhật combo" });
  }
};

// 🔴 Xóa combo
export const deleteCombo = async (req, res) => {
  try {
    const combo = await Combo.findByIdAndDelete(req.params.id);
    if (!combo)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy combo" });
    res.status(200).json({ success: true, message: "Đã xóa combo thành công" });
  } catch (error) {
    console.error("Error deleting combo:", error);
    res.status(500).json({ success: false, message: "Lỗi khi xóa combo" });
  }
};