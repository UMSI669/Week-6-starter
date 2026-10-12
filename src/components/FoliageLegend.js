import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing, type } from '../theme/tokens';
import { FOLIAGE_STATUSES } from '../utils/foliageColors';

export function FoliageLegend() {
  return (
    <View accessibilityLabel="Foliage marker color legend" style={styles.legend}>
      {FOLIAGE_STATUSES.map((status) => (
        <View key={status.value} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: status.color }]} />
          <Text style={styles.label}>{status.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    maxWidth: 232,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.button,
    ...shadow,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    color: colors.textMuted,
    fontSize: type.label,
    fontWeight: '600',
  },
});
