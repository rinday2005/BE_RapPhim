import express from "express";
import { listShowtimes } from "../controller/showtimesController.js";

const router = express.Router();

router.get("/", listShowtimes);

export default router;


