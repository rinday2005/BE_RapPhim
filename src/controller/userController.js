import User from "../model/User.js";
import bcrypt from "bcryptjs";

// GET /api/users/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

// PUT /api/users/me
export const updateMe = async (req, res) => {
  try {
    const { fullName, phone, avatar } = req.body;
    const updates = {};
    if (typeof fullName === "string") updates.fullName = fullName;
    if (typeof phone === "string") updates.phone = phone;
    if (typeof avatar === "string") updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");
    return res.json({ message: "Cập nhật thành công", user });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

// PUT /api/users/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Thiếu tham số" });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const matches = await user.matchPassword(currentPassword);
    if (!matches)
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });

    user.password = newPassword; // pre-save hook will hash
    await user.save();
    return res.json({ message: "Đổi mật khẩu thành công" });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

// Admin: GET /api/users
export const listUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json({ users });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

// Admin: PUT /api/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !["user", "admin", "superadmin"].includes(role)) {
      return res.status(400).json({ message: "Role không hợp lệ" });
    }
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "Cập nhật role thành công", user });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

// Admin: DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "Xóa user thành công" });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};