
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";

export default function GameCard({ game }) {
  return (
    <View style={styles.card}>
      {game.background_image && (
        <Image
          source={{ uri: game.background_image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{game.name}</Text>

        <Text style={styles.info}>
          Rating: {game.rating ?? "N/A"} / 5
        </Text>

        <Text style={styles.info}>
          Released: {game.released ?? "Unknown"}
        </Text>

        <Text style={styles.info}>
          Genres:{" "}
          {game.genres?.map((genre) => genre.name).join(", ") ||
            "Unknown"}
        </Text>
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
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  info: {
    color: "#AAAAAA",
    marginTop: 4,
  },
});
