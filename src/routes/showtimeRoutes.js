import express from "express";
import { listShowtimes, createShowtimes } from "../controller/showtimesController.js";

const router = express.Router();

router.get("/", listShowtimes);
router.post("/", createShowtimes);

export default router;




