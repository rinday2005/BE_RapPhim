import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { verifyToken as protect, requireAdmin } from "../middlewares/authMiddleware.js";
import { listMovies, getMovieDetail, createMovie, updateMovie, deleteMovie } from "../controller/moviesController.js";

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const uploadsRoot = path.join(process.cwd(), "uploads");
ensureDir(uploadsRoot);
ensureDir(path.join(uploadsRoot, "posters"));
ensureDir(path.join(uploadsRoot, "trailers"));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "poster") cb(null, path.join(uploadsRoot, "posters"));
    else if (file.fieldname === "trailer") cb(null, path.join(uploadsRoot, "trailers"));
    else cb(null, uploadsRoot);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || "");
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

const router = express.Router();

// Public
router.get("/", listMovies);
router.get("/:movieId", getMovieDetail);

// Admin
router.post(
  "/",
  protect,
  requireAdmin,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "trailer", maxCount: 1 },
  ]),
  createMovie
);
router.put(
  "/:movieId",
  protect,
  requireAdmin,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "trailer", maxCount: 1 },
  ]),
  updateMovie
);
router.delete("/:movieId", protect, requireAdmin, deleteMovie);

export default router;

