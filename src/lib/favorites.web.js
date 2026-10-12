// The native app persists with SQLite. This lightweight fallback keeps Expo web usable
// when the browser SQLite WASM bundle is unavailable in a static export.
const favoritesByUser = new Map();

function favoritesFor(userId) {
  if (!favoritesByUser.has(userId)) {
    favoritesByUser.set(userId, new Set());
  }
  return favoritesByUser.get(userId);
}

export async function getFavoriteIds(userId) {
  return [...favoritesFor(userId)];
}

export async function saveFavorite(userId, movieId, active) {
  if (active) {
    favoritesFor(userId).add(movieId);
  } else {
    favoritesFor(userId).delete(movieId);
  }
}
