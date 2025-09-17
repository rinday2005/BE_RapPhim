import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../model/User.js";
import { generateToken } from "../utils/auth.js"; // import hàm tạo token

dotenv.config();

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@rapphim.com" });

    let admin;
    if (!existingAdmin) {
      admin = await User.create({
        fullName: "Super Admin",
        email: "admin@rapphim.com",
        password: "123456", // Password sẽ được hash tự động trong pre-save hook
        phone: "0123456789",
        role: "superadmin",
      });

      console.log("Superadmin created successfully");
    } else {
      admin = existingAdmin;
      console.log("Superadmin already exists");
    }

    // Tạo token cho admin và in ra console
    const token = generateToken(admin);
    console.log("Admin token:", token);
  } catch (error) {
    console.error("Seed admin error:", error.message);
  }
};

export default seedAdmin;