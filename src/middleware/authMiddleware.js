import jwt from "jsonwebtoken";

// ✅ Middleware: xác thực token người dùng
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔧 Normalize payload để backend luôn có req.user._id
    req.user = {
      _id: decoded._id || decoded.id, // hỗ trợ cả 2 kiểu payload
      id: decoded._id || decoded.id,
      email: decoded.email,
      role: decoded.role || "user",
    };

    next();
  } catch (err) {
    console.error("❌ verifyToken error:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ Middleware: yêu cầu admin
export const requireAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Admins only" });
};

// ✅ Middleware: chỉ superadmin
export const requireSuperAdmin = (req, res, next) => {
  if (req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Superadmins only" });
};

// ✅ Middleware: kiểm tra theo danh sách vai trò
export const verifyRole = (roles = []) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "Access denied: Insufficient role" });
  };
};
