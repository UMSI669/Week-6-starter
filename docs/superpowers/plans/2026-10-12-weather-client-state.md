# Weather Client State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the Redux Toolkit client-state foundation for an Expo weather app: saved favorite cities and ordered recently viewed cities.

**Architecture:** A dedicated `weatherSlice` owns only user-controlled, shared state. It uses city ID strings rather than duplicating weather data. A store module exposes the configured Redux store, and small selector functions allow future screens to read favorites and recently viewed IDs without knowing the slice shape.

**Tech Stack:** Expo React Native, JavaScript, Redux Toolkit, React Redux, Jest via Expo.

**Spec:** `docs/superpowers/specs/2026-10-12-weather-client-design.md`

## Global Constraints

- The first client-side version runs without an OpenWeather API key.
- Redux Toolkit stores only favorites and a de-duplicated, ordered recently viewed city list.
- Weather records and the current search query do not belong in Redux.
- Recently viewed items move to the front when opened again.
- No live API calls, persistence, preferences, forecast charts, alerts, or authentication are included.

---

## File Structure

- `package.json` — Expo dependencies and test commands.
- `src/store/weatherSlice.js` — reducer actions, initial state, and selectors for user-controlled weather state.
- `src/store/store.js` — configured Redux Toolkit store.
- `src/store/weatherSlice.test.js` — behavior-level tests for reducers and selectors.
- `App.js` — Redux Provider wrapper and temporary client-state verification UI after the Expo scaffold is created.

### Task 1: Scaffold Expo and install state dependencies

**Files:**
- Create: Expo-generated `package.json`, `App.js`, and configuration files
- Modify: `package.json`

**Interfaces:**
- Produces: an Expo app with `npm test` available and the `@reduxjs/toolkit` and `react-redux` packages installed.

- [ ] **Step 1: Create the Expo app in the repository**

Run:

```bash
npx create-expo-app@latest . --template blank
```

Accept the prompt to skip a nested Git repository. Preserve the existing `docs/` directory when prompted.

- [ ] **Step 2: Install Redux dependencies**

Run:

```bash
npx expo install @reduxjs/toolkit react-redux
```

- [ ] **Step 3: Verify the baseline test command**

Run:

```bash
npm test -- --watchAll=false
```

Expected: the Expo/Jest command completes, even if no tests are discovered yet.

- [ ] **Step 4: Commit the scaffold**

```bash
git add package.json package-lock.json App.js app.json babel.config.js
git commit -m "chore: scaffold Expo weather client"
```

### Task 2: Add Redux weather client state

**Files:**
- Create: `src/store/weatherSlice.test.js`
- Create: `src/store/weatherSlice.js`
- Create: `src/store/store.js`

**Interfaces:**
- Produces: `toggleFavorite(cityId)`, `addRecentlyViewed(cityId)`, `selectFavoriteCityIds(state)`, `selectRecentlyViewedCityIds(state)`, and `weatherReducer`.
- Consumes: city ID strings such as `"ann-arbor"`.

- [ ] **Step 1: Write the failing reducer tests**

```javascript
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
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run:

```bash
npm test -- src/store/weatherSlice.test.js --watchAll=false
```

Expected: FAIL because `weatherSlice` does not yet exist.

- [ ] **Step 3: Implement the minimal slice and store**

```javascript
// src/store/weatherSlice.js
import { createSlice } from '@reduxjs/toolkit';

const weatherSlice = createSlice({
  name: 'weather',
  initialState: { favoriteCityIds: [], recentlyViewedCityIds: [] },
  reducers: {
    toggleFavorite(state, action) {
      const cityId = action.payload;
      state.favoriteCityIds = state.favoriteCityIds.includes(cityId)
        ? state.favoriteCityIds.filter((id) => id !== cityId)
        : [...state.favoriteCityIds, cityId];
    },
    addRecentlyViewed(state, action) {
      const cityId = action.payload;
      state.recentlyViewedCityIds = [
        cityId,
        ...state.recentlyViewedCityIds.filter((id) => id !== cityId),
      ];
    },
  },
});

export const { addRecentlyViewed, toggleFavorite } = weatherSlice.actions;
export const selectFavoriteCityIds = (state) => state.weather.favoriteCityIds;
export const selectRecentlyViewedCityIds = (state) => state.weather.recentlyViewedCityIds;
export default weatherSlice.reducer;
```

```javascript
// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';

export const store = configureStore({
  reducer: { weather: weatherReducer },
});
```

- [ ] **Step 4: Run the targeted test to verify it passes**

Run:

```bash
npm test -- src/store/weatherSlice.test.js --watchAll=false
```

Expected: PASS with both reducer tests passing.

- [ ] **Step 5: Commit the Redux state module**

```bash
git add src/store/weatherSlice.js src/store/weatherSlice.test.js src/store/store.js
git commit -m "feat: add weather client state"
```

### Task 3: Connect the Redux provider and validate shared state

**Files:**
- Modify: `App.js`
- Test: `src/store/weatherSlice.test.js`

**Interfaces:**
- Consumes: `store` from `src/store/store.js`, `toggleFavorite`, and `addRecentlyViewed` from `src/store/weatherSlice.js`.
- Produces: an Expo root wrapped in `<Provider store={store}>`, ready for Explore, Details, and Favorites screens.

- [ ] **Step 1: Wrap the root component with the Redux Provider**

```javascript
import { Provider } from 'react-redux';
import { store } from './src/store/store';

export default function App() {
  return (
    <Provider store={store}>
      {/* Weather screens render here in the next implementation phase. */}
    </Provider>
  );
}
```

The root may render a simple `View`/`Text` placeholder, but it must retain the Provider wrapper.

- [ ] **Step 2: Run all tests to verify the Redux behavior remains green**

Run:

```bash
npm test -- --watchAll=false
```

Expected: PASS with all weather client-state tests green.

- [ ] **Step 3: Run Expo's non-interactive validation command**

Run:

```bash
npx expo export --platform web
```

Expected: the bundle completes without a missing Provider or module-resolution error.

- [ ] **Step 4: Commit the Provider integration**

```bash
git add App.js src/store/weatherSlice.test.js
git commit -m "feat: connect Redux weather store"
```
