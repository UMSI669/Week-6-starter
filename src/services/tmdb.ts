import { MOVIE_CATEGORIES } from '../features/browse/categories';
import type { Movie, MovieCategory, MovieDetails } from '../types/movie';

const API_BASE = 'https://api.themoviedb.org/3';
const READ_ACCESS_TOKEN = process.env.EXPO_PUBLIC_TMDB_READ_ACCESS_TOKEN?.trim();
const API_KEY_OR_TOKEN = process.env.EXPO_PUBLIC_TMDB_API_KEY?.trim();

type MoviePage = { results: Movie[] };

async function request<T>(path: string, params: Record<string, string> = {}, signal?: AbortSignal): Promise<T> {
  const credential = READ_ACCESS_TOKEN || API_KEY_OR_TOKEN;
  if (!credential) {
    throw new Error('TMDB credential missing. Add a v3 API key or API Read Access Token to .env and restart Expo.');
  }

  // TMDB accepts a v3 key as api_key or an API Read Access Token as a Bearer header.
  // Detect JWTs in the original env variable so an existing .env works without changes.
  const useBearerToken = Boolean(READ_ACCESS_TOKEN) || (credential.startsWith('eyJ') && credential.includes('.'));
  const query = new URLSearchParams({ language: 'en-US', ...params });
  if (!useBearerToken) query.set('api_key', credential);
  const response = await fetch(`${API_BASE}${path}?${query}`, {
    signal,
    headers: useBearerToken ? { Authorization: `Bearer ${credential}` } : undefined,
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error('TMDB rejected the credential. Check your .env value and restart Expo.');
    if (response.status === 429) throw new Error('TMDB is receiving too many requests. Please try again shortly.');
    throw new Error(`TMDB request failed (${response.status}). Please try again.`);
  }
  return response.json() as Promise<T>;
}

export function getMovies(search: string, category: MovieCategory, signal?: AbortSignal): Promise<MoviePage> {
  const query = search.trim();
  if (query) return request<MoviePage>('/search/movie', { query, include_adult: 'false' }, signal);
  // With no search text, show the TMDB list for the selected category.
  const path = MOVIE_CATEGORIES.find((item) => item.id === category)?.path ?? '/movie/popular';
  return request<MoviePage>(path, {}, signal);
}

export function getMovieDetails(id: number, signal?: AbortSignal): Promise<MovieDetails> {
  // One details request also returns cast and videos via TMDB's append_to_response feature.
  return request<MovieDetails>(`/movie/${id}`, { append_to_response: 'credits,videos' }, signal);
}

export function posterUrl(path: string | null): string | undefined {
  return path ? `https://image.tmdb.org/t/p/w342${path}` : undefined;
}
