import { create } from 'zustand';

export const useFallStore = create((set) => ({
  favoriteIds: [],
  visitedIds: [],
  distanceFilter: null,

  // TODO(student): Explain why this update cannot create duplicate IDs.
  addFavorite: (id) =>
    set((state) => ({
      favoriteIds: state.favoriteIds.includes(id)
        ? state.favoriteIds
        : [...state.favoriteIds, id],
    })),
  removeFavorite: (id) =>
    set((state) => ({
      favoriteIds: state.favoriteIds.filter((favoriteId) => favoriteId !== id),
      visitedIds: state.visitedIds.filter((visitedId) => visitedId !== id),
    })),
  toggleFavorite: (id) =>
    set((state) => ({
      favoriteIds: state.favoriteIds.includes(id)
        ? state.favoriteIds.filter((favoriteId) => favoriteId !== id)
        : [...state.favoriteIds, id],
    })),
  setDistanceFilter: (distance) => set({ distanceFilter: distance }),
  markVisited: (id) =>
    set((state) => ({
      visitedIds: state.visitedIds.includes(id)
        ? state.visitedIds
        : [...state.visitedIds, id],
    })),
  markUnvisited: (id) =>
    set((state) => ({
      visitedIds: state.visitedIds.filter((visitedId) => visitedId !== id),
    })),
  toggleVisited: (id) =>
    set((state) => ({
      visitedIds: state.visitedIds.includes(id)
        ? state.visitedIds.filter((visitedId) => visitedId !== id)
        : [...state.visitedIds, id],
    })),
}));
