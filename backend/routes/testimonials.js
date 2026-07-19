import { Router } from "express";
import { readDb, writeDb } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(readDb().testimonials);
});

router.put("/", requireAuth, async (req, res) => {
  const db = readDb();
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: "Expected an array." });
  }
  db.testimonials = req.body;
  await writeDb(db);
  res.json(db.testimonials);
});

export default router;
