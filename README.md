# Weatherly

Weatherly is an Expo/React Native weather app prototype. Users can browse and search mock city weather, save favorite cities, revisit recently opened cities, and open a focused detail page for a city’s current temperature, high/low, humidity, rain chance, and wind speed.

## API

The intended public API is the [OpenWeather API](https://openweathermap.org/api). This client-side prototype currently uses realistic local mock weather records, so it can run without an API key or network request. The mock-data boundary is in `src/data/weatherCities.js`; it is the future replacement point for OpenWeather requests.

## State Management

### Shared client state: Redux Toolkit

Redux Toolkit manages user-controlled state shared across screens:

- `favoriteCityIds` — cities the user has saved.
- `recentlyViewedCityIds` — de-duplicated cities the user most recently opened.

The Redux store is configured in `src/store/store.js`; reducers and selectors live in `src/store/weatherSlice.js`. `react-redux` connects the Expo Router app to that store through a `Provider` in `src/app/_layout.js`.

### Server state: local mock data for this phase

There is no server-state library or live server state yet, because this version is intentionally client-side only. The app reads a small local weather collection and does not cache or fetch network data. In the OpenWeather phase, a request/cache layer will replace this local source while Redux continues to manage only user-owned state such as favorites and recent views.

## Libraries

| Library | Responsibility |
| --- | --- |
| Expo / React Native | Builds and runs the cross-platform mobile and web app. |
| Expo Router | File-based navigation between the city list and `city/[cityId]` detail page. |
| Redux Toolkit | Creates the favorites and recently viewed shared-state slice. |
| React Redux | Makes the Redux store and selectors available to route components. |
| Jest / jest-expo | Tests Redux behavior and local weather-data helpers. |

## Setup

1. Install Node.js 20 or later.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start Expo with a fresh cache:

   ```bash
   npm start -- --clear
   ```

4. In the Expo terminal, press `w` for the web app, `i` for iOS Simulator, or `a` for Android Emulator. You can also scan the QR code using Expo Go.

## Environment Variables

No environment variable is required for the current mock-data prototype.

When live OpenWeather requests are added, create a root `.env` file with:

```bash
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
```

Only values safe to expose in a mobile client should use the `EXPO_PUBLIC_` prefix. Do not commit `.env`; it is ignored by Git.

## Quality Checks

```bash
npm test -- --watchAll=false
npm run lint
npx expo export --platform web
```
## Design decisions

See `docs/spec.md` for the acceptance checklist. Live weather requires a working key, and native interactions must be checked on a device or emulator.

## Data and attribution

Weather uses metric units (°C, m/s), configured in `src/config/weather.js`. Times use the location's UTC offset and UTC getters, never the device timezone. Weather cache age is two hours, with no polling/focus/reconnect refresh. Pull down the weather view to refresh manually. City search runs only on Search or keyboard submit and reuses query results for an hour. Search results and weather cache are not persisted.

OpenWeather's free tier shares 60 calls/minute and 1,000,000 calls/month across both endpoints. Errors cover inactive/invalid keys, rate limits, connectivity, and other failures; available cached data remains visible.

Pull-to-refresh is native-only, as requested. React Native Web's RefreshControl does not implement the gesture, so web weather refreshes automatically only when viewed with a cache older than two hours.

OpenWeather requires visible **Weather data © OpenWeather** attribution linked to https://openweathermap.org wherever its data appears. The weather footer and city-search results include this reusable link. Keep it visible when modifying these screens.
