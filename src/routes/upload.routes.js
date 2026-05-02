import express from "express";
import upload from "../middleware/multer.middleware.js";
import { uploadFile } from "../controllers/upload.controller.js";

const router = express.Router();

// POST /api/upload
router.post("/upload", upload.single("file"), uploadFile);

export default router;