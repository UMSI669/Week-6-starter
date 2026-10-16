
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";
import { useBuildStore } from "../store/useBuildStore";
import GamePicker from "../components/GamePicker";

const BUILD_TYPES = [
  "Strength",
  "Dexterity",
  "Intelligence",
  "Faith",
  "Arcane",
  "Hybrid",
];

const DEFAULT_STATS = {
  vigor: "10",
  mind: "10",
  endurance: "10",
  strength: "10",
  dexterity: "10",
  intelligence: "10",
  faith: "10",
  arcane: "10",
};

export default function CreateBuildScreen() {
  const router = useRouter();

  const addBuild = useBuildStore((state) => state.addBuild);

  
  const [name, setName] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const [type, setType] = useState("Strength");
  const [weapon, setWeapon] = useState("");
  const [stats, setStats] = useState({ ...DEFAULT_STATS });

  const updateStat = (stat, value) => {
    // Allow only whole-number input
    const cleaned = value.replace(/[^0-9]/g, "");

    setStats((previous) => ({
      ...previous,
      [stat]: cleaned,
    }));
  };

  const handleSave = () => {
    if (!selectedGame) {
      Alert.alert("Select a Game", "Search RAWG and select a game before saving your build.");
      return;
    }
    if (!name.trim() || !weapon.trim()) {
      Alert.alert(
        "Missing Information",
        "Please enter a build name and weapon."
      );
      return;
    }

    // Validate character attributes
    const parsedStats = {};

    for (const [key, value] of Object.entries(stats)) {
      const number = Number(value);

      if (
        value === "" ||
        !Number.isInteger(number) ||
        number < 1 ||
        number > 99
      ) {
        Alert.alert(
          "Invalid Stats",
          "Each stat must be between 1 and 99."
        );
        return;
      }

      parsedStats[key] = number;
    }

    const newBuild = {
      id: `custom-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`,

      name: name.trim(),

      // Game information retrieved from RAWG
      game: selectedGame.name,
      gameId: selectedGame.id,
      image: selectedGame.background_image ?? null,

      // User-created character information
      type,
      weapon: weapon.trim(),
      stats: parsedStats,
      isCustom: true,
    };

    addBuild(newBuild);

    Alert.alert(
      "Build Created",
      `${newBuild.name} has been saved!`,
      [
        {
          text: "View My Builds",
          onPress: () => router.replace("/my-builds"),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>Create Build</Text>

      <Text style={styles.subtitle}>
        Forge your own character build.
      </Text>

      <Text style={styles.label}>Build Name</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Moonlight Knight"
        placeholderTextColor="#777"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Game</Text>

      <GamePicker selectedGame={selectedGame} onSelect={setSelectedGame} />

      <Text style={styles.label}>Build Type</Text>

      <View style={styles.typeContainer}>
        {BUILD_TYPES.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.typeButton,
              type === item && styles.selectedType,
            ]}
            onPress={() => setType(item)}
          >
            <Text style={styles.typeText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Primary Weapon</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Dark Moon Greatsword"
        placeholderTextColor="#777"
        value={weapon}
        onChangeText={setWeapon}
      />

      <Text style={styles.sectionTitle}>
        Character Attributes
      </Text>

      <Text style={styles.hint}>
        Assign values between 1 and 99.
      </Text>

      {Object.entries(stats).map(([stat, value]) => (
        <View key={stat} style={styles.statRow}>
          <Text style={styles.statLabel}>
            {stat.charAt(0).toUpperCase() + stat.slice(1)}
          </Text>

          <TextInput
            style={styles.statInput}
            keyboardType="number-pad"
            value={value}
            maxLength={2}
            onChangeText={(text) => updateStat(stat, text)}
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>
          Save Custom Build
        </Text>
      </TouchableOpacity>
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
    paddingBottom: 60,
  },
  header: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#AAAAAA",
    fontSize: 15,
    marginBottom: 24,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: "#242424",
    color: "#FFFFFF",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },
  typeButton: {
    backgroundColor: "#333333",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  selectedType: {
    backgroundColor: "#8B0000",
  },
  typeText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 8,
  },
  hint: {
    color: "#AAAAAA",
    marginBottom: 14,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  statInput: {
    backgroundColor: "#242424",
    color: "#FFFFFF",
    width: 85,
    padding: 12,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#8B0000",
    padding: 18,
    borderRadius: 10,
    marginTop: 30,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
});
