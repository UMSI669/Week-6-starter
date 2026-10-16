import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useBuildStore } from "../store/useBuildStore";
import { useRouter } from "expo-router";

export default function MyBuildsScreen() {
  const savedBuilds = useBuildStore(
    (state) => state.savedBuilds
  );

  const router = useRouter();

  const removeBuild = useBuildStore(
    (state) => state.removeBuild
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Builds</Text>

      <FlatList
        data={savedBuilds}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>
            You haven&apos;t saved any builds yet.
          </Text>
        }


        renderItem={({ item }) => (
            <View style={styles.card}>
                {item.image ? (
                    <Image
                    source={{ uri: item.image }}
                    style={styles.buildImage}
                    resizeMode="cover"
                    accessibilityLabel={`${item.game} cover`}
                    />
                ) : null}

            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.info}>{item.game}</Text>
            <Text style={styles.info}>{item.type}</Text>
            <Text style={styles.info}>{item.weapon}</Text>

            {item.stats && (
            <View style={{ marginTop: 12 }}>
                <Text
                style={{
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: 8,
                }}
                >
                Character Attributes
                </Text>

                {Object.entries(item.stats).map(([stat, value]) => (
                <Text key={stat} style={styles.info}>
                    {stat.charAt(0).toUpperCase() + stat.slice(1)}:
                    {" "}{value}
                </Text>
                ))}
            </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => removeBuild(item.id)}
            >
              <Text style={styles.buttonText}>
                Remove Build
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
                router.push({
                pathname: "/edit-build",
                params: { id: item.id },
                })
            }
            >
            <Text style={styles.buttonText}>Edit Build</Text>
            </TouchableOpacity>


          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
buildImage: {
  width: "100%",
  height: 180,
  borderRadius: 8,
  marginBottom: 12,
},
editButton: {
  backgroundColor: "#444444",
  padding: 12,
  borderRadius: 8,
  marginTop: 15,
},
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  header: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#242424",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  info: {
    color: "#aaa",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#8B0000",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  empty: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 30,
  },
});
