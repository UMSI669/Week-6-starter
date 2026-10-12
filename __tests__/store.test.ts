import { beforeEach, expect, test } from '@jest/globals';
import { usePokemonStore } from '../src/store/usePokemonStore';

beforeEach(() => {
  usePokemonStore.setState({ favoritePokemonIds: [], collections: [], hydrated: true });
});

test('favorites can be added and removed', () => {
  usePokemonStore.getState().toggleFavorite(25);
  expect(usePokemonStore.getState().favoritePokemonIds).toEqual([25]);
  usePokemonStore.getState().toggleFavorite(25);
  expect(usePokemonStore.getState().favoritePokemonIds).toEqual([]);
});

test('creates a trimmed collection with an initial Pokémon', () => {
  const id = usePokemonStore.getState().createCollection({ name: '  Water Team  ', theme: '  Water  ' }, 7);
  expect(usePokemonStore.getState().collections).toEqual([expect.objectContaining({ id, name: 'Water Team', theme: 'Water', pokemonIds: [7] })]);
});

test('rejects a blank collection name', () => {
  expect(() => usePokemonStore.getState().createCollection({ name: '   ' })).toThrow('Collection name is required');
  expect(usePokemonStore.getState().collections).toHaveLength(0);
});

test('prevents duplicate membership and removes a Pokémon', () => {
  const id = usePokemonStore.getState().createCollection({ name: 'Team' }, 25);
  usePokemonStore.getState().addPokemonToCollection(id, 25);
  expect(usePokemonStore.getState().collections[0].pokemonIds).toEqual([25]);
  usePokemonStore.getState().removePokemonFromCollection(id, 25);
  expect(usePokemonStore.getState().collections[0].pokemonIds).toEqual([]);
});

test('deletes a collection', () => {
  const id = usePokemonStore.getState().createCollection({ name: 'Temporary' });
  usePokemonStore.getState().deleteCollection(id);
  expect(usePokemonStore.getState().collections).toEqual([]);
});
