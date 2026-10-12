import type { PokemonDetail, PokemonRef } from '../api/types';

export function pokemonIdFromUrl(url: string): number | null {
  const match = /\/pokemon\/(\d+)\/?(?:\?.*)?$/.exec(url);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function formatPokemonName(name: string): string {
  return name.split('-').map((part) => part ? part[0].toUpperCase() + part.slice(1) : '').join(' ');
}

export function normalizePokemonSearch(value: string): string {
  return value.trim().toLowerCase().replace(/[.\s]+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function pokemonArtwork(pokemon?: PokemonDetail): string | null {
  return pokemon?.sprites?.other?.['official-artwork']?.front_default
    ?? pokemon?.sprites?.front_default ?? null;
}

export function fallbackPokemon(id: number): PokemonRef {
  return { id, name: `Pokémon #${id}` };
}
