import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DistanceFilter } from '../components/DistanceFilter';
import { FoliageLegend } from '../components/FoliageLegend';
import { IconButton } from '../components/IconButton';
import { LocationPreviewCard } from '../components/LocationPreviewCard';
import { MapCanvas } from '../components/MapCanvas';
import { SearchBar } from '../components/SearchBar';
import { destinations } from '../data/destinations';
import { useTreeObservations } from '../hooks/useTreeObservations';
import { getFoliageStatusForRegion } from '../services/foliage';
import { useFallStore } from '../store/useFallStore';
import { colors, radius, shadow, spacing, type } from '../theme/tokens';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import { openDestinationInMaps } from '../utils/openMaps';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [selectedId, setSelectedId] = useState('sleeping-bear');
  const [filterVisible, setFilterVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const favoriteIds = useFallStore((state) => state.favoriteIds);
  const toggleFavorite = useFallStore((state) => state.toggleFavorite);
  const distanceFilter = useFallStore((state) => state.distanceFilter);
  const setDistanceFilter = useFallStore((state) => state.setDistanceFilter);

  const destinationsWithDistance = useMemo(
    () =>
      destinations.map((destination) => ({
        ...destination,
        distance: calculateDistanceMiles(userLocation, destination),
        foliage: getFoliageStatusForRegion(destination.region),
      })),
    [userLocation]
  );

  const visibleDestinations = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return destinationsWithDistance.filter((destination) => {
      const matchesSearch = destination.name.toLowerCase().includes(normalizedSearch);
      const matchesDistance =
        distanceFilter === null ||
        (destination.distance !== null && destination.distance <= distanceFilter);

      return matchesSearch && matchesDistance;
    });
  }, [destinationsWithDistance, distanceFilter, searchText]);

  const selectedDestination =
    visibleDestinations.find((destination) => destination.id === selectedId) ||
    visibleDestinations[0];
  const previewObservations = useTreeObservations(selectedDestination);
  const previewPhoto = previewObservations.data?.find((observation) => observation.photoUrl);

  async function requestCurrentLocation() {
    setIsLocating(true);
    setLocationMessage('');

    try {
      // TODO(student): Explain why permission is requested only after the user taps this button.
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setLocationMessage('Location access is needed to find destinations near you.');
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coordinates = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      };

      setUserLocation(coordinates);
      mapRef.current?.animateToRegion(
        { ...coordinates, latitudeDelta: 1.5, longitudeDelta: 1.5 },
        700
      );
    } catch {
      setLocationMessage('We could not retrieve your location. Please try again.');
    } finally {
      setIsLocating(false);
    }
  }

  function selectDestination(destination) {
    setSelectedId(destination.id);
    mapRef.current?.animateToRegion(
      {
        latitude: destination.latitude,
        longitude: destination.longitude,
        latitudeDelta: 1.4,
        longitudeDelta: 1.4,
      },
      500
    );
  }

  function applyDistanceFilter(distance) {
    setDistanceFilter(distance);
    setFilterVisible(false);
  }

  async function openSelectedDestinationInMaps() {
    try {
      await openDestinationInMaps(selectedDestination);
    } catch {
      Alert.alert('Unable to open Maps', 'Please try again from the destination details screen.');
    }
  }

  return (
    <View style={styles.screen}>
      <MapCanvas
        destinations={visibleDestinations}
        onSelectDestination={selectDestination}
        ref={mapRef}
        selectedDestinationId={selectedDestination?.id}
        userLocation={userLocation}
      />

      <View pointerEvents="box-none" style={[styles.topOverlay, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.brandRow}>
          <View style={styles.brandCopy}>
            <View style={styles.brandTitleRow}>
              <Ionicons color={colors.primary} name="leaf" size={24} />
              <Text style={styles.brandTitle}>Michigan Fall Finder</Text>
            </View>
            <Text style={styles.tagline}>Find your next autumn adventure.</Text>
          </View>
          <IconButton
            disabled={isLocating}
            icon={isLocating ? 'hourglass-outline' : 'navigate-outline'}
            label="Use my current location"
            onPress={requestCurrentLocation}
            selected={Boolean(userLocation)}
          />
        </View>
        <SearchBar
          filterActive={distanceFilter !== null}
          onChangeText={setSearchText}
          onFilterPress={() => setFilterVisible(true)}
          value={searchText}
        />
        {locationMessage ? (
          <View style={styles.messagePill}>
            <Text numberOfLines={2} style={styles.messageText}>
              {locationMessage}
            </Text>
          </View>
        ) : null}
      </View>

      <View pointerEvents="none" style={[styles.legendPosition, { top: insets.top + 132 }]}>
        <FoliageLegend />
      </View>

      <View pointerEvents="box-none" style={styles.bottomOverlay}>
        {visibleDestinations.length === 0 ? (
          <View style={styles.noResultsCard}>
            <Ionicons color={colors.primary} name="search-outline" size={26} />
            <View style={styles.noResultsCopy}>
              <Text style={styles.noResultsTitle}>No destinations found.</Text>
              <Text style={styles.noResultsText}>Try another Michigan destination or clear the filter.</Text>
            </View>
          </View>
        ) : selectedDestination ? (
          <LocationPreviewCard
            destination={selectedDestination}
            distanceLabel={formatDistance(selectedDestination.distance)}
            foliage={selectedDestination.foliage}
            imageUrl={previewPhoto?.photoUrl}
            isFavorite={favoriteIds.includes(selectedDestination.id)}
            isImageLoading={previewObservations.isLoading}
            onFavoritePress={() => toggleFavorite(selectedDestination.id)}
            onLocationPress={openSelectedDestinationInMaps}
            onPress={() => router.push(`/destination/${selectedDestination.id}`)}
          />
        ) : null}
        <View style={styles.resultsPill}>
          <Text style={styles.resultsText}>
            {visibleDestinations.length} {visibleDestinations.length === 1 ? 'place' : 'places'}
            {distanceFilter ? ` within ${distanceFilter} mi` : ' across Michigan'}
          </Text>
        </View>
      </View>

      <DistanceFilter
        hasLocation={Boolean(userLocation)}
        onClose={() => setFilterVisible(false)}
        onRequestLocation={requestCurrentLocation}
        onSelect={applyDistanceFilter}
        selectedDistance={distanceFilter}
        visible={filterVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.headerOverlay,
  },
  brandRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  brandCopy: {
    flex: 1,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandTitle: {
    flexShrink: 1,
    color: colors.primaryDark,
    fontSize: type.heading,
    fontWeight: '800',
  },
  tagline: {
    marginTop: 2,
    color: colors.forest,
    fontSize: type.label,
    fontWeight: '600',
  },
  legendPosition: {
    position: 'absolute',
    left: spacing.lg,
  },
  messagePill: {
    alignSelf: 'flex-start',
    maxWidth: '92%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.button,
    ...shadow,
  },
  messageText: {
    color: colors.textMuted,
    fontSize: type.label,
    lineHeight: 16,
  },
  bottomOverlay: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    left: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  noResultsCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    ...shadow,
  },
  noResultsCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  noResultsTitle: {
    color: colors.text,
    fontSize: type.body,
    fontWeight: '700',
  },
  noResultsText: {
    color: colors.textMuted,
    fontSize: type.small,
  },
  resultsPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    ...shadow,
  },
  resultsText: {
    color: colors.forest,
    fontSize: type.label,
    fontWeight: '700',
  },
});
