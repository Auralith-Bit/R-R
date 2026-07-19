import { Router } from "express";
import { readDb, writeDb, nextId } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(readDb().products);
});

router.get("/:id", (req, res) => {
  const product = readDb().products.find((p) => String(p.id) === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found." });
  res.json(product);
});

router.post("/", requireAuth, async (req, res) => {
  const db = readDb();
  const body = req.body || {};
  if (!body.name || !body.category) {
    return res.status(400).json({ error: "Name and category are required." });
  }
  const product = {
    id: nextId(db.products),
    name: body.name,
    category: body.category,
    price: Number(body.price) || 0,
    unit: body.unit || "",
    description: body.description || "",
    image: body.image || "",
    sizeOptions: Array.isArray(body.sizeOptions) ? body.sizeOptions : [],
    sizes: Array.isArray(body.sizeOptions) ? body.sizeOptions.map((s) => s.size) : [],
    reviews: Number(body.reviews) || 0,
    rating: Number(body.rating) || 5,
    ingredients: body.ingredients || "",
    allergy: body.allergy || "",
    badge: body.badge || "",
  };
  db.products.push(product);
  await writeDb(db);
  res.status(201).json(product);
});

router.put("/:id", requireAuth, async (req, res) => {
  const db = readDb();
  const idx = db.products.findIndex((p) => String(p.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found." });
  const body = req.body || {};
  const existing = db.products[idx];
  const updated = {
    ...existing,
    ...body,
    id: existing.id,
    price: body.price !== undefined ? Number(body.price) : existing.price,
    reviews: body.reviews !== undefined ? Number(body.reviews) : existing.reviews,
    rating: body.rating !== undefined ? Number(body.rating) : existing.rating,
    sizeOptions: Array.isArray(body.sizeOptions) ? body.sizeOptions : existing.sizeOptions,
    sizes: Array.isArray(body.sizeOptions)
      ? body.sizeOptions.map((s) => s.size)
      : existing.sizes,
  };
  db.products[idx] = updated;
  await writeDb(db);
  res.json(updated);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const db = readDb();
  const idx = db.products.findIndex((p) => String(p.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found." });
  const [removed] = db.products.splice(idx, 1);
  await writeDb(db);
  res.json({ ok: true, removed });
});

export default router;
