const API_ROOT = 'https://pokeapi.co/api/v2/pokemon/';

export class PokemonApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'PokemonApiError';
    this.status = status;
  }
}

export async function fetchPokemon(identifier) {
  const safeIdentifier = encodeURIComponent(String(identifier).trim().toLowerCase());
  const response = await fetch(`${API_ROOT}${safeIdentifier}`);

  // TODO(student): Rewrite this explanation in your own words: response.ok lets us distinguish valid API responses from HTTP failures.
  if (!response.ok) {
    if (response.status === 404) {
      throw new PokemonApiError('No Pokémon found with that name or number.', 404);
    }
    throw new PokemonApiError('PokéAPI could not complete the request. Please try again.', response.status);
  }

  return response.json();
}

export function getPokemonArtwork(pokemon) {
  return pokemon?.sprites?.other?.['official-artwork']?.front_default
    || pokemon?.sprites?.front_default
    || null;
}

export function getPokemonSprite(pokemon) {
  return pokemon?.sprites?.front_default || null;
}

export function formatPokemonId(id) {
  return `#${String(id).padStart(3, '0')}`;
}
