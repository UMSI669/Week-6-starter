# Michigan Fall Finder 🍁

Michigan Fall Finder is a mobile app for students, residents, and visitors looking for scenic autumn destinations across Michigan. It combines a curated, offline-friendly destination list with an interactive map and nearby biodiversity observations so users can plan an autumn outing without treating community science data as a foliage forecast.

## Main features

- Explore ten real Michigan destinations on an interactive map.
- Search destinations by partial, case-insensitive name.
- Request foreground device location only when needed.
- Filter destinations to 25, 50, 100, or 200 miles from the user.
- Save and remove destinations from a shared “My List” tab.
- Mark saved destinations as visited and undo that status.
- Open a destination detail modal with nearby, research-grade maple observations from iNaturalist.
- Handle search, location, API loading, API error, API empty, and saved-list empty states.

## Technology stack

- **React Native** builds the cross-platform mobile interface.
- **Expo SDK 57** supplies the development environment and device integrations.
- **Expo Router** provides file-based tabs and modal navigation, as required by this repository’s `AGENTS.md`.
- **Zustand** stores user-controlled state shared across screens.
- **TanStack Query** fetches, caches, and refetches server-owned observation data.
- **react-native-maps** renders the map and destination markers.
- **expo-location** requests foreground permission and reads the current GPS position.

## API used

The app calls the public [iNaturalist API](https://api.inaturalist.org/v1/docs/) when a destination detail screen opens. The request searches within 25 kilometers of the destination for recent, research-grade observations in the verified maple genus taxon (`Acer`, taxon ID `47727`) that include photos.

The response is displayed as “Nearby Tree Observations” with common/scientific names, dates, photos, and links to the original observations. TanStack Query caches each destination request for 30 minutes.

**iNaturalist observations are community biodiversity records, not official or real-time fall foliage forecasts.** The app does not infer foliage color or peak timing from observation counts.

## Shared client state — Zustand

`src/store/useFallStore.js` stores only values controlled by the user that multiple screens need:

- Favorite destination IDs
- Visited destination IDs
- The selected distance preference

For example, saving a map destination immediately updates My List because both screens read the same Zustand store. The store keeps IDs instead of copying full destination objects, which avoids duplicated source data.

## Server state — TanStack Query

TanStack Query owns iNaturalist data because that data lives on a remote server and can become stale. It manages:

- Fetching observations
- Loading and background-fetching states
- Error and retry states
- Empty responses
- Cache keys and 30-minute cache freshness

API responses are not copied into Zustand. Keeping server state in TanStack Query gives the app one clear cache and prevents the shared client store from holding stale response objects.

## Client state vs. server state

| Feature | State management |
|---|---|
| Favorites | Zustand |
| Distance Filter | Zustand |
| Visited Status | Zustand |
| API Observations | TanStack Query |
| Loading State | TanStack Query |
| API Errors | TanStack Query |
| API Caching | TanStack Query |
| Search Input | Local `useState` |
| GPS Coordinates | Local state in Explore |

## Project structure

```text
src/
├── app/          Expo Router route files and navigation layouts
├── components/   Reusable cards, markers, controls, and empty states
├── data/         Curated Michigan destination records
├── hooks/        TanStack Query observation hook
├── screens/      Explore, My List, and destination detail interfaces
├── services/     iNaturalist network request and response mapping
├── store/        Zustand shared client store
├── theme/        Semantic color, spacing, radius, type, and shadow tokens
└── utils/        Haversine distance calculation and formatting
```

`index.js` is the custom entry point and hands app registration to Expo Router. `App.js` remains only as the unused file from the original blank template.

## Installation

Requirements: Node.js supported by Expo SDK 57, npm, and Expo Go or a native development environment.

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i`/`a` in the Expo terminal to use a configured iOS Simulator or Android Emulator.

The map and foreground location modules are included in Expo Go for SDK 57. No API key is needed for this assignment’s Expo Go workflow.

### Platform-specific map setup

- **Expo Go:** no extra map configuration is required.
- **iOS standalone builds:** the app uses Apple Maps by default, so the current implementation does not require a Google Maps key.
- **Android standalone builds:** Google Maps deployment requires a restricted Maps SDK for Android key and the `react-native-maps` config plugin. Follow the [Expo SDK 57 deployment guide](https://docs.expo.dev/versions/v57.0.0/sdk/map-view/#deploy-app-with-google-maps) before shipping a store build.
- **Web:** because `react-native-maps` is native-only, web uses an illustrated, selectable destination canvas. Pan and zoom remain native-only.

## Environment variables

None are required for the implemented Expo Go workflow. The iNaturalist API is public and does not require a key.

If a future Android store build adds a Google Maps key, keep it out of Git and configure it for the native build exactly as described in Expo’s map documentation. `EXPO_PUBLIC_` variables are bundled into client apps and must not be treated as production secrets.

## How to use

1. Open Explore to pan and zoom around Michigan.
2. Enter part of a destination name in the search field.
3. Tap the navigation arrow to request foreground location access.
4. Tap the filter control and choose a distance.
5. Tap a leaf marker to preview a destination.
6. Tap the bookmark to save it or the arrow to open details.
7. Open My List to remove saved places or mark them visited.
8. Open details to view nearby maple observations and link to iNaturalist.

## Assignment requirements

| Requirement | Implementation |
|---|---|
| Real public API integration | iNaturalist observations endpoint |
| Zustand shared client state | Favorites, visited IDs, and distance preference |
| TanStack Query server state | Observation requests and cache |
| Loading state | Detail observation loader |
| Error state | API error with Retry; location error messaging |
| Empty state | Search, My List, and zero-observation states |
| Search functionality | Local, immediate, partial-name filtering |
| User interaction | Map, GPS, filters, favorites, visited, details |
| Code comments | One labeled AI comment plus `TODO(student)` explanation prompts |

## Known limitations

- iNaturalist is not a foliage forecasting service.
- Observation results currently focus on maples so the API request remains small and clearly tree-specific.
- Distance filtering requires foreground location permission and a successful location reading.
- Favorites, visited status, and the filter are in memory and reset after a full app restart.
- Web provides a selectable map preview; native map panning and zooming are available only on iOS and Android.
- Store-distributed Android builds need Google Maps key configuration.
- Device GPS behavior has not been automated; test permission denial and retrieval on a physical device or configured simulator.

## Data notes

The ten required destination coordinates were verified against OpenStreetMap Nominatim on October 12, 2026. Large parks use a representative park location or named visitor access point. The iNaturalist genus ID was also verified against the live API.
