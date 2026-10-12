# Michigan Fall Finder 🍁

Michigan Fall Finder is an Expo/React Native app for discovering scenic autumn destinations across Michigan. It combines a curated destination map, saved and visited lists, foreground GPS distance filtering, and real nearby tree observations.

## Main features

- Map-focused Explore screen with ten verified Michigan destinations.
- Full-width destination preview cards with complete names, cities, photos, descriptions, and independent save controls.
- External Apple Maps links on iOS and Google Maps links on Android/web using destination coordinates.
- Foliage-colored markers and a compact six-status legend.
- Search, foreground location, and shared distance filters.
- Zustand-powered favorites and visited status.
- Detail screens with location photos, foliage-report state, description, and recent observations.
- Real, licensed iNaturalist photo attribution and newest-first observation dates.
- Native interactive maps plus a selectable illustrated web fallback.

## Technology stack

- **React Native 0.86 / Expo SDK 57:** cross-platform application and device services.
- **Expo Router:** file-based tab and modal navigation.
- **react-native-maps:** interactive Apple/Google map rendering on iOS and Android.
- **expo-location:** user-triggered foreground location permission and GPS reading.
- **Zustand:** shared user-controlled client state.
- **TanStack Query:** iNaturalist fetching, caching, loading, errors, and retries.

## State architecture

Zustand stores only favorite destination IDs, visited destination IDs, and the distance preference. These values are controlled by the user and shared between Explore and My List. API responses are never copied into the store.

TanStack Query manages iNaturalist observations. Its cache key contains the destination ID, coordinates, and radius. Results remain fresh for 30 minutes, and each destination is fetched only when selected or opened.

| Feature | Owner |
|---|---|
| Favorites, visited status, distance preference | Zustand |
| Search input, current coordinates | Local React state |
| iNaturalist data, loading, errors, cache | TanStack Query |
| Bundled foliage JSON | Static local data, not server state |

## iNaturalist integration

The app queries the public [iNaturalist observations API](https://api.inaturalist.org/v1/docs/) within 25 km of a selected destination. It requests research-grade observations with photos for the verified maple genus `Acer` (taxon ID `47727`).

Results include the observation ID, species, observation date, coordinates, photo URL, original observation URL, license, observer, and photo attribution. The API requests `observed_on` descending, and the service also sorts locally by the actual observation date as a safeguard. Upload date is not presented as observation date.

Nearby observation photos serve as the permitted fallback for both the preview image and “Location Photos.” They are not presented as Google Place photos or proof of current foliage conditions.

## Mapping integrations

These services are separate:

- **Google Maps SDK / Apple Maps:** `react-native-maps` displays the native map. Expo Go needs no key. Android store builds require a restricted Maps SDK for Android key.
- **External Maps navigation:** HTTPS coordinate links open Apple Maps on iOS and Google Maps on Android/web, with browser fallback behavior.
- **Google Places API:** not configured. A map SDK configuration does not enable Places Web Service access.
- **iNaturalist API:** supplies nearby tree observation data and licensed photos.

## Google Places photo investigation

The repository has no Google Places key or secure proxy. Google Places Web Service requests require an authorized, billable API key and attribution compliance. Calling the web service directly from a mobile bundle would expose the credential, so direct Places photo integration was intentionally not added.

A production implementation would require a small authenticated proxy that stores the key server-side, resolves verified Place IDs, returns permitted photo resources and attribution, and applies quotas. Until then, the app uses attributed iNaturalist imagery and clearly labels it.

## Foliage reports and marker colors

Preferred source: [Michigan Fall Color Reports](https://www.michigan.org/fall-color-reports).

On October 12, 2026, automated requests to the report, `robots.txt`, and likely terms pages returned a Cloudflare challenge (`403`). Because automated access and content reuse permission could not be verified, the project does **not** scrape, bypass the challenge, or copy unverified report values.

`data/foliage-status.json` is a bundled static fallback. It currently contains no regional statuses, so all markers honestly display `Unknown`. Bundled foliage data is not fetched or cached by TanStack Query.

| Normalized status | Marker color |
|---|---|
| Early | `#6F9147` |
| Changing | `#E6B547` |
| Near Peak | `#E77B32` |
| Peak | `#B94132` |
| Past Peak | `#8B6F61` |
| Unknown | `#8A8A8A` |

Regional reports are labeled as estimates and never as exact park- or tree-level conditions. Missing data always resolves to `unknown`.

### Manual foliage import workflow

1. Obtain explicit permission or a permitted structured source.
2. Copy `data/foliage-status.manual.example.json` to `data/foliage-status.manual.json`.
3. Enter only verified regional statuses and source publication dates.
4. Run:

```bash
npm run foliage:update
```

The validation script accepts only the documented status vocabulary and ISO dates, then writes the bundled `data/foliage-status.json`. The unverified manual working file is ignored by Git. Update frequency should match the source publication schedule; no schedule is claimed while source access remains unverified.

## Project structure

```text
data/                 bundled and manual foliage JSON
scripts/              validated manual foliage import script
src/app/              Expo Router routes
src/components/       cards, markers, legend, galleries, controls
src/data/             curated destinations
src/hooks/            TanStack Query hooks
src/screens/          Explore, My List, destination details
src/services/         iNaturalist and foliage data layers
src/store/            Zustand shared store
src/theme/            semantic design tokens
src/utils/            distance, foliage colors, Maps navigation
```

## Installation and running

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go or press `i`, `a`, or `w`. `react-native-maps` supports iOS and Android; web uses the project’s selectable illustrated canvas.

No API key is required for the current Expo Go and iNaturalist workflow. Before an Android store build, follow the [Expo SDK 57 Google Maps deployment guide](https://docs.expo.dev/versions/v57.0.0/sdk/map-view/#deploy-app-with-google-maps). Do not commit map or Places keys. `EXPO_PUBLIC_` values are bundled into the client and are not secrets.

## Known limitations

- Current foliage statuses remain unavailable until permitted data is manually imported.
- Google Places photos require a secure proxy and are not enabled.
- iNaturalist imagery represents nearby observations, not guaranteed destination views or current fall color.
- Favorites, visited status, and distance preference are in memory and reset after a full restart.
- Distance filtering requires location permission.
- Native pan and zoom are not available in the web fallback.
- External Maps, GPS permissions, and visual layout still require physical-device testing.

## Data notes

Destination coordinates were verified against OpenStreetMap Nominatim on October 12, 2026. Large parks use representative visitor access points. City labels identify the nearby community used for trip planning.
