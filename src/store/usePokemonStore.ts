import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Collection = {
  id: string;
  name: string;
  description?: string;
  theme?: string;
  pokemonIds: number[];
  createdAt: string;
  updatedAt: string;
};

type CollectionInput = Pick<Collection, 'name'> & Partial<Pick<Collection, 'description' | 'theme'>>;
type CollectionUpdates = Partial<Pick<Collection, 'name' | 'description' | 'theme'>>;

export type PokemonClientState = {
  hydrated: boolean;
  favoritePokemonIds: number[];
  collections: Collection[];
  setHydrated: (hydrated: boolean) => void;
  toggleFavorite: (pokemonId: number) => void;
  createCollection: (input: CollectionInput, initialPokemonId?: number) => string;
  updateCollection: (collectionId: string, updates: CollectionUpdates) => void;
  deleteCollection: (collectionId: string) => void;
  addPokemonToCollection: (collectionId: string, pokemonId: number) => void;
  removePokemonFromCollection: (collectionId: string, pokemonId: number) => void;
};

function validName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Collection name is required');
  return trimmed;
}

function validId(id: number): boolean { return Number.isSafeInteger(id) && id > 0; }

function makeId(): string { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }

// TODO(SI 669): Explain why Zustand stores only favorites, collection metadata, and Pokémon IDs.
export const usePokemonStore = create<PokemonClientState>()(persist((set, get) => ({
  hydrated: false,
  favoritePokemonIds: [],
  collections: [],
  setHydrated: (hydrated) => set({ hydrated }),
  toggleFavorite: (pokemonId) => {
    if (!validId(pokemonId)) return;
    set((state) => ({ favoritePokemonIds: state.favoritePokemonIds.includes(pokemonId)
      ? state.favoritePokemonIds.filter((id) => id !== pokemonId)
      : [...state.favoritePokemonIds, pokemonId] }));
  },
  createCollection: (input, initialPokemonId) => {
    const name = validName(input.name);
    const now = new Date().toISOString();
    let id = makeId();
    while (get().collections.some((collection) => collection.id === id)) id = makeId();
    const collection: Collection = {
      id, name, description: input.description?.trim() || undefined,
      theme: input.theme?.trim() || undefined,
      pokemonIds: initialPokemonId && validId(initialPokemonId) ? [initialPokemonId] : [],
      createdAt: now, updatedAt: now,
    };
    // TODO(SI 669): Explain how spreading arrays creates immutable state updates for Zustand subscribers.
    set((state) => ({ collections: [...state.collections, collection] }));
    return id;
  },
  updateCollection: (collectionId, updates) => {
    const name = updates.name === undefined ? undefined : validName(updates.name);
    set((state) => ({ collections: state.collections.map((collection) => collection.id === collectionId
      ? { ...collection, ...updates, ...(name === undefined ? {} : { name }),
        description: updates.description === undefined ? collection.description : updates.description.trim() || undefined,
        theme: updates.theme === undefined ? collection.theme : updates.theme.trim() || undefined,
        updatedAt: new Date().toISOString() }
      : collection) }));
  },
  deleteCollection: (collectionId) => set((state) => ({ collections: state.collections.filter((item) => item.id !== collectionId) })),
  addPokemonToCollection: (collectionId, pokemonId) => {
    if (!validId(pokemonId)) return;
    set((state) => ({ collections: state.collections.map((collection) => {
      // TODO(SI 669): Explain how this membership check prevents duplicate Pokémon IDs.
      if (collection.id !== collectionId || collection.pokemonIds.includes(pokemonId)) return collection;
      return { ...collection, pokemonIds: [...collection.pokemonIds, pokemonId], updatedAt: new Date().toISOString() };
    }) }));
  },
  removePokemonFromCollection: (collectionId, pokemonId) => set((state) => ({ collections: state.collections.map((collection) =>
    collection.id === collectionId && collection.pokemonIds.includes(pokemonId)
      ? { ...collection, pokemonIds: collection.pokemonIds.filter((id) => id !== pokemonId), updatedAt: new Date().toISOString() }
      : collection) })),
}), {
  name: 'si669-pokemon-library', version: 1,
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({ favoritePokemonIds: state.favoritePokemonIds, collections: state.collections }),
  // TODO(SI 669): Explain how persistence rehydrates local state before the library is shown.
  onRehydrateStorage: () => (state) => state?.setHydrated(true),
}));
