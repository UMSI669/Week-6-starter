export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
};

// AI-written: Agreed contract: Victor implements it and Ashley consumes it.
export type FavoritesState = {
  favoriteIds: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
};
