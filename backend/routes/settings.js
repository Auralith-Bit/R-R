import { Router } from "express";
import { readDb, writeDb } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(readDb().settings);
});

router.put("/", requireAuth, async (req, res) => {
  const db = readDb();
  db.settings = { ...db.settings, ...(req.body || {}) };
  await writeDb(db);
  res.json(db.settings);
});

export default router;
