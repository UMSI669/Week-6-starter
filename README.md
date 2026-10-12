# Weatherly

JavaScript Expo SDK 57 weather app for iOS, Android, and web. Save named locations, search cities with OpenWeather geocoding, or enter coordinates manually. Redux Toolkit owns saved locations; RTK Query fetches weather and geocoding. redux-persist stores only locations through AsyncStorage (localStorage on web).

## Setup

Use Node.js 22.13 or newer and npm:

```sh
npm ci
cp .env.example .env
```

Set `EXPO_PUBLIC_OPENWEATHER_API_KEY` in `.env` to your OpenWeather key. Restart Expo after changing it. Missing keys show an on-screen setup message and send no requests. New keys may need time to activate.

`EXPO_PUBLIC_` values are bundled into the client and can be read by users. This is acceptable for this local/demo app; it is not a secret-storage mechanism. `.env` is ignored by Git.

## Run

```sh
npx expo start
```

- Web: press **w**, or use `npm run web`.
- Android: use an SDK 57-compatible Expo Go on a physical device, or press **a** with an Android emulator configured. SDK-compatible AsyncStorage is included in Expo Go.
- iOS: press **i** on macOS with a configured simulator. SDK 57 Expo Go is not yet on the iOS App Store; use `npx eas-cli@latest go` for a physical device. For a custom development build, use `npx eas-cli@latest build --profile development` after configuring EAS.

Routes are in `src/app/`, following this project's routing convention. Non-route code lives outside that folder. This project uses JavaScript only and disables generated typed routes.

## Data and attribution

Weather uses metric units (°C, m/s), configured in `src/config/weather.js`. Times use the location's UTC offset and UTC getters, never the device timezone. Weather cache age is two hours, with no polling/focus/reconnect refresh. Pull down the weather view to refresh manually. City search runs only on Search or keyboard submit and reuses query results for an hour. Search results and weather cache are not persisted.

OpenWeather's free tier shares 60 calls/minute and 1,000,000 calls/month across both endpoints. Errors cover inactive/invalid keys, rate limits, connectivity, and other failures; available cached data remains visible.

Pull-to-refresh is native-only, as requested. React Native Web's RefreshControl does not implement the gesture, so web weather refreshes automatically only when viewed with a cache older than two hours.

OpenWeather requires visible **Weather data © OpenWeather** attribution linked to https://openweathermap.org wherever its data appears. The weather footer and city-search results include this reusable link. Keep it visible when modifying these screens.

## Checks

```sh
npx expo lint
npx tsc --noEmit --allowJs --checkJs --strictNullChecks --noImplicitAny false --types node --jsx react-jsx --moduleResolution bundler --module esnext --target es2022 --skipLibCheck src/utils/*.js src/config/weather.js src/features/locations/locationsSlice.js src/services/openWeatherApi.js src/store/index.js src/theme/tokens.js src/components/*.jsx src/components/ui.js src/app/*.jsx
npm test -- --runInBand
```

No new test framework was added; the repository's existing mock-data tests are retained. Validation, coordinates, geocoding labels, unit formatting, wind direction, error messages, and offset time formatting are pure functions under `src/utils/`.

## Design decisions

- The original `src/` dashboard/detail mockup supplies the navy background, blue panels, pale cards, rounded shapes, large light temperature, and bold system typography. Tokens live in `src/theme/`.
- The spec replaces Explore/Favorites/recently viewed and mock records with saved locations and live weather. It requires Celsius/m/s instead of the mockup's Fahrenheit/mph. Rain chance and the invented daily description are omitted; current min/max are labeled “Current range” rather than a daily forecast.
- New consistent UI includes the location dropdown, delete confirmation, add screen/manual form, search result selection, inline validation, loading/error/empty states, extra API metric tiles, location-local timestamps, and visible attribution.
- Assumptions: start with no locations; no migration from the previous in-memory favorites; 24-hour `HH:mm` time with `YYYY-MM-DD` for last updated; missing required metrics show “—”; optional metrics are omitted; system fonts need no new dependency; content is capped at 680 px on wide screens; direct entry to the add route returns to `/` if there is no history. Duplicate locations are allowed.

See `docs/spec.md` for the acceptance checklist. Live weather requires a working key, and native interactions must be checked on a device or emulator.

Validation performed: lint, JavaScript typecheck without a TypeScript config, all six existing tests, Android/iOS bundle exports, live web weather and geocoding, and browser checks with controlled responses for search/fill, manual validation, selection/deletion, persistence, cache reuse, local times, optional-field omission, no-results and rate-limit states. Native device rendering, pull-to-refresh and native external-link opening remain unverified. Two-hour expiry and cached-data errors are configured but have not been observed through a full expiry/refresh cycle.
