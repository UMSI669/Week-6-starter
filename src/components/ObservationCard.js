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
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={{ uri: observation.photoUrl }}
          style={styles.image}
        />
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
        <Text style={styles.date}>Observed: {formattedDate}</Text>
        {observation.photoAttribution ? (
          <Text numberOfLines={2} style={styles.attribution}>
            {observation.photoAttribution}
          </Text>
        ) : null}
      </View>
      <View style={styles.openIcon}>
        <Ionicons color={colors.surface} name="open-outline" size={18} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 224,
    overflow: 'hidden',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },
  image: {
    width: '100%',
    height: 136,
    backgroundColor: colors.cream,
    borderRadius: radius.button,
  },
  imageFallback: {
    width: '100%',
    height: 136,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successSurface,
    borderRadius: radius.button,
  },
  copy: {
    marginTop: spacing.md,
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
  attribution: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: type.label,
    lineHeight: 16,
  },
  openIcon: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
  },
  pressed: {
    opacity: 0.75,
  },
});
