# Client-Side Weather App Design

## Goal

Build an Expo React Native weather prototype that lets a user browse and search realistic city weather data, inspect details, and maintain shared client-side state with Redux Toolkit. The app runs without an OpenWeather API key in this phase.

## Architecture

- `App` configures the Redux Provider and stack navigation.
- A weather data service exposes a small collection of realistic mock city records. Screens access records through this service rather than importing raw data.
- Redux Toolkit holds only user-controlled, shared state: favorite city IDs and an ordered, de-duplicated recently viewed city list.
- Weather records and the current search query remain local/read-only client data.

## Screens and Interactions

### Explore

The default screen shows a search field and browseable city weather cards. Search filters city name and country locally. Selecting a card navigates to City Details and records that city as recently viewed.

### City Details

This screen displays city, country, condition, temperature, high/low, humidity, wind, and a concise description. A save control toggles the city in the Redux favorites collection.

### Favorites

This screen reads directly from Redux and renders saved cities using the same visual card language. It includes an empty state and supports removing a favorite. Changes are immediately visible throughout the app.

## Data Flow

1. Explore retrieves city records from the weather service and locally filters them by the search query.
2. Opening a city dispatches `addRecentlyViewed(cityId)` and navigates with the city ID.
3. Saving/removing dispatches `toggleFavorite(cityId)`.
4. Favorites and detail views select the current Redux state, ensuring a shared view of user actions.

## Error and Empty States

The mock client includes an explicit no-results state for unmatched searches and a helpful empty-favorites state. The service boundary allows a future OpenWeather implementation to introduce loading and request-error states without changing screen responsibilities.

## Testing

Reducer tests will cover adding/removing favorites and adding/reordering/de-duplicating recently viewed cities. The app will also be checked with the project’s available Expo/JavaScript validation commands after scaffolding.

## Deferred Scope

- Live OpenWeather requests, API-key configuration, loading, and network errors
- Device persistence across app restarts
- Forecast charts, alerts, units/preferences, and authentication
