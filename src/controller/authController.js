import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//-------------------------Đăng ký------------------//
export const register = async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    
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
    console.log('Login request body:', req.body);
    
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

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(
      payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES }
    );

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