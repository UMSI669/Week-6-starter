import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';
import { ObservationCard } from '../components/ObservationCard';
import { getDestinationById } from '../data/destinations';
import { useTreeObservations } from '../hooks/useTreeObservations';
import { useFallStore } from '../store/useFallStore';
import { colors, radius, spacing, type } from '../theme/tokens';

export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams();
  const destination = getDestinationById(Array.isArray(id) ? id[0] : id);
  const favoriteIds = useFallStore((state) => state.favoriteIds);
  const toggleFavorite = useFallStore((state) => state.toggleFavorite);
  const { data = [], isLoading, isError, isFetching, refetch } = useTreeObservations(destination);

  if (!destination) {
    return (
      <SafeAreaView style={styles.screen}>
        <EmptyState
          actionLabel="Return to map"
          description="This Michigan destination could not be found."
          icon="map-outline"
          onAction={() => router.replace('/')}
          title="Destination unavailable"
        />
      </SafeAreaView>
    );
  }

  const isFavorite = favoriteIds.includes(destination.id);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <View style={styles.navigationBar}>
        <Pressable
          accessibilityLabel="Close destination details"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons color={colors.text} name="close" size={26} />
        </Pressable>
        <Text style={styles.navigationTitle}>Destination details</Text>
        <Pressable
          accessibilityLabel={isFavorite ? 'Remove from saved destinations' : 'Save destination'}
          accessibilityRole="button"
          accessibilityState={{ selected: isFavorite }}
          hitSlop={8}
          onPress={() => toggleFavorite(destination.id)}
          style={styles.iconButton}
        >
          <Ionicons
            color={colors.primary}
            name={isFavorite ? 'bookmark' : 'bookmark-outline'}
            size={26}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons color={colors.surface} name="leaf" size={42} />
          </View>
          <Text style={styles.eyebrow}>{destination.region.toUpperCase()}</Text>
          <Text style={styles.title}>{destination.name}</Text>
          <Text style={styles.description}>{destination.description}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => toggleFavorite(destination.id)}
            style={({ pressed }) => [
              styles.saveButton,
              isFavorite && styles.saveButtonActive,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              color={isFavorite ? colors.primary : colors.surface}
              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={20}
            />
            <Text style={[styles.saveText, isFavorite && styles.saveTextActive]}>
              {isFavorite ? 'Saved to My List' : 'Save destination'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeadingRow}>
          <View>
            <Text style={styles.sectionTitle}>Nearby Tree Observations</Text>
            <Text style={styles.sectionSubtitle}>Recent research-grade maple sightings from iNaturalist</Text>
          </View>
          {isFetching && !isLoading ? <ActivityIndicator color={colors.primary} /> : null}
        </View>

        {isLoading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.stateText}>Loading nearby tree observations...</Text>
          </View>
        ) : isError ? (
          <View style={styles.stateCard}>
            <Ionicons color={colors.primary} name="cloud-offline-outline" size={32} />
            <Text style={styles.stateTitle}>Unable to load tree observations.</Text>
            <Text style={styles.stateText}>The destination details are still available while you try again.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => refetch()}
              style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
            >
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : data.length === 0 ? (
          <View style={styles.stateCard}>
            <Ionicons color={colors.forest} name="leaf-outline" size={32} />
            <Text style={styles.stateTitle}>No tree observations found near this destination.</Text>
          </View>
        ) : (
          <View style={styles.observationList}>
            {data.map((observation) => (
              <ObservationCard key={observation.id} observation={observation} />
            ))}
          </View>
        )}

        <View style={styles.disclaimer}>
          <Ionicons color={colors.forest} name="information-circle-outline" size={22} />
          <Text style={styles.disclaimerText}>
            iNaturalist observations show nearby biodiversity. They are not an official or real-time fall foliage forecast.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  navigationBar: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.cream,
  },
  navigationTitle: {
    color: colors.text,
    fontSize: type.body,
    fontWeight: '700',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hero: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
  },
  heroIcon: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.card,
  },
  eyebrow: {
    color: colors.forest,
    fontSize: type.label,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: type.display,
    fontWeight: '800',
    lineHeight: 34,
  },
  description: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: type.body,
    lineHeight: 24,
  },
  saveButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.button,
  },
  saveButtonActive: {
    backgroundColor: colors.warningSurface,
    borderColor: colors.gold,
  },
  saveText: {
    color: colors.surface,
    fontSize: type.body,
    fontWeight: '700',
  },
  saveTextActive: {
    color: colors.primaryDark,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: type.title,
    fontWeight: '800',
  },
  sectionSubtitle: {
    maxWidth: 320,
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: type.small,
    lineHeight: 20,
  },
  observationList: {
    gap: spacing.md,
  },
  stateCard: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
  },
  stateTitle: {
    color: colors.text,
    fontSize: type.body,
    fontWeight: '700',
    textAlign: 'center',
  },
  stateText: {
    color: colors.textMuted,
    fontSize: type.small,
    lineHeight: 20,
    textAlign: 'center',
  },
  retryButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: radius.button,
  },
  retryText: {
    color: colors.surface,
    fontSize: type.small,
    fontWeight: '700',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.successSurface,
    borderRadius: radius.button,
  },
  disclaimerText: {
    flex: 1,
    color: colors.forest,
    fontSize: type.small,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.75,
  },
});
