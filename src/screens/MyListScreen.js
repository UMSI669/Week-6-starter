import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DestinationCard } from '../components/DestinationCard';
import { EmptyState } from '../components/EmptyState';
import { destinations } from '../data/destinations';
import { useFallStore } from '../store/useFallStore';
import { colors, spacing, type } from '../theme/tokens';

export default function MyListScreen() {
  const favoriteIds = useFallStore((state) => state.favoriteIds);
  const visitedIds = useFallStore((state) => state.visitedIds);
  const toggleFavorite = useFallStore((state) => state.toggleFavorite);
  const toggleVisited = useFallStore((state) => state.toggleVisited);
  const savedDestinations = destinations.filter(({ id }) => favoriteIds.includes(id));

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <FlatList
        contentContainerStyle={[
          styles.listContent,
          savedDestinations.length === 0 && styles.emptyListContent,
        ]}
        data={savedDestinations}
        keyExtractor={(destination) => destination.id}
        ListEmptyComponent={
          <EmptyState
            actionLabel="Explore destinations"
            description="Explore Michigan and save places you’d love to visit."
            icon="bookmark-outline"
            onAction={() => router.replace('/')}
            title="No saved destinations yet."
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>YOUR AUTUMN ITINERARY</Text>
            <Text style={styles.title}>My Fall List 🍂</Text>
            <Text style={styles.subtitle}>Your saved autumn adventures.</Text>
            {savedDestinations.length > 0 ? (
              <Text style={styles.count}>
                {savedDestinations.length} saved · {visitedIds.length} visited
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <DestinationCard
            destination={item}
            isFavorite
            isVisited={visitedIds.includes(item.id)}
            onDetailsPress={() => router.push(`/destination/${item.id}`)}
            onFavoritePress={() => toggleFavorite(item.id)}
            onVisitedPress={() => toggleVisited(item.id)}
            savedVariant
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  listContent: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: spacing.md,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: type.label,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: type.display,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: type.body,
  },
  count: {
    marginTop: spacing.md,
    color: colors.forest,
    fontSize: type.small,
    fontWeight: '700',
  },
});
