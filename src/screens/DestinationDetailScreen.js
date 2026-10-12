import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';
import { FoliageStatusBadge } from '../components/FoliageStatusBadge';
import { ObservationCard } from '../components/ObservationCard';
import { PhotoGallery } from '../components/PhotoGallery';
import { getDestinationById } from '../data/destinations';
import { useTreeObservations } from '../hooks/useTreeObservations';
import { getFoliageStatusForRegion } from '../services/foliage';
import { useFallStore } from '../store/useFallStore';
import { colors, radius, spacing, type } from '../theme/tokens';
import { openDestinationInMaps } from '../utils/openMaps';

function formatReportDate(date) {
  if (!date) return null;
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

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
  const foliage = getFoliageStatusForRegion(destination.region);
  const photos = data.filter((observation) => observation.photoUrl).slice(0, 6);
  const heroPhoto = photos[0];

  async function openMaps() {
    try {
      await openDestinationInMaps(destination);
    } catch {
      Alert.alert('Unable to open Maps', 'Check your connection and try again.');
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <View style={styles.navigationBar}>
        <Pressable accessibilityLabel="Close destination details" accessibilityRole="button" hitSlop={8} onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons color={colors.text} name="close" size={26} />
        </Pressable>
        <Text style={styles.navigationTitle}>Destination details</Text>
        <Pressable accessibilityLabel={isFavorite ? 'Remove from saved destinations' : 'Save destination'} accessibilityRole="button" accessibilityState={{ selected: isFavorite }} hitSlop={8} onPress={() => toggleFavorite(destination.id)} style={styles.iconButton}>
          <Ionicons color={colors.primary} name={isFavorite ? 'bookmark' : 'bookmark-outline'} size={26} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          {heroPhoto ? (
            <Image accessibilityIgnoresInvertColors resizeMode="cover" source={{ uri: heroPhoto.photoUrl }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder}>
              {isLoading ? <ActivityIndicator color={colors.primary} size="large" /> : <Ionicons color={colors.primary} name="images-outline" size={44} />}
            </View>
          )}
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>{destination.region.toUpperCase()}</Text>
            <Text style={styles.title}>{destination.name}</Text>
            <Pressable accessibilityHint="Opens this destination in Maps" accessibilityRole="link" onPress={openMaps} style={styles.locationRow}>
              <Ionicons color={colors.primary} name="location" size={18} />
              <Text style={styles.locationText}>{destination.city}, Michigan</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable accessibilityRole="button" onPress={() => toggleFavorite(destination.id)} style={({ pressed }) => [styles.secondaryAction, isFavorite && styles.savedAction, pressed && styles.pressed]}>
            <Ionicons color={colors.primary} name={isFavorite ? 'bookmark' : 'bookmark-outline'} size={20} />
            <Text style={styles.secondaryActionText}>{isFavorite ? 'Saved' : 'Save'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={openMaps} style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}>
            <Ionicons color={colors.surface} name="navigate-outline" size={20} />
            <Text style={styles.primaryActionText}>Open in Maps</Text>
          </Pressable>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.sectionHeadingRow}>
            <View style={styles.sectionHeadingCopy}>
              <Text style={styles.sectionTitle}>Estimated Fall Color Status</Text>
              <Text style={styles.sectionSubtitle}>Regional report for {destination.region}</Text>
            </View>
            <FoliageStatusBadge foliage={foliage} />
          </View>
          {foliage.isAvailable ? (
            <View style={styles.reportDetails}>
              <Text style={styles.reportText}>Updated {formatReportDate(foliage.lastUpdated)}</Text>
              <Pressable accessibilityRole="link" onPress={() => Linking.openURL(foliage.sourceUrl)}>
                <Text style={styles.sourceLink}>Source: {foliage.source}</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.unavailableNotice}>
              <Ionicons color={colors.textMuted} name="information-circle-outline" size={20} />
              <View style={styles.unavailableCopy}>
                <Text style={styles.unavailableText}>Current foliage status unavailable. No report is shown until permitted source data is imported.</Text>
                <Pressable accessibilityRole="link" onPress={() => Linking.openURL(foliage.sourceUrl)}>
                  <Text style={styles.sourceLink}>Source access checked {formatReportDate(foliage.lastChecked)} · {foliage.source}</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeadingRow}>
            <View style={styles.sectionHeadingCopy}>
              <Text style={styles.sectionTitle}>Location Photos</Text>
              <Text style={styles.sectionSubtitle}>Nearby community photos from iNaturalist</Text>
            </View>
            {isFetching ? <ActivityIndicator color={colors.primary} /> : null}
          </View>
          {isLoading ? (
            <View style={styles.loadingCard}><ActivityIndicator color={colors.primary} /><Text style={styles.stateText}>Loading nearby location photos...</Text></View>
          ) : (
            <PhotoGallery photos={photos} />
          )}
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>About this destination</Text>
          <Text style={styles.description}>{destination.description}</Text>
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeadingRow}>
            <View style={styles.sectionHeadingCopy}>
              <Text style={styles.sectionTitle}>Recent Tree Observations</Text>
              <Text style={styles.sectionSubtitle}>See what nature observers have spotted nearby.</Text>
            </View>
            {isFetching && !isLoading ? <ActivityIndicator color={colors.primary} /> : null}
          </View>
          {isLoading ? (
            <View style={styles.loadingCard}><ActivityIndicator color={colors.primary} size="large" /><Text style={styles.stateText}>Loading recent tree observations...</Text></View>
          ) : isError ? (
            <View style={styles.loadingCard}>
              <Ionicons color={colors.primary} name="cloud-offline-outline" size={32} />
              <Text style={styles.stateTitle}>Unable to load tree observations.</Text>
              <Pressable accessibilityRole="button" onPress={() => refetch()} style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}><Text style={styles.retryText}>Retry</Text></Pressable>
            </View>
          ) : data.length === 0 ? (
            <View style={styles.loadingCard}><Ionicons color={colors.forest} name="leaf-outline" size={32} /><Text style={styles.stateTitle}>No recent tree observations found nearby.</Text></View>
          ) : (
            <ScrollView contentContainerStyle={styles.observationList} horizontal showsHorizontalScrollIndicator={false}>
              {data.map((observation) => <ObservationCard key={observation.id} observation={observation} />)}
            </ScrollView>
          )}
        </View>

        <View style={styles.disclaimer}>
          <Ionicons color={colors.forest} name="information-circle-outline" size={22} />
          <Text style={styles.disclaimerText}>iNaturalist photos document nearby biodiversity. They do not verify current park-wide fall color conditions.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  navigationBar: { minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg },
  navigationTitle: { color: colors.text, fontSize: type.body, fontWeight: '700' },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: 22 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  hero: { overflow: 'hidden', backgroundColor: colors.surface, borderRadius: radius.preview },
  heroImage: { width: '100%', height: 220, backgroundColor: colors.cream },
  heroPlaceholder: { width: '100%', height: 180, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.warningSurface },
  heroCopy: { padding: spacing.xl },
  eyebrow: { color: colors.forest, fontSize: type.label, fontWeight: '800', letterSpacing: 1.2 },
  title: { marginTop: spacing.sm, color: colors.text, fontSize: type.display, fontWeight: '800', lineHeight: 34 },
  locationRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  locationText: { color: colors.primaryDark, fontSize: type.body, fontWeight: '700', textDecorationLine: 'underline' },
  actionRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  secondaryAction: { minHeight: 48, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.button },
  savedAction: { backgroundColor: colors.warningSurface },
  secondaryActionText: { color: colors.primary, fontSize: type.body, fontWeight: '700' },
  primaryAction: { minHeight: 48, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.button },
  primaryActionText: { color: colors.surface, fontSize: type.body, fontWeight: '700' },
  statusCard: { marginTop: spacing.xxl, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.card },
  sectionBlock: { marginTop: spacing.xxl },
  sectionHeadingRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md, marginBottom: spacing.lg },
  sectionHeadingCopy: { minWidth: 0, flex: 1 },
  sectionTitle: { color: colors.text, fontSize: type.title, fontWeight: '800' },
  sectionSubtitle: { marginTop: spacing.xs, color: colors.textMuted, fontSize: type.small, lineHeight: 20 },
  reportDetails: { gap: spacing.sm },
  reportText: { color: colors.textMuted, fontSize: type.small },
  sourceLink: { color: colors.primaryDark, fontSize: type.small, fontWeight: '700', textDecorationLine: 'underline' },
  unavailableNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.cream, borderRadius: radius.button },
  unavailableText: { color: colors.textMuted, fontSize: type.small, lineHeight: 20 },
  unavailableCopy: { minWidth: 0, flex: 1, gap: spacing.sm },
  descriptionCard: { marginTop: spacing.xxl, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.card },
  description: { marginTop: spacing.md, color: colors.textMuted, fontSize: type.body, lineHeight: 24 },
  loadingCard: { alignItems: 'center', gap: spacing.md, padding: spacing.xl, backgroundColor: colors.surface, borderRadius: radius.card },
  stateTitle: { color: colors.text, fontSize: type.body, fontWeight: '700', textAlign: 'center' },
  stateText: { color: colors.textMuted, fontSize: type.small, lineHeight: 20, textAlign: 'center' },
  retryButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.xl, backgroundColor: colors.primary, borderRadius: radius.button },
  retryText: { color: colors.surface, fontSize: type.small, fontWeight: '700' },
  observationList: { gap: spacing.md, paddingRight: spacing.lg },
  disclaimer: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.xl, padding: spacing.md, backgroundColor: colors.successSurface, borderRadius: radius.button },
  disclaimerText: { flex: 1, color: colors.forest, fontSize: type.small, lineHeight: 20 },
  pressed: { opacity: 0.75 },
});
