const API_KEY = process.env.EXPO_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export async function searchGames(search = "", signal = undefined) {
  if (!API_KEY) throw new Error("Game search is unavailable. Please configure the RAWG API key.");
  const response = await fetch(
    `${BASE_URL}/games?key=${API_KEY}&page_size=20&search=${encodeURIComponent(search)}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  const data = await response.json();
  if (!Array.isArray(data.results)) throw new Error("RAWG returned an unexpected response.");
  return data.results;
}
