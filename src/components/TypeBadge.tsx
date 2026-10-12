import { StyleSheet, Text, View } from 'react-native';
import { typeColors } from '../theme/colors';
import { formatPokemonName } from '../utils/pokemon';

// QJ Comment: this is where type badges are initialized.
export function TypeBadge({ type }: { type: string }) {
  return <View style={[styles.badge, { backgroundColor: typeColors[type] ?? '#526174' }]}>
    <Text style={styles.text}>{formatPokemonName(type)}</Text>
  </View>;
}

const styles = StyleSheet.create({
  badge: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 4, marginRight: 5, marginTop: 5 },
  text: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
});
