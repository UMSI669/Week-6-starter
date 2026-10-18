import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function BuildCard({ build, onSave }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: build.image }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title}>{build.name}</Text>
        <Text>Game: {build.game}</Text>
        <Text>Type: {build.type}</Text>
        <Text>Weapon: {build.weapon}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onSave(build)}
        >
          <Text style={styles.buttonText}>Save Build</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#242424",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  button: {
    backgroundColor: "#8B0000",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
