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
