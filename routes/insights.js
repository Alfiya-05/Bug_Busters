import express from "express";
import { generateInsights } from "../controllers/insightsController.js";

const router = express.Router();

router.post("/", generateInsights);

export default router;
