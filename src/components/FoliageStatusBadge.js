import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, type } from '../theme/tokens';

export function FoliageStatusBadge({ foliage, compact = false }) {
  return (
    <View style={[styles.badge, compact && styles.compactBadge]}>
      <View style={[styles.dot, { backgroundColor: foliage.color }]} />
      <Text style={[styles.label, compact && styles.compactLabel]}>{foliage.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.cream,
    borderRadius: radius.pill,
  },
  compactBadge: {
    minHeight: 24,
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    color: colors.text,
    fontSize: type.small,
    fontWeight: '700',
  },
  compactLabel: {
    fontSize: type.label,
  },
});
