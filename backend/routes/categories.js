import { Router } from "express";
import { readDb, writeDb } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(readDb().categoryGroups);
});

// The category tree is small and edited as a whole (add/remove/reorder
// groups and sub-options together), so the admin panel sends the
// complete, already-edited array back and we save it as-is.
router.put("/", requireAuth, async (req, res) => {
  const db = readDb();
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: "Expected an array of category groups." });
  }
  db.categoryGroups = req.body;
  await writeDb(db);
  res.json(db.categoryGroups);
});

export default router;
