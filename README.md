# Movie List

SI 669 Week 6 — Team 5. An Expo React Native app shell for browsing TMDB movies and keeping a personal list.

## Current status

Implemented: Browse and My List placeholder screens, Expo Router navigation, one shared TanStack Query provider, and agreed movie/favorites types. No API requests, search, favorites store, persistence, or real movie data are implemented yet. No credentials are needed to run this shell.

## Run locally

Use Node.js 22.13 or later (SDK 57 requirement; development machine uses Node 24).

```sh
npm ci
npx expo start --clear
```

Open with a compatible Expo Go version/device or simulator. For a browser preview, run `npm run web`. After pulling changes to dependencies, run `npm ci` again. Do not run create-expo-app again.

## Ownership and handoff

- Hao: `src/app/`, `src/providers/`, shared components/types, configuration, README, integration and final testing.
- Ashley: `src/features/browse/BrowseScreen.tsx`; add TMDB API functions and Query hooks within `src/features/browse/`. Provide query-based access to movie details by ID for My List.
- Victor: `src/features/favorites/MyListScreen.tsx`; add the Zustand store and save/remove controls within `src/features/favorites/`.

Routes only re-export feature screens, so teammates can edit separate files. `src/app/_layout.tsx` is the live app entry layout. The original `App.js` and `index.js` are retained starter files but are not used by Expo Router. Do not add another Query provider inside a feature screen.

## Shared state agreement

TanStack Query owns server movie data, request status and caching. Zustand will own `favoriteIds`; do not copy the entire TMDB response into that store. Agreed interfaces are in `src/types/movie.ts`. Movies only for the initial scope; Recently Viewed is a stretch goal. Favorites persistence is not yet decided.

## TMDB configuration pending

Ashley must confirm endpoints, authentication method and the exact environment-variable name before this section is finalized. Keep real credentials in ignored `.env` files and provide only placeholders in `.env.example`. Expo public environment variables are included in the client bundle and are not production secret storage. Before integrating TMDB content, add the approved TMDB logo and required notice to an in-app About/Credits area: https://developer.themoviedb.org/docs/faq

## Checks

```sh
npm run lint
npm run typecheck
npx expo export --platform web
```

Manual shell check: open Browse, switch to My List, follow the link back, and confirm there are no runtime errors. API and favorites acceptance tests become applicable after teammates integrate their features. No physical-device test has been recorded yet.

## Collaboration

Merge the scaffold into the team's fork main before teammates pull it and branch off. Feature PRs target `haoliusi/Week-6-starter`, not the class repository. The final assignment PR targets `UMSI669/Week-6-starter`.

## AI use

The shell was generated with Codex. Existing AI-written explanatory code comments are labeled. Each teammate should review their code and add comments reflecting their own understanding; this scaffold does not fulfill the assignment's student-written commenting exercise.

## Agreed feature interfaces

- Movie UI fields: `id`, `title`, `poster_path`, `release_date`.
- Favorites state: `favoriteIds`.
- Actions: `addFavorite(id)` and `removeFavorite(id)`.
- Save controls receive a movie ID.
- Saved movie details are retrieved through Ashley’s TanStack Query hooks.
- Missing posters must display a placeholder.

## Shell validation on October 12, 2026

Passed: Expo lint, TypeScript checking, web/iOS/Android bundle exports, and browser navigation Browse → My List → Browse. Physical-device execution is still unverified. npm reported 28 dependency audit findings during installation; no forced dependency upgrades were applied.
