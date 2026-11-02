const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'sasti_boutique.db');

let dbInstance = null;

function initDatabase() {
  if (dbInstance) return dbInstance;

  // Primary: better-sqlite3
  try {
    const Database = require('better-sqlite3');
    const db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // Run schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      db.exec(schema);
    }

    dbInstance = {
      type: 'better-sqlite3',
      raw: db,
      prepare: (sql) => {
        const stmt = db.prepare(sql);
        return {
          all: (...params) => stmt.all(...params),
          get: (...params) => stmt.get(...params),
          run: (...params) => stmt.run(...params)
        };
      },
      exec: (sql) => db.exec(sql),
      transaction: (fn) => db.transaction(fn)
    };

    console.log(`[DB] SQLite database initialized successfully at: ${DB_PATH}`);
    return dbInstance;
  } catch (betterErr) {
    console.warn('[DB] better-sqlite3 fallback trigger:', betterErr.message);

    // Fallback: Node 22 built-in node:sqlite
    try {
      const { DatabaseSync } = require('node:sqlite');
      const db = new DatabaseSync(DB_PATH);

      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema);
      }

      dbInstance = {
        type: 'node:sqlite',
        raw: db,
        prepare: (sql) => {
          const stmt = db.prepare(sql);
          return {
            all: (...params) => stmt.all(...params),
            get: (...params) => stmt.get(...params),
            run: (...params) => {
              const res = stmt.run(...params);
              return {
                changes: res.changes,
                lastInsertRowid: Number(res.lastInsertRowid)
              };
            }
          };
        },
        exec: (sql) => db.exec(sql),
        transaction: (fn) => {
          return (...args) => {
            db.exec('BEGIN TRANSACTION');
            try {
              const result = fn(...args);
              db.exec('COMMIT');
              return result;
            } catch (err) {
              db.exec('ROLLBACK');
              throw err;
            }
          };
        }
      };

      console.log(`[DB] Native node:sqlite initialized successfully at: ${DB_PATH}`);
      return dbInstance;
    } catch (nodeSqliteErr) {
      console.error('[DB] Failed to initialize SQLite database:', nodeSqliteErr);
      throw nodeSqliteErr;
    }
  }
}

const db = initDatabase();

module.exports = db;
