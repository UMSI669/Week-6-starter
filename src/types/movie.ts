export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  overview?: string;
};

export type MovieDetails = Movie & {
  overview: string;
  runtime: number | null;
  credits: { cast: { id: number; name: string; character: string }[] };
  videos: { results: { id: string; key: string; name: string; site: string; type: string }[] };
};

// User-created state contains IDs only; TMDB data stays in TanStack Query's cache.
export type FavoritesState = {
  favoriteIds: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
};

export type MovieCategory = 'popular' | 'now_playing' | 'top_rated' | 'upcoming';

export type CategoryState = {
  selectedCategory: MovieCategory;
  setCategory: (category: MovieCategory) => void;
};

export type RecentlyViewedState = {
  recentIds: number[];
  addRecentlyViewed: (id: number) => void;
  removeRecentlyViewed: (id: number) => void;
  clearRecentlyViewed: () => void;
};
