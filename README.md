# Movie List

SI 669 Week 6 — Team 5. An Expo React Native app for browsing popular movies from The Movie Database (TMDB), searching by title, viewing details, saving movies to My List, and revisiting recently opened movies.

## Team responsibilities

- **Hao Liu:** repository setup, app shell, navigation, shared types, Query provider, README, process documentation, integration, and final testing.
- **Ashley Kang:** TMDB integration, movie fetching and search, Browse screen, and request states.
- **Victor Fang:** shared favorites state, save/remove interactions, My List, movie categories, and Recently Viewed.

## Features

- Browse Popular, Now Playing, Top Rated, or Upcoming movies, or search by title. Search is independent of the selected category; tapping a category clears the search.
- Open movie details with a poster, overview, release year, runtime, up to five cast members, and a YouTube trailer link when available.
- Save movies from Browse or details; view and remove them in My List.
- Show loading, error, retry, empty-result, and missing-poster states.
- Switch between Browse, My List, and Recent with Expo Router.
- Recent tracks the last 20 unique movies opened, newest first. Reopening a movie moves it to the top. Clear removes the history without changing favorites.

## State management

| Tool | Responsibility |
| --- | --- |
| **TanStack Query** | TMDB responses, request status, caching, and refetching. Browse uses `['movies', 'category', selectedCategory]` or `['movies', 'search', search]`; details, My List, and Recent share `['movie', id]`. Queries use a five-minute stale time. |
| **Zustand** | Three stores hold favorites (`favoriteIds`, add/remove), category selection (`selectedCategory`, `setCategory`), and history (`recentIds`, add/remove/clear). Favorites and history store unique IDs, not copies of API responses. |
| **React local state** | Search input and the movie currently selected for the details modal. |

A single Query provider wraps all three screens. My List retrieves movie details by saved ID through TanStack Query, so changing the Browse search does not remove saved movies. Favorites, recent history, and category selection are held in memory. A full restart or reload clears favorites/history and resets the category to Popular. History records opening details, even if the detail request fails. The history store also exposes `removeRecentlyViewed(id)`; the current UI offers Clear for the whole history.

## TMDB endpoints

API base URL: `https://api.themoviedb.org/3`.

All API requests below use **GET**, include `language=en-US`, and use one of the authentication options described below.

| Endpoint | Query parameters | Used for |
| --- | --- | --- |
| `/movie/popular` | `language=en-US` | Popular category (default). |
| `/movie/now_playing` | `language=en-US` | Now Playing category. |
| `/movie/top_rated` | `language=en-US` | Top Rated category. |
| `/movie/upcoming` | `language=en-US` | Upcoming category. |
| `/search/movie` | `language=en-US`, `query=<search text>`, `include_adult=false` | Title search. Input is trimmed and debounced by 400 ms. |
| `/movie/{id}` | `language=en-US`, `append_to_response=credits,videos` | Movie details, cast, videos, and records for saved IDs in My List and viewed IDs in Recent. |

Posters use `https://image.tmdb.org/t/p/w342{poster_path}`. This image URL is separate from the authenticated API endpoints. Missing poster paths display a placeholder. Trailer links open YouTube rather than a TMDB endpoint.

Implementation: `src/services/tmdb.ts`. See the [TMDB API guide](https://developer.themoviedb.org/docs/getting-started).

## Authentication and environment variables

The app uses **application-level authentication**. Users do not sign into TMDB inside the app, and favorites are local client state rather than a TMDB account watchlist.

Obtain your own credential through [TMDB account API settings](https://www.themoviedb.org/settings/api). Register through a desktop browser if needed. See [TMDB authentication documentation](https://developer.themoviedb.org/docs/authentication-application).

Choose **one** configuration in a local `.env` file at the repository root, next to `package.json`.

### Option A — TMDB v3 API key

```env
EXPO_PUBLIC_TMDB_API_KEY=replace_with_your_v3_api_key
```

The app sends this value as the `api_key` query parameter on each TMDB API request.

### Option B — API Read Access Token

```env
EXPO_PUBLIC_TMDB_READ_ACCESS_TOKEN=replace_with_your_read_access_token
```

The app sends `Authorization: Bearer <token>`. Enter only the token as the variable value, without the `Bearer ` prefix.

### Variable precedence and compatibility

- A nonempty `EXPO_PUBLIC_TMDB_READ_ACCESS_TOKEN` takes precedence over `EXPO_PUBLIC_TMDB_API_KEY`.
- Both values are trimmed before use.
- For backward compatibility, a value in `EXPO_PUBLIC_TMDB_API_KEY` that starts with `eyJ` and contains a dot is treated as a Bearer token. Prefer the explicit token variable for clarity.
- Restart Expo after adding or changing `.env`; credentials are read when the app is bundled.
- Without either variable, the app displays a missing-credential error. An invalid credential produces a 401 error message; a rate-limited request produces a 429 message.

All values shown here are placeholders. Never commit real credentials, put them in the process document, or share screenshots containing them. `.env` and `.env.*` are ignored by Git, except the placeholder-only `.env.example`. Expo bundles `EXPO_PUBLIC_` values into the client: these variables are configuration, not production secret storage.

## Setup and running the app

### 1. Prerequisites

- Git and Node.js **22.13 or later** with npm, as required by the project's Expo SDK 57.
- For phone testing, an Expo Go version compatible with SDK 57. Check [Expo Go availability](https://expo.dev/go) if the installed version reports an SDK mismatch.
- Your own TMDB API key or API Read Access Token.

### 2. Clone and install

For a new checkout:

```sh
git clone https://github.com/haoliusi/Week-6-starter.git
cd Week-6-starter
npm ci
```

If you already have the repository, use your existing checkout and run `npm ci` after pulling dependency changes. Do not run `create-expo-app` again.

### 3. Configure TMDB

If `.env` does not already exist, copy the example:

```sh
cp .env.example .env
```

Edit `.env` locally and replace the placeholder using **one** authentication option above. Preserve an existing `.env` rather than overwriting it. No credentials are included in this repository.

### 4. Start Expo

```sh
npx expo start --go --clear
```

If Expo Go requires sign-in, sign into the same Expo account on your phone and computer:

```sh
npx expo login
npx expo whoami
```

For an organization SSO account, use `npx expo login --sso` instead and complete the browser sign-in. Restart Expo after login, then scan the new QR code. See [Expo SSO instructions](https://docs.expo.dev/accounts/sso/).

Keep the terminal open. With your phone and computer on the same network, scan the QR code and open the project in compatible Expo Go. If the local connection fails, stop Expo and try:

```sh
npx expo start --go --tunnel
```

For the browser preview:

```sh
npm run web
```

An installed iOS Simulator or configured Android emulator can be launched from the Expo terminal with `i` or `a`, respectively.

## Project structure

```text
src/app/                          Expo Router routes and navigation
src/providers/QueryProvider.tsx    Shared Query client and cache
src/features/browse/              Browse, category definitions/store, and search
src/features/favorites/           Favorites store and My List screen
src/features/recent/              Recent history store and Recently Viewed screen
src/services/tmdb.ts              TMDB requests and poster URLs
src/components/                   Movie cards, details modal, states, credits
src/types/movie.ts                Movie, favorites, category, and history interfaces
```

Expo Router starts from `src/app/_layout.tsx`. The retained starter `App.js` and `index.js` are not the active entry point.

## Validation and manual testing

```sh
npm run lint
npm run typecheck
npx expo export --platform web
```

Manual acceptance checklist:

- [ ] Start with a valid local credential and see popular movies.
- [ ] Switch through all four categories and verify the selected label and results.
- [ ] Search for a title and verify matching results; tap a category and confirm search clears.
- [ ] Search an unlikely title and verify the empty state.
- [ ] Open details and verify available information and missing-data fallbacks.
- [ ] Close details in Expo Go; confirm return to the previous screen.
- [ ] Save a movie, switch to My List, and verify it appears once.
- [ ] Change the Browse search; confirm the saved movie remains in My List.
- [ ] Remove the movie and verify both views update.
- [ ] With the network disconnected, request a previously unqueried title, then reconnect and retry. Cached results may still display, so an already cached query is not a reliable error test.
- [ ] Open movies from Browse and My List; verify Recent displays them newest first.
- [ ] Reopen a movie from Recent; verify it moves to the top without a duplicate.
- [ ] Open more than 20 distinct movies and verify history retains only the latest 20.
- [ ] Save/remove a movie from Recent and verify My List updates.
- [ ] Clear Recent and verify its empty state while favorites remain unchanged.
- [ ] Fully reload the app and confirm favorites/history reset and Popular is selected.

These checkboxes are a test plan, not a claim that every scenario has passed. Shell checks and browser navigation were verified earlier; live TMDB behavior requires a configured credential. The details close-button adjustment has browser dismissal coverage, but physical Expo Go verification remains pending.

## Current limitations

- Movies only; TV browsing is not implemented. Categories are TMDB movie lists, not genre filters.
- Only the first API page is shown; there are no pagination controls.
- Favorites and recent history do not persist across full restarts and are not synchronized to a TMDB account.
- A phone-specific details Close issue was reported. A modal safe-area and touch-target adjustment was merged in PR #3, but the user subsequently reported the issue still occurring. Resolution is not confirmed; retest the latest code on the affected phone.

## Credits and AI use

TMDB supplies movie data and images. The in-app Credits component includes an [approved TMDB logo](https://www.themoviedb.org/about/logos-attribution) and the notice: “This product uses the TMDB API but is not endorsed or certified by TMDB.” See [TMDB attribution requirements](https://developer.themoviedb.org/docs/faq).

Codex assisted with the scaffold, implementation, troubleshooting, and documentation. Each teammate should review their assigned code, explain the distinction between client and server state, and add comments reflecting their own understanding. Record prompts, decisions, iterations, actual test results, and remaining questions in the team's process document.
