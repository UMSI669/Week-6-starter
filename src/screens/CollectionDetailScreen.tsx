import { useState } from 'react';
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EmptyState } from '../components/Feedback';
import { PokemonCard } from '../components/PokemonCard';
import { PokeballIcon } from '../components/PokeballIcon';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { usePokemonStore } from '../store/usePokemonStore';
import { collectionColor, colors } from '../theme/colors';
import { fallbackPokemon } from '../utils/pokemon';

type Props = NativeStackScreenProps<RootStackParamList, 'CollectionDetail'>;

export function CollectionDetailScreen({ route, navigation }: Props) {
  const { collectionId } = route.params;
  const collection = usePokemonStore((state) => state.collections.find((item) => item.id === collectionId));
  const update = usePokemonStore((state) => state.updateCollection);
  const remove = usePokemonStore((state) => state.removePokemonFromCollection);
  const destroy = usePokemonStore((state) => state.deleteCollection);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(collection?.name ?? '');
  const [theme, setTheme] = useState(collection?.theme ?? '');
  const [error, setError] = useState('');

  if (!collection) return <EmptyState title="Collection unavailable" message="This collection may have been deleted." />;

  function save() {
    try { update(collectionId, { name, theme }); setError(''); setEditing(false); }
    catch { setError('Enter a collection name.'); }
  }

  function deleteConfirmed() { destroy(collectionId); navigation.goBack(); }
  function confirmDelete() {
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(`Delete ${collection?.name}? This cannot be undone.`)) deleteConfirmed();
    } else Alert.alert('Delete collection?', `Delete ${collection?.name}? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: deleteConfirmed },
    ]);
  }

  return <View style={styles.screen}>
    <FlatList data={collection.pokemonIds} keyExtractor={String} contentContainerStyle={styles.list}
      ListHeaderComponent={<View>
        <View style={styles.hero}>
          <PokeballIcon color={collectionColor(collection.id)} size={68} />
          <View style={styles.heroText}><Text style={styles.title} numberOfLines={2}>{collection.name}</Text>
            <Text style={styles.subtitle}>{collection.theme ? `${collection.theme} · ` : ''}{collection.pokemonIds.length} Pokémon</Text></View>
        </View>
        {editing ? <View style={styles.editor}>
          <Text style={styles.label}>Collection name</Text><TextInput accessibilityLabel="Edit collection name" value={name} onChangeText={(value) => { setName(value); setError(''); }} maxLength={60} style={styles.input} />
          <Text style={styles.label}>Theme or type</Text><TextInput accessibilityLabel="Edit collection theme" value={theme} onChangeText={setTheme} maxLength={60} style={styles.input} />
          {!!error && <Text accessibilityLiveRegion="assertive" style={styles.error}>{error}</Text>}
          <Pressable accessibilityRole="button" accessibilityLabel="Save collection changes" onPress={save} style={styles.primary}><Text style={styles.primaryText}>Save changes</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => { setEditing(false); setName(collection.name); setTheme(collection.theme ?? ''); }} style={styles.textButton}><Text style={styles.link}>Cancel editing</Text></Pressable>
        </View> : <View style={styles.actions}>
          <Pressable accessibilityRole="button" accessibilityLabel="Edit collection" onPress={() => setEditing(true)} style={styles.outline}><Text style={styles.outlineText}>Edit</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Delete collection" onPress={confirmDelete} style={styles.outline}><Text style={styles.deleteText}>Delete</Text></Pressable>
        </View>}
        <Pressable accessibilityRole="button" accessibilityLabel={`Search Pokémon to add to ${collection.name}`} onPress={() => navigation.navigate('AddPokemon', { collectionId })} style={styles.primary}><Text style={styles.primaryText}>＋ Search & add Pokémon</Text></Pressable>
        <Text style={styles.membersTitle}>Pokémon in this collection</Text>
      </View>}
      renderItem={({ item }) => <PokemonCard pokemon={fallbackPokemon(item)} onOpen={() => navigation.navigate('PokemonDetail', { pokemonId: item })}
        onCollectionPress={() => remove(collectionId, item)} inCollection collectionName={collection.name} />}
      ListEmptyComponent={<EmptyState title="A fresh collection" message="Search for Pokémon above to start filling it." />}
      initialNumToRender={6} maxToRenderPerBatch={6} windowSize={5} />
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, list: { paddingBottom: 30, flexGrow: 1 },
  hero: { backgroundColor: colors.white, padding: 20, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.border }, heroText: { flex: 1, marginLeft: 16 },
  title: { fontSize: 24, fontWeight: '900', color: colors.ink }, subtitle: { color: colors.muted, marginTop: 5 },
  actions: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 16 }, outline: { minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  outlineText: { color: colors.blue, fontWeight: '800' }, deleteText: { color: colors.redDark, fontWeight: '800' },
  primary: { minHeight: 50, backgroundColor: colors.red, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 16 }, primaryText: { color: colors.white, fontWeight: '900' },
  membersTitle: { color: colors.ink, fontSize: 18, fontWeight: '900', marginTop: 24, marginBottom: 8, marginHorizontal: 16 },
  editor: { paddingHorizontal: 16, paddingTop: 16 }, label: { color: colors.ink, fontWeight: '800', marginBottom: 7 }, input: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, minHeight: 48, borderRadius: 12, paddingHorizontal: 14, marginBottom: 12 },
  error: { color: colors.redDark }, textButton: { minHeight: 44, justifyContent: 'center', alignItems: 'center' }, link: { color: colors.blue, fontWeight: '800' },
});
