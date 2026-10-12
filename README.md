# Pokémon Collections

A small Expo app for browsing PokéAPI Pokémon, saving favorites, and making personal collections. Built for University of Michigan SI 669 as a learning example. 

## API Used:
This app uses the PokéAPI, which can be found at https://pokeapi.co/.

## Features

- Browse Pokémon in pages, filter by type, and search names across PokéAPI.
- View artwork, Pokédex numbers, types, abilities, and base stats.
- Favorite Pokémon and manage favorites in the library.
- Create, rename, and delete collections; add or remove members.
- Open a searchable collection picker from any Pokémon card or detail page. The picker marks existing membership and can create a collection while adding that Pokémon.
- Search for more Pokémon from each collection detail page.
- Collection Poké Balls use different colors. Artwork loads from PokéAPI URLs, with a Poké Ball fallback.

## Technology and state ownership

React Native, Expo, and TypeScript provide the app. React Navigation handles the two tabs and detail screens. Fetch is the HTTP client.

**TanStack Query owns PokéAPI server state:** requests, loading and error status, pagination, caching, refetching, cancellation, and request deduplication. Query keys distinguish list pages, searches, types, and individual details. Pokémon objects are never copied into Zustand.


**Zustand owns local user data:** favorite Pokémon IDs and collections containing metadata and Pokémon IDs. AsyncStorage persists this small serializable state with a versioned key. Storing full fetched Pokémon objects would duplicate Query's cache, make local data stale, and increase storage use. The UI combines locally stored IDs with Query detail requests when it needs display data.
### Why we chose Zustand for shared client state:
Zustand is a more minimal way to manage shared client state. As this is a smaller application that runs locally and focuses on favoriting and creating collections, we believe Zustand is a reasonable approach.

### Why we chose TanStack for Server State:
Since we were not using Redux for our shared client state, we chose TanStack to manage this.

## What each library manages:
**React Native + Expo:**
We are using React Native and Expo to build and run the app. React Native is in control of managing components and displaying them. Expo helps to view our app on web, Android, and iOS.

**Typescript**
This checks types throughout the code so that any errors can be caught early. 

**React Navigation**
We are using React Navigation to navigate between pages such as Browse and My Library. 

**AsyncStorage**
We are using AsyncStorage to 'set' and 'get' favorites and manage collections. 

## Required Set Up
PokéAPI does not require a key. Further, we have not set up any environment variables.

## Install and run

Requires Node 20.19.4 or newer, npm, and Expo Go or a simulator.

```bash
npm install
npm start
```

In the Expo terminal, press `i` for iOS Simulator, `a` for Android emulator, or `w` for web. You can also use:

```bash
npm run ios
npm run android
npm run web
```

iOS Simulator needs Xcode on macOS; Android emulator needs Android Studio. Expo Go can open the QR code on a physical device.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
```

The tests mock PokéAPI responses and do not need network access.

## PokéAPI endpoints and request efficiency

- `GET /api/v2/pokemon?limit=20&offset=…` for browsing.
- `GET /api/v2/pokemon/{id}` for visible cards and details.
- `GET /api/v2/type` and `GET /api/v2/type/{name}` for type filtering.
- PokéAPI's public GraphQL endpoint, `POST https://beta.pokeapi.co/graphql/v1beta`, for server filtered partial name search. The REST API has no partial name search parameter.

Twenty names load per browse or search page. `FlatList` renders a small window; detail requests happen when cards are rendered. Query caches details under stable ID keys, so opening a detail page or another list reuses them. A small request queue caps concurrent detail fetches. A 350 ms debounce and abort signals reduce stale searches. Long `staleTime` values avoid repeated requests for rarely changing Pokémon data. The app does not load the entire Pokédex for search or persist API responses. PokéAPI is free and requires no key or paid service.

## Project layout

```text
App.tsx                    Query and safe-area providers
src/api/                   Typed Fetch functions and response types
src/hooks/                 Query hooks and debounced search
src/store/                 Versioned local Zustand state
src/navigation/            Tabs and stack routes
src/screens/               Browse, library, collection, add, and detail views
src/components/            Cards, badges, feedback, picker, Poké Ball
src/theme/ and src/utils/   Colors and Pokémon formatting helpers
__tests__/                 Store, API, and rendered interaction tests
```

## Accessibility

Actions have roles and labels that state what a press will do. Hearts and collection membership have selected or checked states. Touch targets are about 44 points or larger. Forms have visible or accessible labels, keyboard avoidance, and clear validation. Loading and error messages are announced where practical. Colors are paired with text, icons, or selection marks.

## Known limitations and future improvements

- Partial name search uses PokéAPI's public beta GraphQL endpoint. If that endpoint is unavailable, search shows a retry action while browsing, favorites, and collections remain available.
- Type filtered names come from one type response and are virtualized in `FlatList`. This avoids fetching all Pokémon details but large type responses still transfer their name list.
- Favorites and collections live on one device; there is no sync or account.
- A future extension could add sort orders, descriptions, collection cover themes, or offline artwork caching.

## Manual test checklist

1. Browse two pages, pull to refresh, then filter by a type and clear it.
2. Search `pika`, rapidly change the query, then clear it. Try a name with different capitalization and a query with no results.
3. Favorite a Pokémon; check it in My Library; unfavorite it there.
4. Open the Poké Ball picker, create a collection while adding a Pokémon, then add and remove that Pokémon from another collection. Search collections in the picker.
5. Open a collection, rename it, add a Pokémon through Search & add, remove a member, and delete the collection with confirmation.
6. Restart the app and confirm favorites and collections remain.
7. Turn off network access and confirm useful retry states for API data while local collection names and IDs remain available.
8. Use a screen reader to inspect heart, collection, filter, form, and retry labels.

## SI 669 discussion guide

Look for `TODO(SI 669)` comments. Be ready to explain why Query owns server data; why Zustand stores IDs; how query keys, `staleTime`, and infinite pages affect requests; why search is debounced; how AsyncStorage hydration and immutable updates work; how duplicate membership is prevented; how ID-based local state combines with API data; how action labels change for accessibility; and where the theme can be customized.
