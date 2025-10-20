import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

//-------------------------Đăng ký------------------//
export const register = async (req, res) => {
  try {
    console.log("Register request body:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const { fullName, email, password, phone } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const newUser = new User({ fullName, email, password, phone });
    await newUser.save();

    const userResponse = {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ----------------------Đăng nhập--------------------//
export const login = async (req, res) => {
  try {
    console.log("Login request body:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Include email in JWT so downstream middleware can attach req.user.email
    const payload = { id: user._id, role: user.role, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    const { password: _, ...userData } = user.toObject();

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//-----------------Kiểm tra quyền-----------------///

export const superAdminTest = (req, res) => {
  res.json({ message: "Hello Superadmin " });
};

export const userTest = (req, res) => {
  res.json({ message: `Hello ${req.user.role}` });
};

// ----------------------Quên mật khẩu--------------------//
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email là bắt buộc" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Trả về 200 để tránh lộ email tồn tại hay không
      return res.json({
        message: "Nếu email tồn tại, liên kết đặt lại đã được gửi",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    user.passwordResetToken = tokenHash;
    user.passwordResetExpires = expiresAt;
    await user.save();

    // In thực tế: gửi email. Ở đây trả về URL để FE có thể hiển thị/ghi lại
    const resetUrl = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/reset-password?token=${rawToken}&id=${user._id}`;

    return res.json({ message: "Đã gửi hướng dẫn đặt lại mật khẩu", resetUrl });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ----------------------Đặt lại mật khẩu--------------------//
export const resetPassword = async (req, res) => {
  try {
    const { token, id, newPassword } = req.body;
    if (!token || !id || !newPassword) {
      return res.status(400).json({ message: "Thiếu tham số" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      _id: id,
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    user.password = newPassword; // sẽ được hash trong pre-save hook
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};