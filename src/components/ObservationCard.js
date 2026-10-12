import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, type } from '../theme/tokens';

export function ObservationCard({ observation }) {
  const formattedDate = observation.observedOn
    ? new Date(`${observation.observedOn}T12:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date not recorded';

  return (
    <Pressable
      accessibilityHint="Opens this observation on iNaturalist"
      accessibilityRole="link"
      onPress={() => Linking.openURL(observation.observationUrl)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {observation.photoUrl ? (
        <Image accessibilityIgnoresInvertColors source={{ uri: observation.photoUrl }} style={styles.image} />
      ) : (
        <View style={styles.imageFallback}>
          <Ionicons color={colors.forest} name="leaf-outline" size={28} />
        </View>
      )}
      <View style={styles.copy}>
        <Text numberOfLines={2} style={styles.title}>
          {observation.speciesName}
        </Text>
        {observation.scientificName ? (
          <Text numberOfLines={1} style={styles.scientificName}>
            {observation.scientificName}
          </Text>
        ) : null}
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <Ionicons color={colors.primary} name="open-outline" size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },
  image: {
    width: 72,
    height: 72,
    backgroundColor: colors.cream,
    borderRadius: radius.button,
  },
  imageFallback: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successSurface,
    borderRadius: radius.button,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.text,
    fontSize: type.body,
    fontWeight: '700',
  },
  scientificName: {
    color: colors.textMuted,
    fontSize: type.small,
    fontStyle: 'italic',
  },
  date: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: type.label,
  },
  pressed: {
    opacity: 0.75,
  },
});
