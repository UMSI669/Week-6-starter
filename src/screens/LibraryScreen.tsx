import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CollectionCard } from '../components/CollectionCard';
import { EmptyState, LoadingState } from '../components/Feedback';
import { PokemonCard } from '../components/PokemonCard';
import { CollectionPickerModal } from '../components/CollectionPickerModal';
import type { PokemonRef } from '../api/types';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { usePokemonStore } from '../store/usePokemonStore';
import { colors } from '../theme/colors';
import { fallbackPokemon } from '../utils/pokemon';

export function LibraryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const hydrated = usePokemonStore((state) => state.hydrated);
  const favoriteIds = usePokemonStore((state) => state.favoritePokemonIds);
  // TODO(SI 669): Explain how local favorite IDs combine with Query detail data inside each card.
  const collections = usePokemonStore((state) => state.collections);
  const create = usePokemonStore((state) => state.createCollection);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');
  const [error, setError] = useState('');
  const [picked, setPicked] = useState<PokemonRef | null>(null);

  function createCollection() {
    try {
      const id = create({ name, theme });
      setName(''); setTheme(''); setError(''); setCreating(false);
      navigation.navigate('CollectionDetail', { collectionId: id });
    } catch { setError('Enter a collection name.'); }
  }

  if (!hydrated) return <LoadingState label="Opening your library…" />;
  return <View style={styles.screen}>
    <FlatList data={favoriteIds} keyExtractor={String} contentContainerStyle={styles.list}
      ListHeaderComponent={<View>
        <View style={styles.intro}><Text style={styles.title}>Your Pokémon, your way</Text><Text style={styles.subtitle}>Favorites and collections stay on this device.</Text></View>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Collections</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Create new collection" onPress={() => setCreating(true)} style={styles.newButton}><Text style={styles.newText}>＋ New</Text></Pressable>
        </View>
        <View style={styles.collectionList}>{collections.length ? collections.map((collection) => <CollectionCard key={collection.id} collection={collection}
          onPress={() => navigation.navigate('CollectionDetail', { collectionId: collection.id })} />)
          : <EmptyState title="No collections yet" message="Create a collection for a type, a theme, or any idea you like." />}</View>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Favorites</Text><Text style={styles.count}>{favoriteIds.length}</Text></View>
      </View>}
      renderItem={({ item }) => <PokemonCard pokemon={fallbackPokemon(item)} onOpen={() => navigation.navigate('PokemonDetail', { pokemonId: item })} onCollectionPress={(name) => setPicked({ id: item, name })} />}
      ListEmptyComponent={<EmptyState title="No favorites yet" message="Tap a heart while browsing to save a Pokémon here." />}
      initialNumToRender={6} maxToRenderPerBatch={6} windowSize={5} />
    <CollectionPickerModal pokemonId={picked?.id ?? null} pokemonName={picked?.name ?? ''} onClose={() => setPicked(null)} />
    <Modal visible={creating} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setCreating(false)}>
      <SafeAreaView style={styles.modal} edges={['top', 'bottom']}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined} style={styles.modalBody}>
        <View style={styles.modalHeader}><Text style={styles.modalTitle}>Create collection</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Close create collection" onPress={() => setCreating(false)} style={styles.close}><Text style={styles.closeText}>Cancel</Text></Pressable></View>
        <Text style={styles.label}>Name</Text><TextInput accessibilityLabel="New collection name" autoFocus value={name} onChangeText={(value) => { setName(value); setError(''); }}
          maxLength={60} placeholder="e.g. My Water Team" style={styles.input} />
        <Text style={styles.label}>Theme or type (optional)</Text><TextInput accessibilityLabel="Collection theme or type" value={theme} onChangeText={setTheme} maxLength={60} placeholder="e.g. Water" style={styles.input} />
        {!!error && <Text style={styles.error} accessibilityLiveRegion="assertive">{error}</Text>}
        <Pressable accessibilityRole="button" accessibilityLabel="Create collection" onPress={createCollection} style={styles.primary}><Text style={styles.primaryText}>Create collection</Text></Pressable>
      </KeyboardAvoidingView></SafeAreaView>
    </Modal>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, list: { paddingBottom: 24, flexGrow: 1 },
  intro: { padding: 20, backgroundColor: colors.white }, title: { color: colors.ink, fontSize: 22, fontWeight: '900' }, subtitle: { color: colors.muted, marginTop: 5 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 20, marginBottom: 10 },
  sectionTitle: { color: colors.ink, fontSize: 19, fontWeight: '900' }, count: { color: colors.blue, fontWeight: '900' },
  newButton: { minHeight: 44, minWidth: 70, borderRadius: 22, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }, newText: { color: colors.white, fontWeight: '900' },
  collectionList: { marginHorizontal: 16 }, modal: { flex: 1, backgroundColor: colors.background }, modalBody: { flex: 1, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }, modalTitle: { color: colors.ink, fontSize: 23, fontWeight: '900' },
  close: { minHeight: 44, justifyContent: 'center' }, closeText: { color: colors.blue, fontWeight: '800' }, label: { color: colors.ink, fontWeight: '800', marginBottom: 8 },
  input: { minHeight: 48, backgroundColor: colors.white, borderRadius: 13, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, marginBottom: 18, color: colors.ink },
  error: { color: colors.redDark, marginBottom: 10 }, primary: { minHeight: 48, borderRadius: 14, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: colors.white, fontWeight: '900' },
});
