import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGames } from "../../hooks/useGames";

export default function GamePicker({ selectedGame, onSelect }) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);
  const enabled = !selectedGame && query.length >= 2 && query === search.trim();
  const { data, isPending, isError, error, refetch } = useGames(query, enabled);

  if (selectedGame) {
    return (
      <View style={styles.card}>
        {selectedGame.background_image && <Image source={{ uri: selectedGame.background_image }} style={styles.cover} accessibilityLabel={`${selectedGame.name} cover`} />}
        <Text style={styles.title}>{selectedGame.name}</Text>
        {!selectedGame.background_image && <Text style={styles.hint}>No cover available for this game.</Text>}
        <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={() => { onSelect(null); setSearch(""); setQuery(""); }}>
          <Text style={styles.title}>Change game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <TextInput style={styles.input} accessibilityLabel="Search games on RAWG" value={search} onChangeText={setSearch} placeholder="Search RAWG, e.g. Elden Ring" placeholderTextColor="#999" autoCorrect={false} />
      <Text style={styles.hint}>Search and select a game to attach its title and cover.</Text>
      {search.trim().length < 2 && <Text style={styles.hint}>Enter at least two characters.</Text>}
      {enabled && isPending && <ActivityIndicator color="white" accessibilityLabel="Searching games" />}
      {enabled && isError && (
        <View>
          <Text style={styles.hint}>{error.message}</Text>
          <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={() => { void refetch(); }}><Text style={styles.title}>Try again</Text></TouchableOpacity>
        </View>
      )}
      {enabled && !isPending && !isError && data?.length === 0 && <Text style={styles.hint}>No games found. Try another name.</Text>}
      {enabled && data?.slice(0, 10).map((game) => (
        <TouchableOpacity key={game.id} accessibilityRole="button" accessibilityLabel={`Select ${game.name}`} style={styles.result} onPress={() => onSelect(game)}>
          {game.background_image && <Image source={{ uri: game.background_image }} style={styles.thumbnail} />}
          <View style={styles.resultText}>
            <Text style={styles.title}>{game.name}</Text>
            <Text style={styles.hint}>{game.released || "Release date unavailable"}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <Text style={styles.hint}>Game data and images provided by RAWG.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: "#242424", color: "white", padding: 14, borderRadius: 10, fontSize: 16 },
  hint: { color: "#BBBBBB", marginVertical: 8 },
  title: { color: "white", fontSize: 16, fontWeight: "600" },
  card: { backgroundColor: "#242424", padding: 12, borderRadius: 10, gap: 10 },
  cover: { width: "100%", height: 160, borderRadius: 8 },
  button: { backgroundColor: "#444444", padding: 14, borderRadius: 8 },
  result: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#242424", padding: 12, borderRadius: 8, marginTop: 8 },
  thumbnail: { width: 72, height: 54, borderRadius: 6 },
  resultText: { flex: 1 },
});
