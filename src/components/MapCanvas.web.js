import { forwardRef, useImperativeHandle } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing, type } from '../theme/tokens';
import { DestinationMarker } from './DestinationMarker';

const MICHIGAN_BOUNDS = {
  north: 47.5,
  south: 41.7,
  east: -82.2,
  west: -90.5,
};

function getMarkerPosition(destination) {
  const latitudeRange = MICHIGAN_BOUNDS.north - MICHIGAN_BOUNDS.south;
  const longitudeRange = MICHIGAN_BOUNDS.east - MICHIGAN_BOUNDS.west;

  return {
    left: `${((destination.longitude - MICHIGAN_BOUNDS.west) / longitudeRange) * 100}%`,
    top: `${((MICHIGAN_BOUNDS.north - destination.latitude) / latitudeRange) * 100}%`,
  };
}

export const MapCanvas = forwardRef(function MapCanvas(
  { destinations, selectedDestinationId, onSelectDestination },
  ref
) {
  // The native screen calls this method after selection. The web canvas does not need camera movement.
  useImperativeHandle(ref, () => ({ animateToRegion() {} }), []);

  return (
    <View accessibilityLabel="Illustrated map of Michigan destinations" style={styles.canvas}>
      <View style={styles.lakeSuperior} />
      <View style={styles.lakeMichigan} />
      <View style={styles.lakeHuron} />
      <View style={[styles.road, styles.roadNorth]} />
      <View style={[styles.road, styles.roadSouth]} />
      <View style={[styles.road, styles.roadDiagonal]} />

      <View style={styles.mapLabel}>
        <Text style={styles.mapLabelText}>MICHIGAN</Text>
        <Text style={styles.mapLabelSubtext}>Autumn destinations</Text>
      </View>

      {destinations.map((destination) => (
        <Pressable
          accessibilityLabel={`Select ${destination.name}, ${destination.region}`}
          accessibilityRole="button"
          accessibilityState={{ selected: destination.id === selectedDestinationId }}
          key={destination.id}
          onPress={() => onSelectDestination(destination)}
          style={({ pressed }) => [
            styles.marker,
            getMarkerPosition(destination),
            pressed && styles.markerPressed,
          ]}
        >
          <DestinationMarker selected={destination.id === selectedDestinationId} />
        </Pressable>
      ))}

      <View style={styles.webNotice}>
        <Text style={styles.webNoticeTitle}>Web map preview</Text>
        <Text style={styles.webNoticeText}>Tap a leaf to explore. Pan and zoom are available on iOS and Android.</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    backgroundColor: colors.mapLand,
  },
  lakeSuperior: {
    position: 'absolute',
    top: '-18%',
    left: '14%',
    width: '58%',
    height: '34%',
    backgroundColor: colors.mapWater,
    borderRadius: radius.pill,
    transform: [{ rotate: '-8deg' }],
  },
  lakeMichigan: {
    position: 'absolute',
    top: '29%',
    left: '25%',
    width: '20%',
    height: '64%',
    backgroundColor: colors.mapWater,
    borderRadius: radius.pill,
    transform: [{ rotate: '8deg' }],
  },
  lakeHuron: {
    position: 'absolute',
    top: '25%',
    right: '-8%',
    width: '42%',
    height: '48%',
    backgroundColor: colors.mapWater,
    borderRadius: radius.pill,
    transform: [{ rotate: '-12deg' }],
  },
  road: {
    position: 'absolute',
    height: 4,
    backgroundColor: colors.mapRoad,
    borderRadius: 2,
  },
  roadNorth: {
    top: '31%',
    left: '8%',
    width: '74%',
    transform: [{ rotate: '4deg' }],
  },
  roadSouth: {
    top: '73%',
    left: '8%',
    width: '82%',
    transform: [{ rotate: '-7deg' }],
  },
  roadDiagonal: {
    top: '56%',
    left: '20%',
    width: '68%',
    transform: [{ rotate: '48deg' }],
  },
  mapLabel: {
    position: 'absolute',
    top: '44%',
    left: '48%',
    alignItems: 'center',
  },
  mapLabelText: {
    color: colors.mapLabel,
    fontSize: type.heading,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  mapLabelSubtext: {
    marginTop: spacing.xs,
    color: colors.mapLabel,
    fontSize: type.label,
    fontWeight: '600',
  },
  marker: {
    position: 'absolute',
    marginTop: -32,
    marginLeft: -26,
  },
  markerPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.96 }],
  },
  webNotice: {
    position: 'absolute',
    right: spacing.lg,
    top: '24%',
    maxWidth: 240,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.button,
    ...shadow,
  },
  webNoticeTitle: {
    color: colors.text,
    fontSize: type.small,
    fontWeight: '800',
  },
  webNoticeText: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: type.label,
    lineHeight: 16,
  },
});
