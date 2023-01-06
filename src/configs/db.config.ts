import { APP_NAME } from "..";

const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const filepath = `${__dirname}/../../db/data.db`;

function createTable(db) {
  db.exec(`
  CREATE TABLE messages
  (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    last_message TEXT NOT NULL,
    message_id TEXT NOT NULL UNIQUE,
    conversation_id TEXT NOT NULL UNIQUE,
    sender_id TEXT NOT NULL UNIQUE,
    last_response TEXT NOT NULL,
    last_message_timestamp TEXT NOT NULL
  );
`);
}

function createDbConnection() {
  if (fs.existsSync(filepath)) {
    const db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        return console.error(`[${APP_NAME}] failed to create db: ` + error);
      }
    });
    console.log(`[${APP_NAME}] Connection with SQLite has been established`);
    return db;
  } else {
    const db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        return console.error(`[${APP_NAME}] failed to create db: ` + error);
      }
    });
    createTable(db);
    console.log(`[${APP_NAME}] Connection with SQLite has been established`);
    return db;
  }
}

export const db = createDbConnection();
