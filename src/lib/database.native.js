import * as SQLite from 'expo-sqlite';

let database;

// Open the database once and create every table the app needs.
export async function getDatabase() {
  if (!database) {
    database = await SQLite.openDatabaseAsync('moviewiki.db');
    await database.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_favorites (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, movie_id)
      );
    `);
  }
  return database;
}
