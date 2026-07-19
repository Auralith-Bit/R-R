import { Router } from "express";
import bcrypt from "bcryptjs";
import { readDb, writeDb } from "../db.js";
import { signToken, requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const db = readDb();
  if (!db.admin) {
    return res.status(500).json({
      error: "No admin account has been set up yet. Run: npm run seed",
    });
  }
  if (
    username !== db.admin.username ||
    !bcrypt.compareSync(password || "", db.admin.passwordHash)
  ) {
    return res.status(401).json({ error: "Incorrect username or password." });
  }
  const token = signToken(username);
  res.json({ token, username });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ username: req.user.username });
});

router.post("/change-password", requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  const db = readDb();
  if (!bcrypt.compareSync(currentPassword || "", db.admin.passwordHash)) {
    return res.status(401).json({ error: "Your current password is incorrect." });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters." });
  }
  db.admin.passwordHash = bcrypt.hashSync(newPassword, 10);
  writeDb(db);
  res.json({ ok: true });
});

export default router;
