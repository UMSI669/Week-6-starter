# Main page and navigation handoff

## Navigation

- React Navigation bottom tabs: `Pokémon` and `My Team`.
- A native stack wraps those tabs and exposes `PokemonDetails` above them.
- Selecting a card navigates with `navigation.navigate('PokemonDetails', { pokemonId: pokemon.id })`.
- The details route receives a numeric Pokédex ID in `route.params.pokemonId`. Fetch the record through TanStack Query using `['pokemon', pokemonId]`; do not pass API records in route params.

## Main page data

- The initial gallery stores only `[1, 4, 7, 25, 133]` in local screen state.
- Successful lookups are added by ID after the user selects “Add to Pokédex”. That gallery collection is independent of team membership.
- PokéAPI records are fetched and cached with TanStack Query. PokéAPI is keyless and requires no environment variable.

## Shared team state

`src/store/teamStore.js` exports `useTeamStore` and `MAX_TEAM_SIZE`.

- `teamIds`: numeric Pokémon IDs
- `addPokemon(id)`: returns `true` when added and `false` for invalid, duplicate, or full-team additions
- `removePokemon(id)`: removes by ID
- `isOnTeam(id)`: checks current membership

The Zustand store contains IDs only. Full API records remain in TanStack Query. The store enforces unique IDs and a maximum of six members.

## Integration notes

- Details screen: replace `PokemonDetailsPlaceholder` with the full details UI while keeping the `pokemonId` route parameter.
- My Team screen: replace `MyTeamScreen` with the full list and statistics; continue reading `teamIds` from `useTeamStore` and resolve details with TanStack Query.
- Design: the screen, card, type pill, and color tokens are separate modules so the final Figma styling can replace presentation without changing data contracts.

## Dependencies

The app uses Expo, React Navigation, TanStack Query, and Zustand. PokéAPI needs no key.
