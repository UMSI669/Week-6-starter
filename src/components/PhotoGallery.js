import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, type } from '../theme/tokens';

export function PhotoGallery({ photos }) {
  if (photos.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons color={colors.textMuted} name="images-outline" size={28} />
        <Text style={styles.emptyTitle}>Location photos unavailable.</Text>
        <Text style={styles.emptyText}>Nearby iNaturalist photos will appear when available.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {photos.map((photo) => (
        <View key={photo.id} style={styles.photoCard}>
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="cover"
            source={{ uri: photo.photoUrl }}
            style={styles.photo}
          />
          <Text numberOfLines={2} style={styles.attribution}>
            {photo.photoAttribution || 'Photo via iNaturalist'}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  photoCard: {
    width: 248,
  },
  photo: {
    width: 248,
    height: 160,
    backgroundColor: colors.cream,
    borderRadius: radius.card,
  },
  attribution: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: type.label,
    lineHeight: 16,
  },
  empty: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
  },
  emptyTitle: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: type.body,
    fontWeight: '700',
  },
  emptyText: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: type.small,
    textAlign: 'center',
  },
});
