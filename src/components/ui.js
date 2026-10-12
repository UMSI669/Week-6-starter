import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';

/** @param {{children: import('react').ReactNode, onPress: () => void, disabled?: boolean, destructive?: boolean, secondary?: boolean, style?: import('react-native').StyleProp<import('react-native').ViewStyle>}} props */
export function Button({ children, onPress, disabled = false, destructive = false, secondary = false, style }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [styles.button, secondary && styles.secondary, destructive && styles.destructive, (disabled || pressed) && styles.dimmed, style]}>
    <Text style={[styles.buttonText, secondary && styles.secondaryText, destructive && styles.destructiveText]}>{children}</Text>
  </Pressable>;
}
export function LoadingView({ message = 'Loading weather…' }) {
  return <View style={styles.loading}><ActivityIndicator color={colors.secondary} /><Text style={styles.copy}>{message}</Text></View>;
}
export function Message({ children, error = false }) {
  return <View style={styles.message}><Text accessibilityRole={error ? 'alert' : undefined} style={[styles.copy, error && styles.error]}>{children}</Text></View>;
}
export const sharedStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.bottom, gap: spacing.lg, width: '100%', maxWidth: 680, alignSelf: 'center' },
  title: { ...typography.title, color: colors.white },
  eyebrow: { ...typography.eyebrow, color: colors.muted },
  copy: { ...typography.body, color: colors.muted, lineHeight: 21 },
  input: { ...typography.input, backgroundColor: colors.input, borderRadius: radii.input, color: colors.text, paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, minHeight: 48 },
  label: { ...typography.button, color: colors.heroText, marginBottom: spacing.sm },
  error: { ...typography.small, color: colors.dangerText, marginTop: spacing.sm },
});
const styles = StyleSheet.create({
  button: { minHeight: 48, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.input, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center' },
  buttonText: { ...typography.button, color: colors.text },
  secondary: { backgroundColor: colors.panel }, secondaryText: { color: colors.heroText },
  destructive: { backgroundColor: colors.danger }, destructiveText: { color: colors.white },
  dimmed: { opacity: 0.55 },
  loading: { padding: spacing.xxl, gap: spacing.md, alignItems: 'center', backgroundColor: colors.background },
  copy: { ...typography.body, color: colors.muted, textAlign: 'center', lineHeight: 21 },
  message: { backgroundColor: colors.panel, borderRadius: radii.button, padding: spacing.lg },
  error: { color: colors.dangerText },
});
