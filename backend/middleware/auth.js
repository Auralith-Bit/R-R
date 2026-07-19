import jwt from "jsonwebtoken";
import crypto from "node:crypto";

// If no JWT_SECRET is set, generate a random one on startup.
// WARNING: In production, always set JWT_SECRET in .env — a random
// secret means existing tokens are invalidated on every server restart.
const SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");

if (!process.env.JWT_SECRET) {
  console.warn("\n⚠  JWT_SECRET is not set in .env. A random secret was generated.");
  console.warn("   Admin sessions will be invalidated on every restart.");
  console.warn("   Set JWT_SECRET in backend/.env for production.\n");
}

export function signToken(username) {
  return jwt.sign({ username }, SECRET, { expiresIn: "7d" });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Please log in to do that." });
  }
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Your session expired. Please log in again." });
  }
}
