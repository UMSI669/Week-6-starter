import type { MovieCategory } from '../../types/movie';

// Each category maps to one of TMDB's built-in movie lists.
export const MOVIE_CATEGORIES: { id: MovieCategory; label: string; path: string }[] = [
  { id: 'popular', label: 'Popular', path: '/movie/popular' },
  { id: 'now_playing', label: 'Now Playing', path: '/movie/now_playing' },
  { id: 'top_rated', label: 'Top Rated', path: '/movie/top_rated' },
  { id: 'upcoming', label: 'Upcoming', path: '/movie/upcoming' },
];

export function categoryLabel(id: MovieCategory): string {
  return MOVIE_CATEGORIES.find((category) => category.id === id)?.label ?? 'Popular';
}
