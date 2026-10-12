import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';


//QJ Comment: This series of functions is responsible for giving feedback to the user
export function LoadingState({ label = 'Loading Pokémon…' }: { label?: string }) {
  return <View style={styles.state} accessibilityLiveRegion="polite">
    <ActivityIndicator size="large" color={colors.red} accessibilityLabel={label} />
    <Text style={styles.message}>{label}</Text>
  </View>;
}

export function ErrorState({ onRetry, message = 'Pokémon data could not be loaded. Check your connection and try again.' }: { onRetry: () => void; message?: string }) {
  return <View style={styles.state} accessibilityLiveRegion="assertive">
    <Text style={styles.title}>Could not load Pokémon</Text>
    <Text style={styles.message}>{message}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="Retry loading Pokémon" onPress={onRetry} style={styles.button}>
      <Text style={styles.buttonText}>Retry</Text>
    </Pressable>
  </View>;
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return <View style={styles.state}>
    <Text style={styles.title}>{title}</Text><Text style={styles.message}>{message}</Text>
  </View>;
}

const styles = StyleSheet.create({
  state: { alignItems: 'center', justifyContent: 'center', padding: 28, minHeight: 150 },
  title: { color: colors.ink, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  message: { color: colors.muted, textAlign: 'center', lineHeight: 21, marginTop: 8 },
  button: { backgroundColor: colors.red, minHeight: 44, paddingHorizontal: 22, borderRadius: 22, justifyContent: 'center', marginTop: 16 },
  buttonText: { color: colors.white, fontWeight: '800' },
});
