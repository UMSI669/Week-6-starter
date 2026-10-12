 Pokémon Team Builder

## Purpose

Pokémon Team Builder is a React Native and Expo app that allows users to browse Pokémon, search for additional Pokémon, view individual Pokémon details, and create a team of up to six members.

## API Used

The app retrieves Pokémon data from [PokéAPI](https://pokeapi.co/docs/v2).

- **Base URL:** `https://pokeapi.co/api/v2/`
- **Authentication:** No API key required
- **Data used:** Pokémon names, Pokédex IDs, artwork, types, and stats

## State Management

The app separates user-controlled client state from data retrieved from the API.

### Shared client state: Zustand

Zustand manages the user’s shared team state, including:

- Selected Pokémon IDs
- Adding Pokémon to the team
- Removing Pokémon from the team
- Preventing duplicate team members
- Enforcing the maximum team size of six

Zustand stores only Pokémon IDs rather than complete PokéAPI records.

### Server state: TanStack Query

TanStack Query manages Pokémon data retrieved from PokéAPI, including:

- Fetching data
- Loading states
- Error states
- Caching
- Refetching and reusing cached results

Fetched Pokémon records remain in TanStack Query’s cache and are not copied into the Zustand store.

For example, the fact that Pokémon ID `25` is on the team belongs in Zustand. Pikachu’s name, artwork, types, and stats belong in TanStack Query’s cache.

## Setup

### Prerequisites

Install:

- [Node.js](https://nodejs.org/)
- npm
- Expo Go on a mobile device, or a supported emulator or simulator

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>