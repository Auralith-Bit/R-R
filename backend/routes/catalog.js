import { Router } from "express";
import { readDb } from "../db.js";

const router = Router();

// One call, everything the storefront needs to render the whole
// site's product data. Keeps the frontend to a single fetch on load.
router.get("/", (req, res) => {
  const db = readDb();
  res.json({
    products: db.products,
    categoryGroups: db.categoryGroups,
    varieties: db.varieties,
    team: db.team,
    testimonials: db.testimonials,
    settings: db.settings,
    pages: db.pages || {},
  });
});

export default router;
