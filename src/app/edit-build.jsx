
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

import { useLocalSearchParams, useRouter } from "expo-router";
import { useBuildStore } from "../store/useBuildStore";

const BUILD_TYPES = [
  "Strength",
  "Dexterity",
  "Intelligence",
  "Faith",
  "Arcane",
  "Hybrid",
];

const DEFAULT_STATS = {
  vigor: 10,
  mind: 10,
  endurance: 10,
  strength: 10,
  dexterity: 10,
  intelligence: 10,
  faith: 10,
  arcane: 10,
};

export default function EditBuildScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Retrieve the selected build from shared Zustand state.
  const build = useBuildStore((state) =>
    state.savedBuilds.find((item) => item.id === id)
  );

  const updateBuild = useBuildStore(
    (state) => state.updateBuild
  );

  // Initialize the form with the selected build's values.
  const [name, setName] = useState(build?.name ?? "");
  const [game, setGame] = useState(build?.game ?? "");
  const [type, setType] = useState(build?.type ?? "Strength");
  const [weapon, setWeapon] = useState(build?.weapon ?? "");

  const [stats, setStats] = useState(() => {
    const initialStats = {
      ...DEFAULT_STATS,
      ...(build?.stats ?? {}),
    };

    return Object.fromEntries(
      Object.entries(initialStats).map(([key, value]) => [
        key,
        String(value),
      ])
    );
  });

  const updateStat = (stat, value) => {
    const cleaned = value.replace(/[^0-9]/g, "");

    setStats((previous) => ({
      ...previous,
      [stat]: cleaned,
    }));
  };

  const handleSave = () => {
    if (!build) return;

    if (!name.trim() || !game.trim() || !weapon.trim()) {
      Alert.alert(
        "Missing Information",
        "Please complete all required fields."
      );
      return;
    }

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
          "Each attribute must be between 1 and 99."
        );
        return;
      }

      parsedStats[key] = number;
    }

    updateBuild(build.id, {
      name: name.trim(),
      game: game.trim(),
      type,
      weapon: weapon.trim(),
      stats: parsedStats,
    });

    // Return to the collection after saving.
    router.replace("/my-builds");
  };

  if (!build) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Build Not Found</Text>
        <Text style={styles.subtitle}>
          This build may have been removed or is no longer available.
        </Text>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => router.replace("/my-builds")}
        >
          <Text style={styles.saveButtonText}>
            Return to My Builds
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>Edit Build</Text>

      <Text style={styles.subtitle}>
        Customize your {build.name} build.
      </Text>

      <Text style={styles.label}>Build Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Build name"
        placeholderTextColor="#777"
      />

      <Text style={styles.label}>Game</Text>
      <TextInput
        style={styles.input}
        value={game}
        onChangeText={setGame}
        editable={!build.gameId}
        placeholder="Game title"
        placeholderTextColor="#777"
      />

      {build.gameId && <Text style={styles.subtitle}>This game is linked to your selected RAWG cover.</Text>}

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
        value={weapon}
        onChangeText={setWeapon}
        placeholder="Primary weapon"
        placeholderTextColor="#777"
      />

      <Text style={styles.sectionTitle}>
        Character Attributes
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
          Save Changes
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelButtonText}>
          Cancel
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
    marginBottom: 15,
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
  cancelButton: {
    padding: 16,
    marginTop: 12,
  },
  cancelButtonText: {
    color: "#AAAAAA",
    textAlign: "center",
    fontSize: 16,
  },
});
