import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing, type } from '../theme/tokens';
import { FoliageStatusBadge } from './FoliageStatusBadge';

export function LocationPreviewCard({
  destination,
  distanceLabel,
  foliage,
  imageUrl,
  isImageLoading,
  isFavorite,
  onFavoritePress,
  onLocationPress,
  onPress,
}) {
  const locationLabel = `${destination.city}, Michigan${distanceLabel ? ` · ${distanceLabel}` : ''}`;

  function stopAndRun(event, action) {
    event.stopPropagation();
    action();
  }

  return (
    <Pressable
      accessibilityHint="Opens destination details"
      accessibilityLabel={`${destination.name}, ${locationLabel}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageShell}>
        {imageUrl ? (
          <Image
            accessibilityIgnoresInvertColors
            accessibilityLabel={`Nearby iNaturalist observation near ${destination.name}`}
            resizeMode="cover"
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholder}>
            {isImageLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Ionicons color={colors.primary} name="image-outline" size={32} />
            )}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{destination.name}</Text>
          <Pressable
            accessibilityLabel={isFavorite ? 'Remove from saved destinations' : 'Save destination'}
            accessibilityRole="button"
            accessibilityState={{ selected: isFavorite }}
            hitSlop={8}
            onPress={(event) => stopAndRun(event, onFavoritePress)}
            style={styles.bookmarkButton}
          >
            <Ionicons
              color={colors.primary}
              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={24}
            />
          </Pressable>
        </View>

        <Pressable
          accessibilityHint="Opens this destination in Maps"
          accessibilityRole="link"
          onPress={(event) => stopAndRun(event, onLocationPress)}
          style={styles.locationRow}
        >
          <Ionicons color={colors.primary} name="location" size={16} />
          <Text style={styles.locationText}>{locationLabel}</Text>
        </Pressable>

        <FoliageStatusBadge compact foliage={foliage} />
        <Text numberOfLines={3} style={styles.description}>
          {destination.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 152,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.preview,
    ...shadow,
  },
  imageShell: {
    width: 120,
    height: 120,
    overflow: 'hidden',
    backgroundColor: colors.cream,
    borderRadius: radius.button,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warningSurface,
  },
  content: {
    minWidth: 0,
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: type.body,
    fontWeight: '800',
    lineHeight: 20,
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -spacing.sm,
    marginRight: -spacing.sm,
  },
  locationRow: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationText: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: type.label,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  description: {
    color: colors.textMuted,
    fontSize: type.label,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.82,
  },
});
