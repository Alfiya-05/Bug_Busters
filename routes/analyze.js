import express from "express";
import { analyze } from "../controllers/analyzeController.js";

const router = express.Router();

router.get("/", analyze);

export default router;
