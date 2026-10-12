import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Keyboard, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import PokemonCard from '../components/PokemonCard';
import TypePill from '../components/TypePill';
import { fetchPokemon, formatPokemonId, getPokemonArtwork, getPokemonSprite } from '../api/pokemonApi';
import { MAX_TEAM_SIZE, useTeamStore } from '../store/teamStore';
import { colors } from '../theme/colors';

const DEFAULT_POKEMON_IDS = [1, 4, 7, 25, 133];

function SearchResult({ pokemon, onAdd, onCancel, alreadyAdded, teamIds }) {
  const [fallbackIndex, setFallbackIndex] = React.useState(0);
  const images = [getPokemonArtwork(pokemon), getPokemonSprite(pokemon)].filter(Boolean);
  const imageUri = images[fallbackIndex];
  const types = pokemon.types.map(({ type }) => type.name);
  const onTeam = teamIds.includes(pokemon.id);
  return (
    <View style={styles.resultCard}>
      <View style={styles.resultHead}>
        <Text style={styles.resultHeading}>Lookup result</Text>
        <Text style={styles.resultTag}>{alreadyAdded ? 'In gallery' : 'Not in gallery'}</Text>
      </View>
      <View style={styles.resultContent}>
        <View style={styles.resultMon}>
          {imageUri
            ? <Image source={{ uri: imageUri }} style={styles.resultArtwork} resizeMode="contain" onError={() => setFallbackIndex((index) => index + 1)} accessibilityLabel={`${pokemon.name} artwork`} />
            : <Text style={styles.resultEmoji}>◉</Text>}
        </View>
        <View style={styles.resultInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.resultName}>{pokemon.name}</Text>
            <Text style={styles.resultId}>{formatPokemonId(pokemon.id)}</Text>
          </View>
          <View style={styles.typeRow}>{types.slice(0, 2).map((type) => <TypePill key={type} type={type} />)}</View>
          <Text style={styles.resultHint}>
            {alreadyAdded ? (onTeam ? 'Already in your gallery and on My Team.' : 'Already in your gallery. You can add it to My Team below.') : 'Found via PokéAPI. Add it to your gallery before saving to My Team.'}
          </Text>
        </View>
      </View>
      <View style={styles.resultActions}>
        {!alreadyAdded && <Pressable onPress={onAdd} accessibilityRole="button" style={styles.primaryAction}><Text style={styles.primaryActionText}>Add to Pokédex</Text></Pressable>}
        <Pressable onPress={onCancel} accessibilityRole="button" style={[styles.secondaryAction, alreadyAdded && styles.fullAction]}><Text style={styles.secondaryActionText}>{alreadyAdded ? 'Done' : 'Cancel'}</Text></Pressable>
      </View>
    </View>
  );
}

export default function DiscoverScreen({ navigation }) {
  const [collectionIds, setCollectionIds] = useState(DEFAULT_POKEMON_IDS);
  const [searchText, setSearchText] = useState('');
  const [lookupPokemon, setLookupPokemon] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchCanRetry, setSearchCanRetry] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);
  const queryClient = useQueryClient();
  const teamIds = useTeamStore((state) => state.teamIds);
  const addPokemon = useTeamStore((state) => state.addPokemon);
  const removePokemon = useTeamStore((state) => state.removePokemon);
  // TODO(student): Rewrite this explanation in your own words: TanStack Query owns fetched records and reuses cached data across screens.
  const cardQueries = useQueries({
    queries: collectionIds.map((id) => ({ queryKey: ['pokemon', id], queryFn: () => fetchPokemon(id) })),
  });
  const successfulPokemon = cardQueries.filter((query) => query.data).map((query) => query.data);
  const types = useMemo(() => ['All', ...new Set(successfulPokemon.flatMap((pokemon) => pokemon.types.map(({ type }) => type.name)))], [successfulPokemon]);
  const visiblePokemon = successfulPokemon
    .filter((pokemon) => typeFilter === 'All' || pokemon.types.some(({ type }) => type.name === typeFilter))
    .sort((a, b) => sortAscending ? a.id - b.id : b.id - a.id);
  const teamFull = teamIds.length >= MAX_TEAM_SIZE;

  async function submitLookup() {
    const normalizedName = searchText.trim().toLowerCase();
    if (!normalizedName) {
      setSearchError('Enter a Pokémon name or Pokédex number to search.');
      setLookupPokemon(null);
      return;
    }

    Keyboard.dismiss();
    setIsSearching(true);
    setSearchError('');
    setSearchCanRetry(false);
    setSearchMessage('');
    setLookupPokemon(null);
    try {
      const pokemon = await queryClient.fetchQuery({
        queryKey: ['pokemon', normalizedName],
        queryFn: () => fetchPokemon(normalizedName),
      });
      if (collectionIds.includes(pokemon.id)) {
        setSearchMessage(`${pokemon.name} is already in your gallery.`);
      }
      setLookupPokemon(pokemon);
    } catch (error) {
      setSearchCanRetry(error.status !== 404);
      setSearchError(error.status === 404
        ? 'No Pokémon found. Check the name or number and try again.'
        : error.message || 'Could not reach PokéAPI. Check your connection and retry.');
    } finally {
      setIsSearching(false);
    }
  }

  function addLookupToCollection() {
    if (!lookupPokemon) return;
    if (collectionIds.includes(lookupPokemon.id)) {
      setSearchMessage(`${lookupPokemon.name} is already in your gallery.`);
      return;
    }
    setCollectionIds((ids) => [...ids, lookupPokemon.id]);
    setSearchText('');
    setSearchMessage(`${lookupPokemon.name} was added to your gallery.`);
    setLookupPokemon(null);
  }

  function toggleTeam(pokemon) {
    if (teamIds.includes(pokemon.id)) {
      removePokemon(pokemon.id);
      setSearchMessage(`${pokemon.name} was removed from My Team.`);
      return;
    }
    const added = addPokemon(pokemon.id);
    setSearchMessage(added ? `${pokemon.name} was added to My Team.` : (teamFull ? 'My Team is full. Remove a Pokémon before adding another.' : `${pokemon.name} is already on My Team.`));
  }

  function retryFailedQueries() {
    cardQueries.forEach((query) => { if (query.isError) query.refetch(); });
  }

  const failedCount = cardQueries.filter((query) => query.isError).length;
  const loadingCount = cardQueries.filter((query) => query.isLoading).length;

  // TODO(student): Rewrite this explanation in your own words: only the stable ID goes in navigation so the details screen can fetch current data itself.
  function openPokemonDetails(id) {
    navigation.navigate('PokemonDetails', { pokemonId: id });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={visiblePokemon}
        numColumns={2}
        keyExtractor={(pokemon) => String(pokemon.id)}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={(
          <View>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}><Text style={styles.brandMarkText}>•</Text></View>
              <Text style={styles.brandText}>POKÉ GUIDE</Text>
              <View style={styles.regionTag}><Text style={styles.regionText}>KANTO</Text></View>
            </View>
            <Text style={styles.greeting}>Hello, Trainer!</Text>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Add Pokémon</Text>
              <Text style={styles.sourceLabel}>PokéAPI lookup</Text>
            </View>
            <View style={styles.searchRow}>
              <TextInput
                value={searchText}
                onChangeText={(value) => { setSearchText(value); setSearchError(''); setSearchCanRetry(false); setSearchMessage(''); }}
                onSubmitEditing={submitLookup}
                placeholder="Name or Pokédex number"
                placeholderTextColor={colors.muted}
                returnKeyType="search"
                autoCapitalize="none"
                accessibilityLabel="Search by Pokémon name or Pokédex number"
                style={styles.searchInput}
              />
              <Pressable onPress={submitLookup} disabled={isSearching} accessibilityRole="button" accessibilityLabel="Look up Pokémon" style={styles.lookupButton}>
                {isSearching ? <ActivityIndicator color="#fff" /> : <Text style={styles.lookupText}>Lookup</Text>}
              </Pressable>
            </View>
            {!!searchError && <View style={styles.inlineError}><Text accessibilityRole="alert" style={[styles.errorText, styles.searchError]}>{searchError}</Text>{searchCanRetry && <Pressable onPress={submitLookup} accessibilityRole="button"><Text style={styles.retryText}>Retry</Text></Pressable>}</View>}
            {!!searchMessage && !lookupPokemon && <Text accessibilityRole="alert" style={styles.messageText}>{searchMessage}</Text>}
            {isSearching && <View style={styles.lookupLoading}><ActivityIndicator color={colors.red} /><Text style={styles.loadingText}>Looking up Pokémon…</Text></View>}
            {lookupPokemon && <SearchResult pokemon={lookupPokemon} onAdd={addLookupToCollection} onCancel={() => { setLookupPokemon(null); setSearchMessage(''); }} alreadyAdded={collectionIds.includes(lookupPokemon.id)} teamIds={teamIds} />}

            <View style={[styles.sectionTitleRow, styles.galleryHeading]}>
              <Text style={styles.sectionTitle}>Gallery</Text>
              <Text style={styles.countText}>{collectionIds.length} Pokémon</Text>
            </View>
            <View style={styles.galleryControls}>
              <Pressable onPress={() => setTypeFilter((current) => {
                const currentIndex = types.indexOf(current);
                return types[(currentIndex + 1) % types.length];
              })} accessibilityRole="button" accessibilityLabel={`Filter type: ${typeFilter}. Tap to change`} style={styles.filterPill}>
                <Text style={styles.filterText}>{typeFilter} ⌄</Text>
              </Pressable>
              <Pressable onPress={() => setShowFilters((shown) => !shown)} accessibilityRole="button" accessibilityLabel={showFilters ? 'Hide gallery filters' : 'Show gallery filters'} style={styles.filterButton}>
                <Text style={styles.filterGlyph}>☷</Text><Text style={styles.filterButtonText}>Filters</Text>
              </Pressable>
            </View>
            {showFilters && <View style={styles.filterPanel}>
              <Text style={styles.filterPanelTitle}>Filter by type</Text>
              <View style={styles.filterOptions}>{types.map((type) => <Pressable key={type} onPress={() => { setTypeFilter(type); setShowFilters(false); }} style={[styles.filterOption, typeFilter === type && styles.filterOptionSelected]}><Text style={[styles.filterOptionText, typeFilter === type && styles.filterOptionSelectedText]}>{type}</Text></Pressable>)}</View>
              <Pressable onPress={() => setSortAscending((value) => !value)} style={styles.sortOption}><Text style={styles.filterButtonText}>Sort by Pokédex number {sortAscending ? '↑' : '↓'}</Text></Pressable>
            </View>}
            <View style={styles.summaryRow}>
              <Text style={styles.gallerySummary}>{collectionIds.length} Pokémon in gallery</Text>
              <Pressable onPress={() => setSortAscending((value) => !value)} accessibilityRole="button"><Text style={styles.sortText}>Number {sortAscending ? '↑' : '↓'}</Text></Pressable>
            </View>
            {loadingCount > 0 && <Text style={styles.loadingText}>{successfulPokemon.length ? `Loading ${loadingCount} more…` : 'Loading your gallery…'}</Text>}
            {failedCount > 0 && <View style={styles.inlineError}><Text style={styles.errorText}>{failedCount} Pokémon could not be loaded.</Text><Pressable onPress={retryFailedQueries}><Text style={styles.retryText}>Retry</Text></Pressable></View>}
            {visiblePokemon.length === 0 && !loadingCount && !failedCount && <View style={styles.emptyState}><Text style={styles.emptyTitle}>No Pokémon in this view</Text><Text style={styles.emptyBody}>Try another type filter or look up a Pokémon by name.</Text></View>}
          </View>
        )}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={() => openPokemonDetails(item.id)}
            onTeam={teamIds.includes(item.id)}
            teamFull={teamFull}
            onToggleTeam={() => toggleTeam(item)}
          />
        )}
        ListFooterComponent={(
          <View style={styles.footer}>
            <View style={styles.footerBall}><Text style={styles.footerBallText}>•</Text></View>
            <Text style={styles.footerText}>Red Poké Ball = on your team</Text>
            <Text style={styles.footerCount}>My Team: {teamIds.length} / {MAX_TEAM_SIZE}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 18 },
  brandRow: { height: 30, flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  brandMark: { width: 19, height: 19, borderRadius: 10, backgroundColor: colors.red, borderWidth: 1, borderColor: '#D63A42', alignItems: 'center', justifyContent: 'center', marginRight: 7 },
  brandMarkText: { color: '#fff', fontSize: 14, lineHeight: 15, fontWeight: '800' },
  brandText: { color: colors.ink, fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
  regionTag: { marginLeft: 'auto', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  regionText: { color: colors.muted, fontSize: 10, fontWeight: '700' },
  greeting: { color: colors.ink, fontSize: 30, fontWeight: '800', letterSpacing: -0.8, marginBottom: 13 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '700' },
  sourceLabel: { color: colors.muted, backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, overflow: 'hidden', borderRadius: 14, paddingHorizontal: 9, paddingVertical: 4, fontSize: 10, fontWeight: '600' },
  searchRow: { flexDirection: 'row', marginTop: 10, marginBottom: 6 },
  searchInput: { flex: 1, height: 47, backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, color: colors.ink, fontSize: 13 },
  lookupButton: { width: 74, height: 47, marginLeft: 8, borderRadius: 14, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  lookupText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  errorText: { color: '#B43138', fontSize: 12, lineHeight: 17, marginTop: 4 },
  searchError: { flex: 1, marginRight: 8 },
  messageText: { color: colors.ink, fontSize: 12, marginTop: 4 },
  lookupLoading: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 9 },
  loadingText: { color: colors.muted, fontSize: 12, marginTop: 8 },
  resultCard: { marginTop: 10, borderWidth: 1, borderColor: colors.line, borderRadius: 17, backgroundColor: colors.surface, overflow: 'hidden' },
  resultHead: { height: 36, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF8F4' },
  resultHeading: { color: '#B84F26', fontSize: 11, fontWeight: '700' },
  resultTag: { color: colors.muted, backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, fontSize: 10, fontWeight: '600' },
  resultContent: { minHeight: 112, flexDirection: 'row', alignItems: 'center', padding: 11 },
  resultMon: { width: 67, height: 67, borderRadius: 17, backgroundColor: colors.warm, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  resultEmoji: { color: colors.red, fontSize: 30 },
  resultArtwork: { width: 58, height: 58 },
  resultInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultName: { color: colors.ink, fontSize: 16, fontWeight: '700', textTransform: 'capitalize' },
  resultId: { color: '#B84F26', fontSize: 10, fontWeight: '700' },
  typeRow: { flexDirection: 'row', marginTop: 6 },
  resultHint: { color: colors.muted, fontSize: 11, lineHeight: 15, marginTop: 5 },
  resultActions: { flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 10, gap: 8 },
  primaryAction: { flex: 1, height: 40, borderRadius: 13, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  primaryActionText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  secondaryAction: { flex: 1, height: 40, borderRadius: 13, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  fullAction: { flex: 1 },
  secondaryActionText: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  galleryHeading: { marginTop: 17, marginBottom: 10 },
  countText: { color: colors.muted, fontSize: 11, fontWeight: '600' },
  galleryControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  filterPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  filterText: { color: colors.ink, fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  filterButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, paddingHorizontal: 4 },
  filterGlyph: { color: colors.ink, fontSize: 18, marginRight: 6 },
  filterButtonText: { color: colors.ink, fontSize: 12, fontWeight: '600' },
  filterPanel: { padding: 12, marginBottom: 10, borderRadius: 14, borderColor: colors.line, borderWidth: 1, backgroundColor: colors.surface },
  filterPanelTitle: { color: colors.ink, fontSize: 12, fontWeight: '700', marginBottom: 9 },
  filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  filterOption: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: colors.background },
  filterOptionSelected: { backgroundColor: colors.redWash },
  filterOptionText: { color: colors.ink, fontSize: 11, textTransform: 'capitalize' },
  filterOptionSelectedText: { color: colors.red, fontWeight: '700' },
  sortOption: { paddingTop: 11, marginTop: 8, borderTopWidth: 1, borderColor: colors.line },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  gallerySummary: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  sortText: { color: colors.muted, fontSize: 10 },
  gridRow: { gap: 12, alignItems: 'stretch' },
  inlineError: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  retryText: { color: colors.red, fontSize: 12, fontWeight: '700' },
  emptyState: { padding: 20, marginBottom: 12, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.line, alignItems: 'center' },
  emptyTitle: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  emptyBody: { color: colors.muted, textAlign: 'center', fontSize: 12, lineHeight: 17, marginTop: 5 },
  footer: { minHeight: 50, borderTopWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8, paddingTop: 8 },
  footerBall: { backgroundColor: colors.red, width: 16, height: 16, borderRadius: 9, borderWidth: 1, borderColor: '#D63A42', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  footerBallText: { color: '#fff', fontSize: 12, lineHeight: 13, fontWeight: '800' },
  footerText: { color: colors.muted, fontSize: 10 },
  footerCount: { color: colors.muted, fontSize: 10, marginLeft: 8 },
});
