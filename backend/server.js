import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { initializeDb, readDb } from "./db.js";

import authRoutes from "./routes/auth.js";
import catalogRoutes from "./routes/catalog.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import varietyRoutes from "./routes/varieties.js";
import teamRoutes from "./routes/team.js";
import testimonialRoutes from "./routes/testimonials.js";
import settingsRoutes from "./routes/settings.js";
import uploadRoutes from "./routes/upload.js";
import sitemapRoutes from "./routes/sitemap.js";
import pagesRoutes from "./routes/pages.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_DIST = path.join(__dirname, "..", "frontend", "dist");

// ─────────────────────────────────────────────────────────────
//  CORS: ALLOWED_ORIGIN can be a single origin (e.g.
//  "https://rnrfood.com") or a comma-separated list for multiple
//  origins. "*" allows all origins (fine for dev, restrict in prod).
// ─────────────────────────────────────────────────────────────
const rawOrigin = process.env.ALLOWED_ORIGIN || "*";
const allowedOrigins = rawOrigin.includes(",")
  ? rawOrigin.split(",").map((o) => o.trim())
  : rawOrigin;

app.use(
  cors({
    origin: (origin, cb) => {
      if (allowedOrigins === "*") return cb(null, true);
      if (!origin) return cb(null, true); // server-to-server / curl
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "2mb" }));

// Uploaded product images are served as plain static files.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// The admin panel is a plain HTML/CSS/JS app (no build step) — served
// straight from this same server so there's only one thing to deploy.
// This is what makes rnrfood.com/admin work automatically once the
// backend is deployed at rnrfood.com.
app.use("/admin", express.static(path.join(__dirname, "..", "admin")));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/varieties", varietyRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/pages", pagesRoutes);

app.use("/sitemap.xml", sitemapRoutes);

// ─────────────────────────────────────────────────────────────
//  The public website (built React app). Served from the same
//  domain/server as the API and admin panel, so the whole site
//  lives at one address, e.g.:
//    https://rnrfood.com          → storefront
//    https://rnrfood.com/admin    → content manager
//    https://rnrfood.com/api/...  → API
//
//  Run `npm run build` in ../frontend first to produce this dist
//  folder — see the root README for the full deploy steps.
// ─────────────────────────────────────────────────────────────
const frontendBuilt = fs.existsSync(path.join(FRONTEND_DIST, "index.html"));
if (frontendBuilt) {
  app.use(express.static(FRONTEND_DIST));
  // Any route that isn't /api, /admin, /uploads, or /sitemap.xml is a
  // client-side route (React Router) — hand it index.html and let the
  // browser take over.
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.type("text/plain").send(
      "The website hasn't been built yet. Run `npm run build` in the frontend/ folder, " +
      "then restart this server. (The admin panel still works at /admin.)"
    );
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

async function start() {
  await initializeDb();
  if (!readDb().admin) {
    console.log("\nNo admin account found yet. Run this once before logging in:");
    console.log("  npm run seed\n");
  }
  if (!frontendBuilt) {
    console.log("\nNote: frontend/dist not found yet — run `npm run build` in ../frontend to serve the live website from this server.\n");
  }
  app.listen(PORT, () => {
    console.log(`R&R Food Products server running on http://localhost:${PORT}`);
    console.log(`  Website:     http://localhost:${PORT}/`);
    console.log(`  Admin panel: http://localhost:${PORT}/admin`);
    console.log(`  API:         http://localhost:${PORT}/api`);
  });
}

start().catch((error) => {
  console.error(`Unable to start the server: ${error.message}`);
  process.exitCode = 1;
});
