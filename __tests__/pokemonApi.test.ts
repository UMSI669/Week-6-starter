import { expect, jest, test } from '@jest/globals';
import { getPokemonPage } from '../src/api/pokeApi';
import { pokemonIdFromUrl } from '../src/utils/pokemon';

test('parses Pokémon IDs from PokéAPI URLs safely', () => {
  expect(pokemonIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  expect(pokemonIdFromUrl('https://pokeapi.co/api/v2/pokemon/0/')).toBeNull();
  expect(pokemonIdFromUrl('https://pokeapi.co/api/v2/type/25/')).toBeNull();
  expect(pokemonIdFromUrl('bad-url')).toBeNull();
});

test('maps a mocked paginated response without fetching details', async () => {
  const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ count: 21, results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }] }),
  } as Response);
  const page = await getPokemonPage(0);
  expect(page.items).toEqual([{ id: 1, name: 'bulbasaur' }]);
  expect(page.nextPage).toBe(1);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  fetchMock.mockRestore();
});
