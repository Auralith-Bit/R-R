import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEGACY_DB_PATH = path.join(__dirname, "data", "db.json");

const DEFAULT_DB = {
  products: [], categoryGroups: [], varieties: [], team: [], testimonials: [],
  settings: {
    siteName: "R&R Food Products",
    contactEmail: "Support@rnrfood.com",
    contactPhone: "+977 982-0299711",
    whatsappNumber: "9779857021032",
    address: "S.N.P-04, SugarMill Area, Bhairahawa Rupandehi",
  },
  pages: {},
  admin: null,
};

let pool;
let currentDb;
let writeQueue = Promise.resolve();

export async function initializeDb() {
  const required = ["MYSQL_HOST", "MYSQL_USER", "MYSQL_DATABASE"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing MySQL configuration: ${missing.join(", ")}. Set these in backend/.env (see .env.example).`);
  }

  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
    charset: "utf8mb4",
  });

  await pool.query(`CREATE TABLE IF NOT EXISTS app_state (
    id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
    data JSON NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  const [rows] = await pool.query("SELECT data FROM app_state WHERE id = 1");
  if (rows.length) {
    currentDb = typeof rows[0].data === "string" ? JSON.parse(rows[0].data) : rows[0].data;
    const migrated = replaceLegacyEmails(currentDb);
    if (migrated) {
      await pool.execute("UPDATE app_state SET data = ? WHERE id = 1", [JSON.stringify(currentDb)]);
      console.log("Updated legacy support and sales emails in MySQL.");
    }
    return;
  }

  // One-time import of installations that still have the old JSON database.
  let initialData = DEFAULT_DB;
  if (fs.existsSync(LEGACY_DB_PATH)) {
    try {
      initialData = JSON.parse(fs.readFileSync(LEGACY_DB_PATH, "utf8"));
    } catch {
      throw new Error("Legacy backend/data/db.json is invalid JSON; repair it before importing to MySQL.");
    }
  }
  await pool.execute("INSERT INTO app_state (id, data) VALUES (1, ?)", [JSON.stringify(initialData)]);
  currentDb = initialData;
  console.log(fs.existsSync(LEGACY_DB_PATH)
    ? "Imported existing backend/data/db.json into MySQL."
    : "Initialized an empty MySQL app_state database.");
}

function replaceLegacyEmails(value) {
  let changed = false;
  const replacements = [
    [/support@riyarakshya\.com\.np/gi, "Support@rnrfood.com"],
    [/sales@riyarakshya\.com\.np/gi, "Sales@rnrfood.com"],
  ];
  function visit(item) {
    if (Array.isArray(item)) return item.map(visit);
    if (item && typeof item === "object") {
      return Object.fromEntries(Object.entries(item).map(([key, child]) => [key, visit(child)]));
    }
    if (typeof item === "string") {
      return replacements.reduce((text, [pattern, replacement]) =>
        text.replace(pattern, () => { changed = true; return replacement; }), item);
    }
    return item;
  }
  const updated = visit(value);
  if (changed) {
    for (const key of Object.keys(value)) delete value[key];
    Object.assign(value, updated);
  }
  return changed;
}

export function readDb() {
  if (!currentDb) throw new Error("MySQL database is not initialized.");
  return currentDb;
}

export function writeDb(data) {
  writeQueue = writeQueue.then(async () => {
    if (!pool) throw new Error("MySQL database is not initialized.");
    await pool.execute(
      "INSERT INTO app_state (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)",
      [JSON.stringify(data)]
    );
    currentDb = data;
  });
  return writeQueue;
}

export async function closeDb() {
  if (pool) await pool.end();
}

export function nextId(list) {
  return list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}
