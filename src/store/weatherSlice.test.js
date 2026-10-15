import reducer, {
  addRecentlyViewed,
  selectFavoriteCityIds,
  selectRecentlyViewedCityIds,
  toggleFavorite,
} from './weatherSlice';

test('toggleFavorite saves then removes a city ID', () => {
  const saved = reducer(undefined, toggleFavorite('ann-arbor'));
  const removed = reducer(saved, toggleFavorite('ann-arbor'));

  expect(selectFavoriteCityIds({ weather: saved })).toEqual(['ann-arbor']);
  expect(selectFavoriteCityIds({ weather: removed })).toEqual([]);
});

test('addRecentlyViewed de-duplicates IDs and moves a revisited city to the front', () => {
  const first = reducer(undefined, addRecentlyViewed('detroit'));
  const second = reducer(first, addRecentlyViewed('ann-arbor'));
  const revisited = reducer(second, addRecentlyViewed('detroit'));

  expect(selectRecentlyViewedCityIds({ weather: revisited })).toEqual([
    'detroit',
    'ann-arbor',
  ]);
});
