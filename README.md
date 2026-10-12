# Movie List

SI 669 Week 6 — Team 5. Browse TMDB movies, search by title, inspect a movie, and save favorites to My List.

## State management

- **TanStack Query** manages TMDB data, loading and error status, caching, and refetching. Browse requests popular movies or search results. Opening a movie calls `GET /3/movie/{id}?append_to_response=credits,videos`, which returns details, cast, and videos in one request. My List retrieves saved movie details with the same cached query.
- **Zustand** manages the user-created `favoriteIds` list. Browse, details, and My List share it. The store contains IDs rather than copies of TMDB movie records. Favorites last while the app is open; persistence across restarts is outside this short build.

The Browse and My List screens show loading, error, and empty states. A failed request has a retry button. Missing posters and missing movie details also have fallback text.

## Get a TMDB credential

1. On a desktop browser, create or sign in to a [TMDB account](https://www.themoviedb.org/signup).
2. Open [Settings → API](https://www.themoviedb.org/settings/api), follow the registration steps, and accept the terms. TMDB says the registration flow is not optimized for mobile browsers.
3. Copy either the **API Key (v3 auth)** or the longer **API Read Access Token**. The app sends a v3 key as an `api_key` query parameter and a read access token as a Bearer header.
4. If you do not already have `.env`, copy `.env.example` to `.env`:

   ```sh
   cp .env.example .env
   ```

   ```env
   EXPO_PUBLIC_TMDB_API_KEY=your_actual_v3_api_key
   ```

   For an API Read Access Token, use `EXPO_PUBLIC_TMDB_READ_ACCESS_TOKEN=your_token`. The app also recognizes a read access token already saved under `EXPO_PUBLIC_TMDB_API_KEY`, so no rename is required.

`.env` is ignored by Git. Do not commit or paste your credential into source code. Expo embeds `EXPO_PUBLIC_` values in the app bundle, so this is assignment configuration rather than secure production secret storage.

## Run locally

Use Node.js 22.13 or later, then run:

```sh
npm ci
npx expo start --clear
```

Open the QR code with a compatible Expo Go app or run `npm run web` for a browser preview. Restart Expo after adding or changing `.env`. Without a credential, the app shows a setup error instead of movie results.

## Check the app

```sh
npm run lint
npm run typecheck
npx expo export --platform web
```

In the app, browse popular movies, search for a title, open a movie to see its cast and trailer, save it, switch to My List, and remove it. Try an unlikely search to see the empty state. Temporarily disconnect from the network to see the error and retry states.

TMDB supplies movie data and images. The in-app Credits section includes an [approved TMDB logo](https://www.themoviedb.org/about/logos-attribution) and the [required notice](https://developer.themoviedb.org/docs/faq).

The starter shell and this implementation were generated with Codex. Teammates should read the code and be prepared to explain both state-management roles and the comments in their own words.
