import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'events.sqlite');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbInstance = null;

export function getDatabase() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    // Enable WAL mode and foreign keys for performance and data integrity
    dbInstance.exec('PRAGMA foreign_keys = ON;');
  }
  return dbInstance;
}

export function queryAll(sql, params = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

export function queryGet(sql, params = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  return stmt.get(...params);
}

export function queryRun(sql, params = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}

export function execScript(sqlString) {
  const db = getDatabase();
  return db.exec(sqlString);
}

export { DB_PATH };

// Run diagnostics if executed directly via `node database/dbConnection.js`
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  console.log('🔌 Testing Database Connection...');
  console.log(`📁 Database Path: ${DB_PATH}`);
  try {
    const tables = queryAll("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    console.log('✅ Connection Successful!');
    console.log(`📊 Tables Found (${tables.length}): ${tables.map(t => t.name).join(', ')}`);
    tables.forEach(t => {
      const row = queryGet(`SELECT COUNT(*) as c FROM ${t.name}`);
      console.log(`   • ${t.name}: ${row.c} records`);
    });
    console.log('🎉 Database is healthy and ready for queries.');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
  }
}

