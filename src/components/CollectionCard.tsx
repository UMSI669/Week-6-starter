import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Collection } from '../store/usePokemonStore';
import { collectionColor, colors } from '../theme/colors';
import { PokeballIcon } from './PokeballIcon';

//QJ Comment: This is where our collection cards are established. It uses the CSS PokeballIcon.
//It also uses the type Collection from usePokemonStore
//It is a pressable button that opens up its respective collection
export function CollectionCard({ collection, onPress }: { collection: Collection; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${collection.name}, ${collection.pokemonIds.length} Pokémon`}
    onPress={onPress} style={styles.card}>
    <View style={styles.icon}><PokeballIcon color={collectionColor(collection.id)} size={48} /></View>
    <View style={styles.text}>
      <Text style={styles.name} numberOfLines={1}>{collection.name}</Text>
      <Text style={styles.meta} numberOfLines={1}>{collection.theme ? `${collection.theme} · ` : ''}{collection.pokemonIds.length} Pokémon</Text>
    </View>
    <Text style={styles.chevron}>›</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  card: { minHeight: 78, backgroundColor: colors.white, borderRadius: 16, borderColor: colors.border, borderWidth: 1, flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 9 },
  icon: { width: 58, alignItems: 'center' }, text: { flex: 1, marginHorizontal: 8 },
  name: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  meta: { color: colors.muted, marginTop: 4 }, chevron: { color: colors.blue, fontSize: 29, marginHorizontal: 7 },
});
