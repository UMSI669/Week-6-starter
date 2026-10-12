import * as SecureStore from 'expo-secure-store';

import { getDatabase } from './database';
import {
  createSalt,
  createSessionToken,
  hashPassword,
  normalizeUsername,
  validateCredentials,
} from './password';

const SESSION_TOKEN_KEY = 'moviewiki.sessionToken';
const SESSION_LENGTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Each function resolves to { id, username } or throws an Error with a message
// that is safe to show to the user.

export async function register(username, password) {
  const validationError = validateCredentials(username, password);
  if (validationError) {
    throw new Error(validationError);
  }

  const db = await getDatabase();
  const name = normalizeUsername(username);

  const existing = await db.getFirstAsync('SELECT id FROM users WHERE username = ?', name);
  if (existing) {
    throw new Error('That username is already taken.');
  }

  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);
  const result = await db.runAsync(
    'INSERT INTO users (username, password_hash, salt, created_at) VALUES (?, ?, ?, ?)',
    name,
    passwordHash,
    salt,
    Date.now()
  );

  const user = { id: result.lastInsertRowId, username: name };
  await startSession(user.id);
  return user;
}

export async function signIn(username, password) {
  const db = await getDatabase();
  const name = normalizeUsername(username);

  const row = await db.getFirstAsync(
    'SELECT id, username, password_hash, salt FROM users WHERE username = ?',
    name
  );
  const passwordHash = row ? await hashPassword(password, row.salt) : null;

  // Use the same message for both cases so we don't reveal which usernames exist.
  if (!row || passwordHash !== row.password_hash) {
    throw new Error('Incorrect username or password.');
  }

  await startSession(row.id);
  return { id: row.id, username: row.username };
}

export async function signOut() {
  const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
  if (token) {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM sessions WHERE token = ?', token);
  }
  await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
}

// Look up the saved session token, if any. Returns the signed-in user or null.
export async function restoreSession() {
  const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
  if (!token) {
    return null;
  }

  const db = await getDatabase();
  const row = await db.getFirstAsync(
    `SELECT users.id, users.username, sessions.expires_at
       FROM sessions
       JOIN users ON users.id = sessions.user_id
      WHERE sessions.token = ?`,
    token
  );

  if (!row || row.expires_at < Date.now()) {
    await signOut();
    return null;
  }

  return { id: row.id, username: row.username };
}

async function startSession(userId) {
  const db = await getDatabase();
  const token = createSessionToken();
  await db.runAsync(
    'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)',
    token,
    userId,
    Date.now() + SESSION_LENGTH_MS
  );
  await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
}
