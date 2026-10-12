import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EmptyState, ErrorState, LoadingState } from '../components/Feedback';
import { PokemonCard } from '../components/PokemonCard';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { usePokemonList, usePokemonSearch } from '../hooks/pokemonQueries';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { usePokemonStore } from '../store/usePokemonStore';
import { colors } from '../theme/colors';
import { normalizePokemonSearch } from '../utils/pokemon';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPokemon'>;

export function AddPokemonScreen({ route, navigation }: Props) {
  const { collectionId } = route.params;
  const collection = usePokemonStore((state) => state.collections.find((item) => item.id === collectionId));
  const add = usePokemonStore((state) => state.addPokemonToCollection);
  const remove = usePokemonStore((state) => state.removePokemonFromCollection);
  const [search, setSearch] = useState('');
  const normalizedSearch = normalizePokemonSearch(search);
  const debounced = useDebouncedValue(normalizedSearch);
  const list = usePokemonList();
  const results = usePokemonSearch(debounced);
  const searching = !!debounced;
  const query = searching ? results : list;
  const items = searching ? results.data?.pages.flatMap((page) => page.items) ?? [] : list.data?.pages.flatMap((page) => page.items) ?? [];
  const waitingForDebounce = normalizedSearch !== debounced;

  if (!collection) return <EmptyState title="Collection unavailable" message="This collection may have been deleted." />;

  function loadMore() {
    if (searching && results.hasNextPage && !results.isFetchingNextPage) void results.fetchNextPage();
    if (!searching && list.hasNextPage && !list.isFetchingNextPage) void list.fetchNextPage();
  }

  return <View style={styles.screen}>
    <View style={styles.header}><Text style={styles.title}>Add to {collection.name}</Text>
      <View style={styles.searchRow}><TextInput accessibilityLabel={`Search Pokémon for ${collection.name}`} value={search} onChangeText={setSearch}
        autoCapitalize="none" autoCorrect={false} placeholder="Search by name" style={styles.input} />
        {!!search && <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setSearch('')} style={styles.clear}><Text style={styles.clearText}>✕</Text></Pressable>}</View>
      <Text style={styles.hint}>Tap a Poké Ball to add or remove a Pokémon.</Text></View>
    {(query.isPending || waitingForDebounce) && items.length === 0 ? <LoadingState label="Finding Pokémon…" />
      : query.isError && items.length === 0 ? <ErrorState onRetry={() => void query.refetch()} />
      : <FlatList data={waitingForDebounce ? [] : items} keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const selected = collection.pokemonIds.includes(item.id);
          return <PokemonCard pokemon={item} onOpen={() => navigation.navigate('PokemonDetail', { pokemonId: item.id })}
            inCollection={selected} collectionName={collection.name}
            onCollectionPress={() => selected ? remove(collectionId, item.id) : add(collectionId, item.id)} />;
        }}
        initialNumToRender={6} maxToRenderPerBatch={6} windowSize={5} onEndReached={loadMore} onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} tintColor={colors.red} />}
        ListEmptyComponent={<EmptyState title="No Pokémon found" message="Try another name or clear the search." />}
        ListFooterComponent={(searching ? results.isFetchingNextPage : list.isFetchingNextPage) ? <LoadingState label="Loading more Pokémon…" /> : null}
        contentContainerStyle={styles.list} />}
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, header: { backgroundColor: colors.white, padding: 16, borderBottomColor: colors.border, borderBottomWidth: 1 },
  title: { color: colors.ink, fontSize: 20, fontWeight: '900', marginBottom: 12 }, searchRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, borderRadius: 13, paddingHorizontal: 14, color: colors.ink },
  clear: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }, clearText: { color: colors.muted, fontSize: 20 },
  hint: { color: colors.muted, marginTop: 10 }, list: { paddingVertical: 10, flexGrow: 1 },
});
