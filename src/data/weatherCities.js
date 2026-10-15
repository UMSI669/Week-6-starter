export const weatherCities = [
  {
    id: 'ann-arbor',
    name: 'Ann Arbor',
    country: 'United States',
    temperature: 62,
    condition: 'Partly cloudy',
    icon: '⛅',
    high: 67,
    low: 48,
    humidity: 58,
    rainChance: 18,
    wind: 9,
  },
  {
    id: 'detroit',
    name: 'Detroit',
    country: 'United States',
    temperature: 64,
    condition: 'Sunny',
    icon: '☀️',
    high: 69,
    low: 50,
    humidity: 52,
    rainChance: 4,
    wind: 11,
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    temperature: 55,
    condition: 'Light rain',
    icon: '🌦️',
    high: 58,
    low: 46,
    humidity: 77,
    rainChance: 65,
    wind: 14,
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    temperature: 72,
    condition: 'Clear skies',
    icon: '🌤️',
    high: 76,
    low: 63,
    humidity: 64,
    rainChance: 8,
    wind: 7,
  },
];

export function filterCities(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return weatherCities;
  }

  return weatherCities.filter((city) =>
    `${city.name} ${city.country}`.toLowerCase().includes(normalizedQuery),
  );
}

export function getCityById(cityId) {
  return weatherCities.find((city) => city.id === cityId);
}

export function citiesForIds(cityIds) {
  return cityIds.map(getCityById).filter(Boolean);
}
