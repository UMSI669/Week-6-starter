import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PokemonRef } from '../api/types';
import { CollectionPickerModal } from '../components/CollectionPickerModal';
import { EmptyState, ErrorState, LoadingState } from '../components/Feedback';
import { PokemonCard } from '../components/PokemonCard';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { usePokemonList, usePokemonSearch, usePokemonTypes, useTypePokemon } from '../hooks/pokemonQueries';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme/colors';
import { formatPokemonName, normalizePokemonSearch } from '../utils/pokemon';

export function BrowseScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [picked, setPicked] = useState<PokemonRef | null>(null);
  const normalizedSearch = normalizePokemonSearch(search);
  const debounced = useDebouncedValue(normalizedSearch);
  const list = usePokemonList();
  const searchQuery = usePokemonSearch(type ? '' : debounced);
  const types = usePokemonTypes();
  const typeQuery = useTypePokemon(type);
  const mode = type ? 'type' : debounced ? 'search' : 'list';
  const query = mode === 'type' ? typeQuery : mode === 'search' ? searchQuery : list;
  const typeItems = typeQuery.data?.filter((pokemon) => pokemon.name.includes(debounced)) ?? [];
  const items = mode === 'type' ? typeItems
    : mode === 'search' ? searchQuery.data?.pages.flatMap((page) => page.items) ?? []
      : list.data?.pages.flatMap((page) => page.items) ?? [];
  const waitingForDebounce = normalizedSearch !== debounced;
  const busy = query.isPending || waitingForDebounce;
  const error = query.isError;

  function loadMore() {
    if (mode === 'search' && searchQuery.hasNextPage && !searchQuery.isFetchingNextPage) void searchQuery.fetchNextPage();
    else if (mode === 'list' && list.hasNextPage && !list.isFetchingNextPage) void list.fetchNextPage();
  }

  function refresh() { void query.refetch(); }

  return <View style={styles.screen}>
    <View style={styles.controls}>
      <Text style={styles.heading}>Find your next favorite</Text>
      <View style={styles.searchRow}>
        <TextInput accessibilityLabel="Search Pokémon by name" value={search} onChangeText={setSearch}
          autoCapitalize="none" autoCorrect={false} placeholder="Search Pokémon by name" style={styles.input} />
        {!!search && <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setSearch('')} style={styles.clear}><Text style={styles.clearText}>✕</Text></Pressable>}
      </View>
      <View style={styles.filterHeading}><Text style={styles.filterTitle}>Browse by type</Text>
        {!!type && <Pressable accessibilityRole="button" accessibilityLabel="Clear type filter" onPress={() => setType('')} style={styles.filterClear}><Text style={styles.filterClearText}>Clear filter</Text></Pressable>}
      </View>
      {types.isError ? <Pressable accessibilityRole="button" onPress={() => void types.refetch()} style={styles.typeError}><Text style={styles.filterClearText}>Types unavailable · Retry</Text></Pressable>
        : <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Pressable accessibilityRole="button" accessibilityState={{ selected: !type }} onPress={() => setType('')} style={[styles.chip, !type && styles.chipActive]}><Text style={[styles.chipText, !type && styles.chipTextActive]}>All</Text></Pressable>
          {types.data?.map((item) => <Pressable key={item.name} accessibilityRole="button" accessibilityLabel={`Filter by ${item.name} type`}
            accessibilityState={{ selected: type === item.name }} onPress={() => setType(item.name)} style={[styles.chip, type === item.name && styles.chipActive]}>
            <Text style={[styles.chipText, type === item.name && styles.chipTextActive]}>{formatPokemonName(item.name)}</Text>
          </Pressable>)}
        </ScrollView>}
    </View>
    {busy && items.length === 0 ? <LoadingState label={waitingForDebounce ? 'Searching Pokémon…' : 'Loading Pokémon…'} />
      : error && items.length === 0 ? <ErrorState onRetry={refresh} />
      : <FlatList data={waitingForDebounce ? [] : items} keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <PokemonCard pokemon={item} onOpen={() => navigation.navigate('PokemonDetail', { pokemonId: item.id })} onCollectionPress={() => setPicked(item)} />}
        initialNumToRender={6} maxToRenderPerBatch={6} windowSize={5} onEndReached={loadMore} onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={refresh} tintColor={colors.red} />}
        ListEmptyComponent={<EmptyState title="No Pokémon found" message={type ? 'Try a different name or clear the type filter.' : 'Try another name, or clear your search.'} />}
        ListFooterComponent={(mode === 'search' ? searchQuery.isFetchingNextPage : mode === 'list' ? list.isFetchingNextPage : false)
          ? <LoadingState label="Loading more Pokémon…" /> : error ? <ErrorState onRetry={refresh} /> : null}
        contentContainerStyle={styles.list} />}
    <CollectionPickerModal pokemonId={picked?.id ?? null} pokemonName={picked?.name ?? ''} onClose={() => setPicked(null)} />
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, controls: { backgroundColor: colors.white, paddingTop: 16, paddingBottom: 10, borderBottomColor: colors.border, borderBottomWidth: 1 },
  heading: { color: colors.ink, fontSize: 21, fontWeight: '900', marginHorizontal: 16, marginBottom: 12 },
  searchRow: { flexDirection: 'row', marginHorizontal: 16, alignItems: 'center' }, input: { flex: 1, backgroundColor: colors.background, minHeight: 48, borderRadius: 13, paddingHorizontal: 14, color: colors.ink, borderColor: colors.border, borderWidth: 1 },
  clear: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, clearText: { color: colors.muted, fontSize: 19 },
  filterHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginTop: 15, marginBottom: 8 }, filterTitle: { color: colors.ink, fontWeight: '800' },
  filterClear: { minHeight: 32, justifyContent: 'center' }, filterClearText: { color: colors.blue, fontWeight: '700' },
  typeError: { paddingHorizontal: 16, minHeight: 44, justifyContent: 'center' }, chips: { paddingHorizontal: 16, gap: 7 },
  chip: { minHeight: 38, borderRadius: 20, backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1, paddingHorizontal: 14, justifyContent: 'center' },
  chipActive: { backgroundColor: colors.blue, borderColor: colors.blue }, chipText: { color: colors.ink, fontWeight: '700' }, chipTextActive: { color: colors.white },
  list: { paddingVertical: 10, flexGrow: 1 },
});
