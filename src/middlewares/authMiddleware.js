import jwt from "jsonwebtoken";

// Middleware: xác thực token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Admins only" });
};

export const requireSuperAdmin = (req, res, next) => {
  if (req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Superadmins only" });
};

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