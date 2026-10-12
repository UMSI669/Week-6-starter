import { expect, jest, test } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render } from '@testing-library/react-native';
import { PokemonCard } from '../src/components/PokemonCard';
import { usePokemonStore } from '../src/store/usePokemonStore';

test('heart control changes its accessible action when favorited', async () => {
  usePokemonStore.setState({ favoritePokemonIds: [], collections: [], hydrated: true });
  const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ id: 1, name: 'bulbasaur', sprites: {}, types: [] }),
  } as Response);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const screen = await render(<QueryClientProvider client={client}>
    <PokemonCard pokemon={{ id: 1, name: 'bulbasaur' }} onCollectionPress={() => undefined} />
  </QueryClientProvider>);
  await fireEvent.press(screen.getByLabelText('Add Bulbasaur to favorites'));
  expect(screen.getByLabelText('Remove Bulbasaur from favorites')).toBeTruthy();
  expect(usePokemonStore.getState().favoritePokemonIds).toEqual([1]);
  await screen.unmount();
  client.clear();
  fetchMock.mockRestore();
});
