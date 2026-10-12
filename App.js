import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { usePokemonStore } from './pokemonStore';
import { useState } from 'react';

const queryClient = new QueryClient();

// Fetches Pokemon from the PokeAPI.
async function fetchPokemon() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');

// Checks if the Pokemon data could not be retrieved.
  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon');
  }

// Reads the API response and converts the JSON content into JavaScript data.
  const data = await response.json();

// Returns the list of Pokemon from the API response.
  return data.results;
}

function PokemonList() {
// Uses TanStack Query to avoid unnecessary API requests.
  const { data, isLoading, isError } = useQuery({
    queryKey: ['pokemon'],
    queryFn: fetchPokemon,
  });

  const favorites = usePokemonStore((state) => state.favorites);
  const addFavorite = usePokemonStore((state) => state.addFavorite);
  const removeFavorite = usePokemonStore((state) => state.removeFavorite);

  if (isLoading) {
    return <Text>Loading Pokémon...</Text>;
  }

  if (isError) {
    return <Text>Error loading Pokémon.</Text>;
  }

  if (!data || data.length === 0) {
    return <Text>No Pokémon found.</Text>;
  }

  return (
    <View>
      <Text style={styles.heading}>Browse Pokémon</Text>

      {data.map((pokemon) => {
        const isFavorite = favorites.includes(pokemon.name);

        return (
          <View key={pokemon.name}>
            <Text>{pokemon.name}</Text>

            <Button
              title={isFavorite ? 'Remove' : 'Save'}
              onPress={() =>
                isFavorite
                  ? removeFavorite(pokemon.name)
                  : addFavorite(pokemon.name)
              }
            />
          </View>
        );
      })}
    </View>
  );
}

function SavedPokemon() {
  const favorites = usePokemonStore((state) => state.favorites);
  const removeFavorite = usePokemonStore((state) => state.removeFavorite);

  if (favorites.length === 0) {
    return <Text>No Pokémon saved yet.</Text>;
  }

  return (
    <View>
      <Text style={styles.heading}>My Saved Pokémon</Text>

      {favorites.map((name) => (
        <View key={name}>
          <Text>{name}</Text>
          <Button
            title="Remove"
            onPress={() => removeFavorite(name)}
          />
        </View>
      ))}
    </View>
  );
}

export default function App() {
// Keeps track of whether the user is viewing Browse or Saved. (I did not know this one, but I learned it through AI explanation.)
  const [activeTab, setActiveTab] = useState('browse');

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text>Welcome to the Pokémon Collection App!</Text>

        <View style={styles.navigation}>
          <Button
            title="Browse"
            onPress={() => setActiveTab('browse')}
          />

          <Button
            title="Saved"
            onPress={() => setActiveTab('saved')}
          />
        </View>

        {activeTab === 'browse' ? (
          <PokemonList />
        ) : (
          <SavedPokemon />
        )}

        <StatusBar style="auto" />
      </ScrollView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  heading: {
  fontSize: 22,
  fontWeight: 'bold',
  marginTop: 20,
  marginBottom: 10,
  },
  navigation: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginTop: 20,
  marginBottom: 20,
  },
});