# City Detail Page Design

## Goal

Add a dedicated weather detail page for each city so a user can move from the browse or Favorites list to a focused view of that city’s current conditions.

## Navigation

The app will adopt Expo Router, as required by the project instructions. City cards route to `src/app/city/[cityId].js`, passing the selected city ID. The detail page offers a back control to return to the previous list. Opening a city dispatches `addRecentlyViewed(cityId)` before navigating.

## Detail Page

The page displays the selected city’s name, country, weather icon and condition, and current temperature. A daily range card shows high and low temperatures. A compact metrics grid presents humidity, rain chance, and wind speed. Its favorite control dispatches `toggleFavorite(cityId)`, sharing state with both the Explore and Favorites lists.

## Data

The mock weather city records will add `rainChance` values. The existing city lookup returns the selected record. An unknown ID produces a clear not-found state rather than a crash.

## File Boundaries

- `src/app/_layout.js` configures Redux Provider and Expo Router stack navigation.
- `src/app/index.js` hosts the Explore/Favorites dashboard and links city cards to the detail route.
- `src/app/city/[cityId].js` renders the focused city weather page.
- `src/data/weatherCities.js` supplies mock metric data and lookups.
- `src/components/CityCard.js` renders list cards with navigation callbacks.

## Testing and Validation

Tests cover city lookup behavior, including unknown IDs, and retain existing search and Redux state tests. The finished client is validated with Jest, Expo lint, and a web export build.

## Deferred Scope

This change does not add live OpenWeather requests, hourly forecasts, persistence, or non-weather user preferences.
