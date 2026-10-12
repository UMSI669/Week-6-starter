# Pokémon Collection App

## App Purpose

This React Native application allows users to browse Pokémon retrieved from the PokéAPI and save their favorite Pokémon to a collection.

Users can switch between the Browse and Saved sections, add Pokémon to their favorites, and remove Pokémon from their collection.

## API Used

**PokéAPI:** https://pokeapi.co/

The application retrieves the first 20 Pokémon using the following endpoint:

`https://pokeapi.co/api/v2/pokemon?limit=20`

No API key is required.

## Shared Client State — Zustand

Zustand manages the Pokémon that users save to their collection.

The store contains:
- `favorites`: An array of saved Pokémon names.
- `addFavorite`: Adds a Pokémon to the collection.
- `removeFavorite`: Removes a Pokémon from the collection.

Both the Browse and Saved components access the same Zustand store.

## Server State — TanStack Query

TanStack Query manages the data retrieved from PokéAPI.

It is responsible for:
- Fetching Pokémon information.
- Tracking loading and error states.
- Caching API results.

The API data is managed by TanStack Query rather than copied into Zustand.

## Setup Instructions

1. Clone the project repository.
2. Open the project folder in a terminal.
3. Install dependencies:

   `npm install`

4. Start the Expo development server:

   `npm start`

5. Open the application using Expo Go or a supported simulator.

## Environment Variables

No environment variables or API keys are required for this application.

## Current Limitations

- The application retrieves the first 20 Pokémon.
- Favorites are stored in memory and are not preserved after a complete app restart.
- The interface currently displays Pokémon names rather than images.