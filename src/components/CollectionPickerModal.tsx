import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePokemonStore } from '../store/usePokemonStore';
import { collectionColor, colors } from '../theme/colors';
import { formatPokemonName } from '../utils/pokemon';
import { EmptyState } from './Feedback';
import { PokeballIcon } from './PokeballIcon';

type Props = { pokemonId: number | null; pokemonName: string; onClose: () => void };

//QJ Comment: This stores all of the collection cards.
//On this page, it is possible to create new collections and add pokemon to them
//It uses safe area view and keyboard avoiding view

export function CollectionPickerModal({ pokemonId, pokemonName, onClose }: Props) {
  const collections = usePokemonStore((state) => state.collections);
  const add = usePokemonStore((state) => state.addPokemonToCollection);
  const remove = usePokemonStore((state) => state.removePokemonFromCollection);
  const create = usePokemonStore((state) => state.createCollection);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');
  const [error, setError] = useState('');
  const creatingRef = useRef(false);
  const visible = collections.filter((collection) => collection.name.toLowerCase().includes(search.trim().toLowerCase()));

  function close() {
    setSearch(''); setCreating(false); setName(''); setTheme(''); setError('');
    onClose();
  }

  function createAndAdd() {
    if (pokemonId === null || creatingRef.current) return;
    creatingRef.current = true;
    try {
      create({ name, theme }, pokemonId);
      close();
    } catch {
      creatingRef.current = false;
      setError('Enter a collection name.');
    }
  }

  return <Modal visible={pokemonId !== null} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined}>
        <View style={styles.header}>
          <View><Text style={styles.eyebrow}>SAVE POKÉMON</Text><Text style={styles.title}>{formatPokemonName(pokemonName)}</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel="Close collection picker" onPress={close} style={styles.close}><Text style={styles.closeText}>Done</Text></Pressable>
        </View>
        {creating ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>
          <Text style={styles.section}>New collection</Text>
          <Text style={styles.label}>Name</Text>
          <TextInput accessibilityLabel="New collection name" autoFocus value={name} onChangeText={(value) => { setName(value); setError(''); }}
            maxLength={60} placeholder="e.g. Electric favorites" style={styles.input} returnKeyType="done" />
          <Text style={styles.label}>Theme or type (optional)</Text>
          <TextInput accessibilityLabel="Collection theme or type" value={theme} onChangeText={setTheme} maxLength={60}
            placeholder="e.g. Electric" style={styles.input} returnKeyType="done" />
          {!!error && <Text accessibilityLiveRegion="assertive" style={styles.error}>{error}</Text>}
          <Pressable accessibilityRole="button" accessibilityLabel={`Create collection and add ${formatPokemonName(pokemonName)}`}
            onPress={createAndAdd} style={styles.primary}><Text style={styles.primaryText}>Create & add Pokémon</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => setCreating(false)} style={styles.secondary}><Text style={styles.secondaryText}>Back to collections</Text></Pressable>
        </ScrollView> : <>
          <View style={styles.searchArea}>
            <TextInput accessibilityLabel="Search collections" value={search} onChangeText={setSearch} placeholder="Search your collections"
              autoCapitalize="none" style={styles.input} clearButtonMode="while-editing" />
            <Pressable accessibilityRole="button" accessibilityLabel="Create new collection" onPress={() => { creatingRef.current = false; setCreating(true); }} style={styles.primary}>
              <Text style={styles.primaryText}>＋ Create new collection</Text>
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list}>
            {visible.length === 0 ? <EmptyState title={collections.length ? 'No matching collections' : 'No collections yet'}
              message={collections.length ? 'Try a different search, or create a collection.' : 'Create one to save this Pokémon.'} /> : visible.map((collection) => {
                const selected = pokemonId !== null && collection.pokemonIds.includes(pokemonId);
                return <Pressable key={collection.id} accessibilityRole="checkbox" accessibilityState={{ checked: selected }}
                  accessibilityLabel={`${selected ? 'Remove' : 'Add'} ${formatPokemonName(pokemonName)} ${selected ? 'from' : 'to'} ${collection.name}`}
                  onPress={() => pokemonId !== null && (selected ? remove(collection.id, pokemonId) : add(collection.id, pokemonId))} style={styles.row}>
                  <PokeballIcon color={collectionColor(collection.id)} size={40} />
                  <View style={styles.rowText}><Text style={styles.rowName} numberOfLines={1}>{collection.name}</Text><Text style={styles.rowCount}>{collection.pokemonIds.length} Pokémon</Text></View>
                  <Text style={[styles.check, selected && styles.checked]}>{selected ? '✓' : '＋'}</Text>
                </Pressable>;
              })}
          </ScrollView>
        </>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  </Modal>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, flex: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: colors.white, borderBottomWidth: 1, borderColor: colors.border },
  eyebrow: { color: colors.redDark, fontSize: 11, fontWeight: '900', letterSpacing: 1 }, title: { color: colors.ink, fontSize: 23, fontWeight: '900' },
  close: { minWidth: 56, minHeight: 44, justifyContent: 'center', alignItems: 'center' }, closeText: { color: colors.blue, fontWeight: '800' },
  searchArea: { padding: 16 }, body: { padding: 20 }, list: { paddingHorizontal: 16, paddingBottom: 30 },
  section: { color: colors.ink, fontSize: 23, fontWeight: '900', marginBottom: 20 }, label: { color: colors.ink, fontWeight: '700', marginBottom: 8 },
  input: { minHeight: 48, borderRadius: 13, borderColor: colors.border, borderWidth: 1, backgroundColor: colors.white, paddingHorizontal: 15, color: colors.ink, marginBottom: 16 },
  primary: { minHeight: 48, borderRadius: 14, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }, primaryText: { color: colors.white, fontWeight: '800', fontSize: 15 },
  secondary: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 9 }, secondaryText: { color: colors.blue, fontWeight: '800' },
  error: { color: colors.redDark, marginBottom: 10 },
  row: { minHeight: 68, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  rowText: { flex: 1, marginLeft: 12 }, rowName: { color: colors.ink, fontSize: 15, fontWeight: '800' }, rowCount: { color: colors.muted, marginTop: 3 },
  check: { color: colors.blue, fontSize: 24, fontWeight: '800', width: 36, textAlign: 'center' }, checked: { color: colors.success },
});
