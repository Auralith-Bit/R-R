import { Router } from "express";
import { readDb, writeDb } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(readDb().pages || {});
});

router.get("/:key", (req, res) => {
  const pages = readDb().pages || {};
  res.json(pages[req.params.key] || null);
});

router.put("/:key", requireAuth, async (req, res) => {
  const db = readDb();
  if (!db.pages) db.pages = {};
  db.pages[req.params.key] = req.body || {};
  await writeDb(db);
  res.json(db.pages[req.params.key]);
});

export default router;
