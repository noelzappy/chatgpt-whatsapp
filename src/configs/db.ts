import { APP_NAME } from "..";

const sqlite3 = require("sqlite3").verbose();
const filepath = "../db/data.db"

export function createDbConnection() {
    const db = new sqlite3.Database(filepath, (error) => {
        if (error) {
            return console.error(error.message);
        }
    });
    console.log(`[${APP_NAME}] Connection with SQLite has been established`);
  return db;
}