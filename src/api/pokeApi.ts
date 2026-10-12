import type { PokemonDetail, PokemonPage, PokemonRef, SearchResponse, TypeDetail, TypeList } from './types';
import { pokemonIdFromUrl } from '../utils/pokemon';

const REST = 'https://pokeapi.co/api/v2';
const SEARCH = 'https://beta.pokeapi.co/graphql/v1beta';
export const PAGE_SIZE = 20;
const MAX_DETAIL_REQUESTS = 6;
let activeDetailRequests = 0;
const waitingDetailRequests: (() => void)[] = [];

function limitedDetailRequest<T>(task: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const run = async () => {
      activeDetailRequests += 1;
      try { resolve(await task()); }
      catch (error) { reject(error); }
      finally { activeDetailRequests -= 1; waitingDetailRequests.shift()?.(); }
    };
    if (activeDetailRequests < MAX_DETAIL_REQUESTS) void run();
    else waitingDetailRequests.push(() => { void run(); });
  });
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${REST}${path}`, { signal });
  if (!response.ok) throw new Error(`PokéAPI request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export async function getPokemonPage(page: number, signal?: AbortSignal) {
  const offset = page * PAGE_SIZE;
  const data = await getJson<PokemonPage>(`/pokemon?limit=${PAGE_SIZE}&offset=${offset}`, signal);
  return {
    items: data.results.flatMap((item): PokemonRef[] => {
      const id = pokemonIdFromUrl(item.url);
      return id ? [{ id, name: item.name }] : [];
    }),
    nextPage: offset + PAGE_SIZE < data.count ? page + 1 : undefined,
  };
}

export function getPokemonDetail(idOrName: number | string, signal?: AbortSignal) {
  // The list only asks for rendered cards. This queue also caps simultaneous detail fetches.
  return limitedDetailRequest(() => getJson<PokemonDetail>(`/pokemon/${encodeURIComponent(String(idOrName).toLowerCase())}`, signal));
}

export function getTypes(signal?: AbortSignal) {
  return getJson<TypeList>('/type', signal).then((data) =>
    data.results.filter((type) => type.name !== 'unknown' && type.name !== 'shadow'));
}

export function getTypePokemon(type: string, signal?: AbortSignal) {
  return getJson<TypeDetail>(`/type/${encodeURIComponent(type)}`, signal).then((data) =>
    data.pokemon.flatMap(({ pokemon }): PokemonRef[] => {
      const id = pokemonIdFromUrl(pokemon.url);
      return id ? [{ id, name: pokemon.name }] : [];
    }));
}

// PokéAPI REST has no partial-name filter. Its public GraphQL endpoint searches on the server.
export async function searchPokemon(term: string, page: number, signal?: AbortSignal) {
  const response = await fetch(SEARCH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      query: `query SearchPokemon($pattern: String!, $limit: Int!, $offset: Int!) {
        pokemon_v2_pokemon(where: {name: {_ilike: $pattern}}, order_by: {id: asc}, limit: $limit, offset: $offset) { id name }
      }`,
      variables: { pattern: `%${term.trim().replace(/[^a-z0-9-]/gi, '')}%`, limit: PAGE_SIZE + 1, offset: page * PAGE_SIZE },
    }),
  });
  if (!response.ok) throw new Error(`PokéAPI search failed (${response.status})`);
  const result = await response.json() as SearchResponse;
  if (result.errors?.length || !result.data?.pokemon_v2_pokemon) throw new Error('PokéAPI search failed');
  const items = result.data.pokemon_v2_pokemon;
  return { items: items.slice(0, PAGE_SIZE), nextPage: items.length > PAGE_SIZE ? page + 1 : undefined };
}
