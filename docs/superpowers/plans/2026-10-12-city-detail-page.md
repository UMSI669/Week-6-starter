# City Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Expo Router navigation from weather-city cards to a focused page that shows current temperature, daily high/low, humidity, rain chance, and wind speed.

**Architecture:** Expo Router owns the stack and loads the Redux Provider in `src/app/_layout.js`. The current dashboard moves to `src/app/index.js` and uses `router.push` for city navigation. The dynamic route reads the city ID, looks up mock data, and displays metrics without duplicating weather records in Redux.

**Tech Stack:** Expo SDK 57, Expo Router, React Native, Redux Toolkit, React Redux, Jest via jest-expo.

**Spec:** `docs/superpowers/specs/2026-10-12-city-detail-design.md`

## Global Constraints

- Use Expo Router; routes live under `src/app/`.
- The detail page displays current temperature, high, low, humidity, rain chance, and wind speed only.
- Mock city data remains local; Redux holds favorites and recently viewed city IDs only.
- Opening a city dispatches `addRecentlyViewed(cityId)` before navigation.
- An unknown city ID renders a not-found state.
- Do not add live API calls, hourly forecasts, persistence, or preferences.

---

## File Structure

- `package.json` — Expo Router entry point and SDK-compatible route dependencies.
- `app.json` — enables the Expo Router plugin.
- `src/app/_layout.js` — Redux Provider and stack configuration.
- `src/app/index.js` — Explore/Favorites dashboard moved out of the root app entry.
- `src/app/city/[cityId].js` — focused city weather detail route.
- `src/components/CityCard.js` — reusable browse/favorites card that invokes an `onPress` callback.
- `src/data/weatherCities.js` — city records with `rainChance` and lookup helper.
- `src/data/weatherCities.test.js` — city lookup and saved-list behavior tests.

### Task 1: Configure Expo Router

**Files:**
- Modify: `package.json`
- Modify: `app.json`
- Create: `src/app/_layout.js`

**Interfaces:**
- Produces: an Expo Router root with `Stack`, `Provider`, and a default `index` route.

- [ ] **Step 1: Install SDK-compatible router dependencies**

Run:

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

- [ ] **Step 2: Configure the Expo Router entry and plugin**

Set `package.json` to:

```json
{ "main": "expo-router/entry" }
```

In `app.json`, add `"scheme": "weatherly"`, set `"experiments": { "typedRoutes": true }`, and set `"web": { "bundler": "metro", "favicon": "./assets/favicon.png" }`.

- [ ] **Step 3: Create the root route layout**

```javascript
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
```

- [ ] **Step 4: Run the web export to verify route configuration**

Run:

```bash
npx expo export --platform web
```

Expected: PASS without an entry-point or router-plugin error.

### Task 2: Extend and test city detail data

**Files:**
- Modify: `src/data/weatherCities.js`
- Modify: `src/data/weatherCities.test.js`

**Interfaces:**
- Produces: each city has a numeric `rainChance`; `getCityById(cityId)` returns its city record or `undefined`.

- [ ] **Step 1: Write a failing lookup test**

```javascript
import { getCityById } from './weatherCities';

test('getCityById returns weather data for known IDs and undefined for unknown IDs', () => {
  expect(getCityById('ann-arbor')).toMatchObject({
    id: 'ann-arbor',
    humidity: expect.any(Number),
    rainChance: expect.any(Number),
    wind: expect.any(Number),
  });
  expect(getCityById('missing')).toBeUndefined();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- src/data/weatherCities.test.js --watchAll=false
```

Expected: FAIL because `rainChance` is absent from city data.

- [ ] **Step 3: Add rain chance to each mock city record**

Add values such as `rainChance: 18` to each city object. Keep `getCityById` as the route lookup interface.

- [ ] **Step 4: Run the data tests to verify they pass**

Run:

```bash
npm test -- src/data/weatherCities.test.js --watchAll=false
```

Expected: PASS.

### Task 3: Move the dashboard to the index route and navigate from cards

**Files:**
- Create: `src/components/CityCard.js`
- Create: `src/app/index.js`
- Modify: `App.js` (remove the legacy root component)

**Interfaces:**
- Consumes: `router.push({ pathname: '/city/[cityId]', params: { cityId } })`, `addRecentlyViewed`, and `toggleFavorite`.
- Produces: Explore and Favorites lists whose city cards navigate to their city-detail route.

- [ ] **Step 1: Extract CityCard with an explicit navigation callback**

```javascript
export default function CityCard({ city, isFavorite, onOpen, onToggleFavorite }) {
  return (
    <Pressable onPress={() => onOpen(city.id)}>
      <Text>{city.name}</Text>
      <Text>{city.temperature}°</Text>
      <Pressable onPress={() => onToggleFavorite(city.id)}>
        <Text>{isFavorite ? '♥' : '♡'}</Text>
      </Pressable>
    </Pressable>
  );
}
```

- [ ] **Step 2: Move the dashboard into `src/app/index.js`**

Use `useRouter` and route on card press:

```javascript
const openCity = (cityId) => {
  dispatch(addRecentlyViewed(cityId));
  router.push({ pathname: '/city/[cityId]', params: { cityId } });
};
```

Keep its existing search, Favorites switch, favorite heart interaction, and recently viewed cards.

- [ ] **Step 3: Remove the obsolete App component**

Delete `App.js`; Expo Router becomes the application entry point through `package.json`.

- [ ] **Step 4: Run all unit tests**

Run:

```bash
npm test -- --watchAll=false
```

Expected: PASS.

### Task 4: Create the focused city detail route

**Files:**
- Create: `src/app/city/[cityId].js`

**Interfaces:**
- Consumes: `useLocalSearchParams`, `router.back`, `getCityById(cityId)`, Redux favorite selectors, and `toggleFavorite`.
- Produces: a city page with temperature, daily range, humidity, rain chance, wind speed, favorite control, and unknown-city state.

- [ ] **Step 1: Read the route parameter and selected record**

```javascript
const { cityId } = useLocalSearchParams();
const city = getCityById(cityId);
```

- [ ] **Step 2: Render the unknown-city state before accessing weather fields**

```javascript
if (!city) {
  return (
    <SafeAreaView>
      <Text>City not found</Text>
      <Pressable onPress={() => router.back()}><Text>Go back</Text></Pressable>
    </SafeAreaView>
  );
}
```

- [ ] **Step 3: Render the city weather metrics and controls**

Use the record’s `temperature`, `high`, `low`, `humidity`, `rainChance`, and `wind` fields. Include a top back button and a heart button dispatching `toggleFavorite(city.id)`.

- [ ] **Step 4: Run full verification**

Run:

```bash
npm test -- --watchAll=false
npx expo lint --no-cache
npx expo export --platform web
```

Expected: all commands PASS.
