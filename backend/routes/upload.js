import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { requireAuth } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_IMAGES = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
const ALLOWED_VIDEOS = new Set([".mp4", ".webm", ".ogv"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40);
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

function createUpload(allowedExtensions, maxSize, typeLabel) {
  return multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.has(ext)) {
      return cb(new Error(`Only ${typeLabel} files are allowed.`));
    }
    cb(null, true);
  },
  });
}

const uploadImage = createUpload(ALLOWED_IMAGES, 8 * 1024 * 1024, "image (png, jpg, webp, gif, avif)");
const uploadVideo = createUpload(ALLOWED_VIDEOS, 100 * 1024 * 1024, "video (mp4, webm, ogv)");

const router = Router();

router.post("/", requireAuth, (req, res) => {
  uploadImage.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No image was uploaded." });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

router.post("/video", requireAuth, (req, res) => {
  uploadVideo.single("video")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No video was uploaded." });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

export default router;
