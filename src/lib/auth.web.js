// In-memory fallback for Expo web, matching favorites.web.js. Accounts and the
// session are lost when the page reloads.
import {
  createSalt,
  hashPassword,
  normalizeUsername,
  validateCredentials,
} from './password';

const usersByName = new Map();
let nextUserId = 1;
let currentUser = null;

export async function register(username, password) {
  const validationError = validateCredentials(username, password);
  if (validationError) {
    throw new Error(validationError);
  }

  const name = normalizeUsername(username);
  if (usersByName.has(name)) {
    throw new Error('That username is already taken.');
  }

  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);
  const user = { id: nextUserId++, username: name };
  usersByName.set(name, { ...user, passwordHash, salt });

  currentUser = user;
  return user;
}

export async function signIn(username, password) {
  const row = usersByName.get(normalizeUsername(username));
  const passwordHash = row ? await hashPassword(password, row.salt) : null;

  if (!row || passwordHash !== row.passwordHash) {
    throw new Error('Incorrect username or password.');
  }

  currentUser = { id: row.id, username: row.username };
  return currentUser;
}

export async function signOut() {
  currentUser = null;
}

export async function restoreSession() {
  return currentUser;
}
