import { Router } from "express";
import { readDb } from "../db.js";

const SITE_URL = "https://rnrfood.com";

// Generated fresh on every request from whatever is actually in the
// CMS right now — so newly added/removed products show up here
// automatically, with no manual step required.
const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/products", priority: "0.9", changefreq: "weekly" },
  { path: "/manufacturing", priority: "0.6", changefreq: "monthly" },
  { path: "/about", priority: "0.6", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
];

const router = Router();

router.get("/", (req, res) => {
  const db = readDb();
  const today = new Date().toISOString().slice(0, 10);

  const urls = [
    ...STATIC_PAGES.map(
      (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
    ...db.products.map(
      (p) => `  <url>
    <loc>${SITE_URL}/products/${p.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    ),
  ];

  res.type("application/xml").send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
      "\n"
    )}\n</urlset>`
  );
});

export default router;
