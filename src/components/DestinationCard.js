import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing, type } from '../theme/tokens';

export function DestinationCard({
  destination,
  distanceLabel,
  isFavorite,
  isVisited = false,
  onFavoritePress,
  onDetailsPress,
  onVisitedPress,
  savedVariant = false,
}) {
  return (
    <View style={[styles.card, savedVariant && styles.savedCard]}>
      <View style={styles.topRow}>
        <View style={styles.thumbnail}>
          <Ionicons color={colors.surface} name="leaf" size={30} />
        </View>
        <View style={styles.content}>
          <Text numberOfLines={2} style={styles.title}>
            {destination.shortName}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons color={colors.textMuted} name="location" size={15} />
            <Text numberOfLines={1} style={styles.meta}>
              {destination.region}{distanceLabel ? `  ·  ${distanceLabel}` : ''}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityLabel={isFavorite ? 'Remove from saved destinations' : 'Save destination'}
          accessibilityRole="button"
          accessibilityState={{ selected: isFavorite }}
          hitSlop={8}
          onPress={onFavoritePress}
          style={styles.bookmarkButton}
        >
          <Ionicons
            color={colors.primary}
            name={isFavorite ? 'bookmark' : 'bookmark-outline'}
            size={26}
          />
        </Pressable>
      </View>

      {savedVariant ? (
        <View style={styles.savedActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isVisited }}
            onPress={onVisitedPress}
            style={({ pressed }) => [
              styles.visitedButton,
              isVisited && styles.visitedButtonActive,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              color={isVisited ? colors.forest : colors.textMuted}
              name={isVisited ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
            />
            <Text style={[styles.visitedText, isVisited && styles.visitedTextActive]}>
              {isVisited ? 'Visited' : 'Mark visited'}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onDetailsPress}
            style={({ pressed }) => [styles.detailsButton, pressed && styles.pressed]}
          >
            <Text style={styles.detailsButtonText}>View details</Text>
            <Ionicons color={colors.surface} name="arrow-forward" size={18} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.previewFooter}>
          <Text numberOfLines={2} style={styles.description}>
            {destination.description}
          </Text>
          <Pressable
            accessibilityLabel={`View details for ${destination.name}`}
            accessibilityRole="button"
            onPress={onDetailsPress}
            style={({ pressed }) => [styles.roundDetails, pressed && styles.pressed]}
          >
            <Ionicons color={colors.surface} name="arrow-forward" size={20} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    ...shadow,
  },
  savedCard: {
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0.08,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  thumbnail: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.button,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: type.heading,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  meta: {
    flex: 1,
    color: colors.textMuted,
    fontSize: type.small,
  },
  bookmarkButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  description: {
    flex: 1,
    color: colors.textMuted,
    fontSize: type.small,
    lineHeight: 20,
  },
  roundDetails: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 22,
  },
  savedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  visitedButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.cream,
    borderRadius: radius.button,
  },
  visitedButtonActive: {
    backgroundColor: colors.successSurface,
  },
  visitedText: {
    color: colors.textMuted,
    fontSize: type.small,
    fontWeight: '600',
  },
  visitedTextActive: {
    color: colors.forest,
  },
  detailsButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.button,
  },
  detailsButtonText: {
    color: colors.surface,
    fontSize: type.small,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
