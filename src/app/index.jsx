
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { useRouter } from "expo-router";

import BuildCard from "../api/app/components/BuildCard";
import GameCard from "../components/GameCard";
import { builds } from "../api/data/builds";
import { useBuildStore } from "../store/useBuildStore";
import { useGames } from "../../hooks/useGames";

export default function HomeScreen() {
  const router = useRouter();

  // Local state for searching and selecting a section.
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("builds");

  // Shared client state managed by Zustand.
  const addBuild = useBuildStore((state) => state.addBuild);
  const savedBuilds = useBuildStore((state) => state.savedBuilds);

  // Server state managed by TanStack Query.
  const {
    data: games,
    isLoading,
    isError,
    error,
    refetch,
  } = useGames(search.trim() || "elden ring");

  // Filter locally defined character builds.
  const filteredBuilds = builds.filter((build) => {
    const query = search.toLowerCase();

    return (
      build.name.toLowerCase().includes(query) ||
      build.type.toLowerCase().includes(query) ||
      build.game.toLowerCase().includes(query)
    );
  });

  const handleSave = (build) => {
    addBuild(build);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>SoulsBuild</Text>

      <Text style={styles.subtitle}>
        Discover, create, and customize RPG builds.
      </Text>

      {/* Navigation buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/my-builds")}
        >
          <Text style={styles.buttonText}>
            My Builds ({savedBuilds.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/create-build")}
        >
          <Text style={styles.buttonText}>
            + Create Build
          </Text>
        </TouchableOpacity>
      </View>

      {/* Switch between build cards and API games */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "builds" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("builds")}
        >
          <Text style={styles.buttonText}>RPG Builds</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "games" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("games")}
        >
          <Text style={styles.buttonText}>Explore Games</Text>
        </TouchableOpacity>
      </View>

      {/* Search field */}
      <TextInput
        style={styles.search}
        placeholder={
          activeTab === "builds"
            ? "Search builds or classes..."
            : "Search video games..."
        }
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />

      {activeTab === "builds" ? (
        <>
          <Text style={styles.sectionTitle}>
            Character Builds
          </Text>

          {filteredBuilds.length === 0 ? (
            <Text style={styles.empty}>
              No matching builds found.
            </Text>
          ) : (
            filteredBuilds.map((build) => (
              <BuildCard
                key={build.id}
                build={build}
                onSave={handleSave}
              />
            ))
          )}
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>
            Explore RAWG Games
          </Text>

          {isLoading ? (
            <View style={styles.status}>
              <ActivityIndicator
                size="large"
                color="#B22222"
              />
              <Text style={styles.empty}>
                Loading games...
              </Text>
            </View>
          ) : isError ? (
            <View style={styles.status}>
              <Text style={styles.empty}>
                {error?.message || "Failed to load games."}
              </Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => refetch()}
              >
                <Text style={styles.buttonText}>
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          ) : games?.length === 0 ? (
            <Text style={styles.empty}>
              No games found. Try another search.
            </Text>
          ) : (
            games?.map((game) => (
              <GameCard key={game.id} game={game} />
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    color: "#AAAAAA",
    marginTop: 6,
    marginBottom: 20,
  },
  navigation: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  navButton: {
    flex: 1,
    backgroundColor: "#8B0000",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  tabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    backgroundColor: "#333333",
    padding: 14,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#8B0000",
  },
  search: {
    backgroundColor: "#242424",
    color: "#FFFFFF",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  empty: {
    color: "#AAAAAA",
    textAlign: "center",
    marginTop: 20,
  },
  status: {
    padding: 20,
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: "#8B0000",
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },
});
