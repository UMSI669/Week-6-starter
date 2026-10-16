import { create } from "zustand";

export const useBuildStore = create((set) => ({
  savedBuilds: [],

  // Save a build without adding duplicates
  addBuild: (build) =>
    set((state) => {
      const exists = state.savedBuilds.some(
        (item) => item.id === build.id
      );

      if (exists) return state;

      return {
        savedBuilds: [...state.savedBuilds, build],
      };
    }),

  // Remove a saved build
  removeBuild: (id) =>
    set((state) => ({
      savedBuilds: state.savedBuilds.filter(
        (build) => build.id !== id
      ),
    })),

  // Update a saved build
  updateBuild: (id, changes) =>
    set((state) => ({
      savedBuilds: state.savedBuilds.map((build) =>
        build.id === id ? { ...build, ...changes } : build
      ),
    })),
}));