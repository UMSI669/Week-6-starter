import { citiesForIds, filterCities, getCityById } from './weatherCities';

test('filterCities matches a city regardless of letter case', () => {
  expect(filterCities('DETROIT').map((city) => city.id)).toEqual(['detroit']);
});

test('filterCities matches a country and returns all cities for an empty query', () => {
  expect(filterCities('United States').map((city) => city.id)).toEqual([
    'ann-arbor',
    'detroit',
  ]);
  expect(filterCities('').length).toBeGreaterThan(2);
});

test('citiesForIds preserves the saved-city order and ignores missing IDs', () => {
  expect(citiesForIds(['tokyo', 'missing', 'detroit']).map((city) => city.id)).toEqual([
    'tokyo',
    'detroit',
  ]);
});

test('getCityById returns weather metrics for known IDs and undefined for unknown IDs', () => {
  expect(getCityById('ann-arbor')).toMatchObject({
    id: 'ann-arbor',
    humidity: expect.any(Number),
    rainChance: expect.any(Number),
    wind: expect.any(Number),
  });
  expect(getCityById('missing')).toBeUndefined();
});
