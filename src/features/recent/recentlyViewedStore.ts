import { create } from 'zustand';
import type { RecentlyViewedState } from '../../types/movie';

export const MAX_RECENTLY_VIEWED = 20;

// Shared by the details modal (which records views) and the Recent screen (which lists them).
// Like favorites, it stores IDs only and keeps the newest movie first.
export const useRecentlyViewedStore = create<RecentlyViewedState>((set) => ({
  recentIds: [],
  addRecentlyViewed: (id) => set((state) => ({
    recentIds: [id, ...state.recentIds.filter((recentId) => recentId !== id)].slice(0, MAX_RECENTLY_VIEWED),
  })),
  removeRecentlyViewed: (id) => set((state) => ({
    recentIds: state.recentIds.filter((recentId) => recentId !== id),
  })),
  clearRecentlyViewed: () => set({ recentIds: [] }),
}));
