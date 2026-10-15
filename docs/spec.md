# Task: Build a weather app (Expo SDK 57, React Native, Redux Toolkit, RTK Query)

You are working on my local machine. Build the app described below. Where this
spec is silent, choose the simplest reasonable option and list every assumption
in your final summary. Do NOT add libraries beyond those listed without asking me.

The UI mockup is already in this project (see §5). Follow it for layout and
visual design. This spec governs behavior and data.

## 1. Tech stack (hard constraints)

- Expo SDK 57 (React Native 0.86, React 19.2). Verify `expo` in package.json is ^57.
- **JavaScript only** (.js/.jsx). No TypeScript. If the scaffold template generates
  TS, convert it and remove TS config.
- Package manager: **npm**. Install Expo-managed packages with `npx expo install`.
- Routing: **expo-router**.
- State: **Redux Toolkit** + `react-redux` for all app-wide state.
- Data fetching: **RTK Query** (mandatory) for all OpenWeather calls (weather AND
  geocoding). No raw fetch/axios in components.
- Persistence: `redux-persist` + `@react-native-async-storage/async-storage`.
- Targets: **iOS, Android, and Web**. Everything must work on all three.
- Tests: do not set up a test framework for now. Keep logic (validation, unit
  formatting, time conversion, geocode result formatting) in pure functions under
  `src/utils/` so tests can be added later.
- Note: Expo Go for SDK 57 is not on the iOS App Store yet. On iOS, use the
  simulator via Expo CLI or `eas go` for a physical device.

## 2. APIs (OpenWeather free tier)

### Shared configuration

- API key: read from `.env` as `EXPO_PUBLIC_OPENWEATHER_API_KEY`. Add `.env` to
  `.gitignore` and commit a `.env.example`. If the key is missing, show a clear
  on-screen message instead of making requests. (Note: EXPO*PUBLIC* values are
  bundled into the client. Acceptable for this local/demo app; mention it in the
  README.)
- Free tier limits: **60 calls/minute and 1,000,000 calls/month, shared across
  the weather and geocoding endpoints.** Exceeding the per-minute limit returns
  HTTP 429.
- Free-tier weather data only updates **every 2 hours**, which is why the cache
  window below is 2 hours.
- Use a single RTK Query API slice (`src/services/openWeatherApi.js`) with base URL
  `https://api.openweathermap.org` and two endpoints:
  `getCurrentWeather` and `searchCities`. Append `appid` in each query.
- Shared error handling with user-friendly messages:
  - 401: invalid key, or the key isn't activated yet (new OpenWeather keys can
    take a while to activate).
  - 429: rate limited, try again in a minute.
  - Network/offline errors.
  - Other errors.
- If cached data exists, keep showing it alongside the error.

### Attribution (required by OpenWeather's license)

- OpenWeather's free plan requires visible attribution wherever its data is shown.
  Create a reusable `<OpenWeatherAttribution />` component that renders
  **"Weather data © OpenWeather"**. Make it a link to https://openweathermap.org,
  opened with `expo-linking` / `Linking.openURL` so it works on web and native.
- It must be **visible** on screen: on the weather screen (a small footer under
  the weather data, also shown in error states that display cached data) and on
  the add-location screen below the search results.
- Do not hide it in a menu, About page, or README only. It must be legible.
- This is required even if the mockup doesn't show it. Style it to fit the
  mockup.

### 2a. Current weather

`GET /data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric`

- [DEFAULT] `units=metric` → °C, wind in m/s. Put units in one constant so it is
  easy to change.

Caching / refresh rules:

- Cached data is valid for **2 hours**. Set `keepUnusedDataFor: 7200` on this
  endpoint. Use `refetchOnMountOrArgChange: 7200` so data older than 2 hours is
  refetched when viewed again.
- **No polling, no refetchOnFocus, no refetchOnReconnect.** The only manual
  refresh is **pull-to-refresh** (`RefreshControl`) calling `refetch()`.
- Do not trigger a refetch while one is already in flight for that location.

Example response:

```json
{
  "coord": { "lon": 10.99, "lat": 44.34 },
  "weather": [
    { "id": 501, "main": "Rain", "description": "moderate rain", "icon": "10d" }
  ],
  "base": "stations",
  "main": {
    "temp": 298.48,
    "feels_like": 298.74,
    "temp_min": 297.56,
    "temp_max": 300.05,
    "pressure": 1015,
    "humidity": 64,
    "sea_level": 1015,
    "grnd_level": 933
  },
  "visibility": 10000,
  "wind": { "speed": 0.62, "deg": 349, "gust": 1.18 },
  "rain": { "1h": 3.16 },
  "clouds": { "all": 100 },
  "dt": 1661870592,
  "sys": {
    "type": 2,
    "id": 2075663,
    "country": "IT",
    "sunrise": 1661834187,
    "sunset": 1661882248
  },
  "timezone": 7200,
  "id": 3163858,
  "name": "Zocca",
  "cod": 200
}
```

(This example is in Kelvin because it was fetched without `units`. Our requests
use `units=metric`.)

Data to display (only what the API provides; arrange per the mockup):

- **Condition:** `weather[0].main` and `weather[0].description`. [DEFAULT] Icon
  from `https://openweathermap.org/img/wn/{icon}@2x.png`.
- **Temperature:** temp, feels_like, temp_min, temp_max.
- **Atmosphere:** humidity (%), pressure (hPa), sea_level and grnd_level
  (hPa, if present).
- **Wind:** speed, direction (convert `deg` to a compass label, e.g. "NNW"), and
  gust (if present).
- **Visibility:** in km (API max is 10 km).
- **Clouds:** cloud cover (%).
- **Precipitation:** `rain["1h"]` and/or `snow["1h"]` in mm. **Only render if
  present.** These keys are omitted when there is no precipitation.
- **Times:** sunrise, sunset, and "last updated" (`dt`).
  - [DEFAULT] Display in the **location's local time** using the `timezone`
    offset (seconds from UTC).
  - Compute as `new Date((unix + timezone) * 1000)` and format with the UTC getters.
  - Do NOT use the device timezone, and do not rely on `toLocaleString` with
    `timeZone` (we only have an offset, not an IANA zone). Must behave
    identically on web and native.
- **Header:** the user's saved location name, plus the API's `name, country` as
  secondary text.
- Treat every nested field as optional. Never crash on a missing key.
- If the mockup shows a field the API doesn't provide, leave it out and note it
  in the summary.

### 2b. Geocoding (city search)

`GET /geo/1.0/direct?q={query}&limit=5&appid={API_KEY}`

- `q` accepts "city", "city,country code", or "city,state code,country code"
  (state codes are US only). URL-encode the query.

Example response (an array; it may be empty):

```json
[
  {
    "name": "Ann Arbor",
    "local_names": { "en": "Ann Arbor" },
    "lat": 42.2681569,
    "lon": -83.7312291,
    "country": "US",
    "state": "Michigan"
  }
]
```

- `state` and `local_names` are optional.

Search behavior:

- [DEFAULT] Use the **lazy** query hook (`useLazySearchCitiesQuery`). Search runs
  ONLY when the user presses a **Search** button or submits the input. **No
  search-as-you-type.** Both endpoints share the 60 calls/minute quota.
- Trim the query. Don't search if it is shorter than 2 characters.
- Disable the Search button while a request is in flight.
- Results are not persisted. Set `keepUnusedDataFor: 3600` on this endpoint so
  repeating the same search within an hour reuses the cache.
- An empty array is not an error. Show "No matching places. Try adding a country
  code (e.g. 'Paris,FR') or enter coordinates manually."

## 3. State (Redux)

`locations` slice shape:

```js
{ items: [{ id, name, lat, lon }], selectedId: string | null }
```

- `lat` and `lon` are stored as numbers. Generate `id` with RTK's `nanoid` in a
  `prepare` callback.
- `addLocation` adds the item **and** sets `selectedId` to it in the SAME reducer.
- `deleteLocation(id)` removes the item in the SAME reducer.
  - If it was the selected one, set `selectedId` to the first remaining item's
    id, or `null` if none remain.
  - Deleting a non-selected item leaves the selection unchanged.
- `selectLocation(id)` sets `selectedId`.
- Duplicate names/coordinates are allowed. No duplicate checks.
- Search input and results are local component state plus the RTK Query cache.
  They do NOT go into the `locations` slice and are NOT persisted.

### Persistence & race conditions

- Persist ONLY the `locations` slice (items + selectedId) with redux-persist +
  AsyncStorage. **Blacklist the RTK Query reducer** (`openWeatherApi.reducerPath`).
- Wrap the app in `<Provider>` + `<PersistGate>` in `app/_layout.jsx`. Render a
  simple loading view until rehydration finishes.
- Selection logic, empty state, and API calls must not run before rehydration.
- Never write to AsyncStorage directly from components. All writes go through
  Redux actions so redux-persist serializes them.
- Do not split "add then select" or "delete then reselect" into separate
  dispatches.
- Configure the serializableCheck middleware to ignore redux-persist actions
  (FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER). Add the RTK Query
  middleware.
- AsyncStorage must work on web too (it uses localStorage there). Verify.

## 4. Screens (expo-router)

### `app/index.jsx` — Weather screen

- Location dropdown at the top. Build it in-house with RN `Modal` + `FlatList`
  so it behaves the same on iOS, Android, and Web. No third-party picker.
  - Each row shows the location name and an **X** delete button.
  - Tapping a row selects it. Tapping X opens the delete confirmation.
  - The X tap must not also trigger row selection.
- **Delete confirmation:** a custom confirmation modal ("Delete {name}?" with
  Cancel / Delete). Do NOT use `Alert.alert`, because it doesn't work on web.
  Style the Delete button as a destructive action, following the mockup if it
  shows one.
- An **"Add location"** button that navigates to the add screen.
- Weather data for the selected location, in a ScrollView with pull-to-refresh.
- Loading state on first load and error states as described in §2.
- `<OpenWeatherAttribution />` visible below the weather data.
- **Empty state** (no saved locations): a message plus a prominent
  "Add location" button. No attribution is needed here, since no data is shown.

### `app/add-location.jsx` — Add location screen

Layout follows the mockup. If the mockup doesn't include the city search, put it
above the manual form.

**1. City search** (`src/components/CitySearch.jsx`)

- A text input ("Search city, e.g. Ann Arbor,MI,US") and a **Search** button.
- Show a loading indicator while searching, then up to 5 results as tappable rows.
- Each row is labeled using a pure function
  `formatGeocodeLabel(result)` → `"Name, State, Country"`, omitting `state`
  when absent.
- Also show the coordinates on each row, small, so users can tell same-named
  places apart.
- Show the empty-results message and errors per §2.
- `<OpenWeatherAttribution />` sits below the results list whenever results
  are shown.
- Tapping a result fills the form below:
  - Name = the formatted label.
  - [DEFAULT] Latitude/Longitude = rounded to **4 decimal places**, written into
    the inputs as strings.
  - Visually mark the tapped row as chosen.
  - Do NOT save automatically. The user reviews and taps Save.

**2. Manual form** (always visible; this is the fallback)

- Form fields: Name, Latitude, Longitude. Use the **default keyboard** for all
  fields. All fields stay editable after a search fills them.
- Validation (pure function in `src/utils/validateLocation.js`), applied
  identically whether values were typed or filled by search:
  - Name: required after trim.
  - Latitude: a valid finite number between -90 and 90.
  - Longitude: a valid finite number between -180 and 180.
  - Accept negatives and decimals. Reject empty input, NaN, and trailing junk
    like "12abc". Use `Number()`, not `parseFloat`.
- Show inline error text under each invalid field after it is touched or on
  submit. The Save button submits; Cancel/back returns without saving.
- On valid save, dispatch `addLocation` (which auto-selects), then
  `router.back()` to the weather screen. The new location's weather loads
  immediately.
- No device geolocation (no `expo-location`).

## 5. Design (follow the mockup in the project)

### Finding the mockup

- The mockup is currently occupy the src/ directory. If that path is empty or wrong, search the
  repo for it (images, Figma exports, HTML, or design notes). If you can't find
  it, **stop and ask me** before building any UI.
- Before writing UI code, open the mockup and summarize its screens, components,
  colors, and typography. Use that summary as your reference.

### Rules

- The mockup is the source of truth for layout, colors, typography, spacing, and
  component styling.
- This spec is the source of truth for behavior and data.
- If they conflict (e.g. the mockup shows data the API doesn't provide, or omits
  a required element like attribution), follow this spec and note the conflict
  in your summary.
- Centralize all colors, fonts, and spacing taken from the mockup in
  `src/theme/` as named tokens. No hard-coded hex values in components.
- For anything the mockup doesn't show (loading, error, empty states, delete
  modal, search results, inline validation errors), design it to look
  consistent with the mockup. List each such invented element in your summary.

## 6. Project structure (suggested)

```
app/_layout.jsx          Provider, PersistGate, Stack
app/index.jsx            Weather screen
app/add-location.jsx     Add location screen (search + manual form)
src/store/index.js       configureStore + persistor
src/features/locations/locationsSlice.js
src/services/openWeatherApi.js   getCurrentWeather + searchCities
src/components/          LocationDropdown, ConfirmModal, WeatherDetails, EmptyState,
                         CitySearch, OpenWeatherAttribution, etc.
src/theme/               tokens extracted from the mockup
src/utils/               validateLocation, formatLocalTime, windDirection,
                         formatGeocodeLabel
```

## 7. Done criteria

Run `npx expo start` and verify each of these on **web** and at least one
**mobile** target:

1. Search "Ann Arbor", tap a result → the form fills with name and 4-decimal
   coordinates. Save → app returns to the weather screen with it selected and
   its weather shown.
2. Manual entry still works with no search. Validation rejects bad input and
   accepts negatives and decimals.
3. A search with no matches shows the empty message, not an error. Search
   requests are sent only on button press or submit.
4. Deleting the selected location (after confirming) selects the first
   remaining location. Deleting the last one shows the empty state.
5. Reloading the app keeps saved locations and the selection. Search results
   are not persisted.
6. Pull-to-refresh refetches. Revisiting a location within 2 hours uses the
   cache with no new network call.
7. Optional fields (rain/snow/gust/sea_level, geocode `state`) don't break
   rendering when absent.
8. "Weather data © OpenWeather" is visible on the weather screen and under the
   search results, and the link opens on web and native.
9. Both screens visually match the mockup.

Also:

- Write a short README covering setup, `.env`, how to run on each platform, and
  the OpenWeather attribution requirement.
- Final summary: list what you built, any assumptions you made, mockup/spec
  conflicts, UI elements you designed that the mockup didn't show, and anything
  you could not verify.
