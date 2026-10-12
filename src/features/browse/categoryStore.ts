import { create } from 'zustand';
import type { CategoryState } from '../../types/movie';

// The chosen category is user-created client state, so it lives in Zustand.
// The movies for that category are server state and stay in TanStack Query.
export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: 'popular',
  setCategory: (category) => set({ selectedCategory: category }),
}));
