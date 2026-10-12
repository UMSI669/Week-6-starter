import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, type } from '../theme/tokens';

export function EmptyState({ icon = 'leaf-outline', title, description, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconShell}>
        <Ionicons color={colors.primary} name={icon} size={36} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconShell: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.warningSurface,
    borderRadius: 36,
  },
  title: {
    color: colors.text,
    fontSize: type.title,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    maxWidth: 300,
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: type.body,
    lineHeight: 24,
    textAlign: 'center',
  },
  button: {
    minHeight: 48,
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: radius.button,
  },
  buttonText: {
    color: colors.surface,
    fontSize: type.body,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
