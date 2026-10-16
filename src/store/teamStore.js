import { create } from 'zustand';

export const MAX_TEAM_SIZE = 6;

export const useTeamStore = create((set, get) => ({
  teamIds: [],
  addPokemon: (id) => {
    const pokemonId = Number(id);
    const { teamIds } = get();
    // TODO(student): Rewrite this explanation in your own words: checking the current length here prevents all screens from adding a seventh member.
    if (!Number.isInteger(pokemonId) || pokemonId < 1 || teamIds.includes(pokemonId) || teamIds.length >= MAX_TEAM_SIZE) {
      return false;
    }

    set({ teamIds: [...teamIds, pokemonId] });
    return true;
  },
  removePokemon: (id) => {
    const pokemonId = Number(id);
    set((state) => ({ teamIds: state.teamIds.filter((teamId) => teamId !== pokemonId) }));
  },
  isOnTeam: (id) => get().teamIds.includes(Number(id)),
}));

// TODO(student): Rewrite this explanation in your own words: the store keeps stable IDs so multiple screens share team choices without copying API records.
