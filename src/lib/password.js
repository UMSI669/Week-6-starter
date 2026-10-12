import * as Crypto from 'expo-crypto';

const MIN_USERNAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 6;

// Usernames are stored lowercase so "Tai" and "tai" are the same account.
export function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

// Returns an error message, or null when the credentials look valid.
export function validateCredentials(username, password) {
  if (normalizeUsername(username).length < MIN_USERNAME_LENGTH) {
    return `Username must be at least ${MIN_USERNAME_LENGTH} characters.`;
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export function createSalt() {
  return Crypto.randomUUID();
}

// Salted SHA-256. Good enough for a local prototype; a real server should use
// a slow password hash such as bcrypt or Argon2.
export function hashPassword(password, salt) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

export function createSessionToken() {
  return Crypto.randomUUID();
}
