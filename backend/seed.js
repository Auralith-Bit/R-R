// One-time (or re-runnable) migration: pulls the catalogue that used
// to be hard-coded in the React app's src/data/products.js and loads
// it into data/db.json so the CMS has something to start from.
//
// Safe to re-run: pass --force to overwrite an existing db.json,
// otherwise it refuses to clobber real edits the client has made.
import bcrypt from "bcryptjs";
import { readDb, writeDb } from "./db.js";
import * as source from "./source-products.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data", "db.json");
const force = process.argv.includes("--force");

if (fs.existsSync(DB_PATH) && !force) {
  const existing = readDb();
  if (existing.products?.length) {
    console.log(
      "data/db.json already has products in it. Re-run with --force if you really want to overwrite it with the original static catalogue."
    );
    process.exit(0);
  }
}

const db = readDb();

db.products = source.PRODUCTS;
db.categoryGroups = source.CATEGORY_GROUPS;
db.varieties = source.VARIETIES;
db.team = source.TEAM;
db.testimonials = source.TESTIMONIALS;

// Seed the admin login. Change these via the .env file (ADMIN_USERNAME /
// ADMIN_PASSWORD) before running this — or just log in and change the
// password from the admin panel afterwards.
const username = process.env.ADMIN_USERNAME || "rnrsnacks";
const password = process.env.ADMIN_PASSWORD || "changeme123";
db.admin = {
  username,
  passwordHash: bcrypt.hashSync(password, 10),
};

await writeDb(db);

console.log(`Seeded ${db.products.length} products, ${db.categoryGroups.length} category groups, ${db.varieties.length} varieties, ${db.team.length} team members, ${db.testimonials.length} testimonials.`);
console.log(`Admin login → username: "${username}"  password: "${password}"`);
console.log(`IMPORTANT: log in and change this password from the admin panel once it's deployed.`);
