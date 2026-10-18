import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGames } from "../../hooks/useGames";

export default function GameList() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);
  const { data, isPending, isError, error, refetch, isFetching } = useGames(query);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      data={data ?? []}
      keyExtractor={(item) => String(item.id)}
      refreshing={isFetching && !isPending}
      onRefresh={() => { void refetch(); }}
      ListHeaderComponent={
        <View>
          <Text style={styles.heading}>Explore Games</Text>
          <Text style={styles.secondary}>Discover games, powered by RAWG.</Text>
          <TextInput
            accessibilityLabel="Search RAWG games"
            style={styles.search}
            placeholder="Search games, e.g. Elden Ring"
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => setQuery(search.trim())}
          />
          {isError && (
            <View accessibilityLiveRegion="polite" style={styles.status}>
              <Text style={styles.text}>{error.message || "Failed to load games."}</Text>
              <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={() => { void refetch(); }}>
                <Text style={styles.text}>Try again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      }
      ListEmptyComponent={isPending ? (
        <View style={styles.status}>
          <ActivityIndicator color="#FFFFFF" />
          <Text style={styles.secondary}>Loading games...</Text>
        </View>
      ) : !isError ? <Text style={styles.secondary}>No games found. Try another search.</Text> : null}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.background_image ? (
            <Image source={{ uri: item.background_image }} style={styles.cover} accessibilityLabel={`${item.name} cover`} />
          ) : <View style={[styles.cover, styles.status]}><Text style={styles.secondary}>No cover available</Text></View>}
          <View style={styles.details}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.secondary}>Rating: {item.rating > 0 ? `${item.rating}/5` : "Not rated"}</Text>
            <Text style={styles.secondary}>Released: {item.released || "Not announced"}</Text>
            <Text style={styles.secondary}>{item.genres?.map((genre) => genre.name).join(" · ") || "Genre unavailable"}</Text>
          </View>
        </View>
      )}
      ListFooterComponent={<Text style={styles.footer}>Game data and images provided by RAWG.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { padding: 20, paddingBottom: 40 },
  heading: { color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 8 },
  text: { color: "white", fontSize: 16 },
  secondary: { color: "#BBBBBB", marginTop: 6 },
  search: { backgroundColor: "#242424", color: "white", padding: 14, borderRadius: 10, marginVertical: 20 },
  status: { padding: 20, alignItems: "center", justifyContent: "center", gap: 10 },
  button: { backgroundColor: "#8B0000", padding: 14, borderRadius: 8 },
  card: { backgroundColor: "#242424", borderRadius: 12, overflow: "hidden", marginBottom: 16 },
  cover: { width: "100%", height: 180, backgroundColor: "#333333" },
  details: { padding: 16 },
  title: { color: "white", fontSize: 20, fontWeight: "bold" },
  footer: { color: "#BBBBBB", textAlign: "center", marginTop: 16 },
});
