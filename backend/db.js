// ─────────────────────────────────────────────────────────────
//  Tiny JSON-file database.
//
//  Why not a "real" database? For a catalogue of a few dozen
//  products this is simpler to back up (it's one file), simpler
//  to understand, and simpler to move to a new host — you can
//  literally open data/db.json in a text editor if you ever need
//  to. Writes are queued so two admins saving at once can't
//  corrupt the file.
// ─────────────────────────────────────────────────────────────
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data", "db.json");

const DEFAULT_DB = {
  products: [],
  categoryGroups: [],
  varieties: [],
  team: [],
  testimonials: [],
  settings: {
    siteName: "R&R Food Products",
    contactEmail: "Support@riyarakshya.com.np",
    contactPhone: "+977 982-0299711",
    whatsappNumber: "9779857021032",
    address: "S.No.-4, SugarMill area, Bhairahawa, Nepal",
  },
  pages: {},
  admin: null, // { username, passwordHash } — set by seed.js / first-run
};

function ensureDbFile() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
  }
}

export function readDb() {
  ensureDbFile();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(
      "db.json is corrupted and could not be parsed. Restore from your latest backup in data/backups/."
    );
  }
}

let writeQueue = Promise.resolve();

export function writeDb(data) {
  // Chain writes so concurrent saves never interleave / corrupt the file.
  writeQueue = writeQueue.then(() => {
    // Keep a rolling backup before every write, just in case.
    const backupDir = path.join(__dirname, "data", "backups");
    fs.mkdirSync(backupDir, { recursive: true });
    if (fs.existsSync(DB_PATH)) {
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      fs.copyFileSync(DB_PATH, path.join(backupDir, `db-${stamp}.json`));
      pruneBackups(backupDir);
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  });
  return writeQueue;
}

function pruneBackups(backupDir, keep = 20) {
  const files = fs
    .readdirSync(backupDir)
    .filter((f) => f.startsWith("db-"))
    .sort();
  const excess = files.length - keep;
  for (let i = 0; i < excess; i++) {
    fs.unlinkSync(path.join(backupDir, files[i]));
  }
}

export function nextId(list) {
  return list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}
