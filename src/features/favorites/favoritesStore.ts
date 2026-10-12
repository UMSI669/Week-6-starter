import { create } from 'zustand';
import type { FavoritesState } from '../../types/movie';

// This store is shared by Browse, movie details, and My List while the app is open.
export const useFavoritesStore = create<FavoritesState>((set) => ({
  favoriteIds: [],
  addFavorite: (id) => set((state) => ({
    favoriteIds: state.favoriteIds.includes(id) ? state.favoriteIds : [...state.favoriteIds, id],
  })),
  removeFavorite: (id) => set((state) => ({
    favoriteIds: state.favoriteIds.filter((favoriteId) => favoriteId !== id),
  })),
}));
