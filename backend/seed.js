// One-time (or re-runnable) migration: loads the original catalogue into MySQL.
//
// Safe to re-run: pass --force to overwrite an existing db.json,
// otherwise it refuses to overwrite a populated MySQL catalogue.
import bcrypt from "bcryptjs";
import { closeDb, initializeDb, readDb, writeDb } from "./db.js";
import * as source from "./source-products.mjs";

const force = process.argv.includes("--force");
await initializeDb();
const existing = readDb();
if (existing.products?.length && !force) {
  console.log("MySQL already has products. Re-run with --force if you want to overwrite them with the original catalogue.");
  await closeDb();
  process.exit(0);
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
await closeDb();
