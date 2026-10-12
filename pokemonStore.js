// Creates a store that React components can access.
import { create } from 'zustand';

export const usePokemonStore = create((set) => ({
  // Stores the names of saved Pokemon.
  favorites: [],

  // Adds a Pokemon to the favorites list if it is not already saved.
  addFavorite: (name) =>
    set((state) => ({
      favorites: state.favorites.includes(name)
        ? state.favorites
        : [...state.favorites, name],
    })),

  // Creates a new array without the Pokemon being removed.
  removeFavorite: (name) =>
    set((state) => ({
      favorites: state.favorites.filter(
        (pokemon) => pokemon !== name
      ),
    })),
}));