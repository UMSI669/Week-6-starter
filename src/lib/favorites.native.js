import { getDatabase } from './database';

export async function getFavoriteIds(userId) {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    'SELECT movie_id FROM user_favorites WHERE user_id = ?',
    userId
  );
  return rows.map((row) => row.movie_id);
}

export async function saveFavorite(userId, movieId, active) {
  const db = await getDatabase();
  if (active) {
    await db.runAsync(
      'INSERT OR IGNORE INTO user_favorites (user_id, movie_id) VALUES (?, ?)',
      userId,
      movieId
    );
  } else {
    await db.runAsync(
      'DELETE FROM user_favorites WHERE user_id = ? AND movie_id = ?',
      userId,
      movieId
    );
  }
}
