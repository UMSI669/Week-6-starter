import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useQueries } from '@tanstack/react-query';
import PokeballIcon from '../components/PokeballIcon';
import TypePill from '../components/TypePill';
import { fetchPokemon, formatPokemonId, getPokemonArtwork, getPokemonSprite } from '../api/pokemonApi';
import { MAX_TEAM_SIZE, useTeamStore } from '../store/teamStore';
import { colors, typeColors } from '../theme/colors';

function TeamMember({ pokemon, onOpen, onRemove }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUri = getPokemonArtwork(pokemon) || getPokemonSprite(pokemon);
  const typeNames = pokemon.types.map(({ type }) => type.name);
  const [artworkBackground] = typeColors[typeNames[0]] || [colors.warm];

  return (
    <View style={styles.memberCard}>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${pokemon.name}`}
        style={styles.memberMain}
      >
        <View style={[styles.artworkBox, { backgroundColor: artworkBackground }]}>
          {imageUri && !imageFailed ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.artwork}
              resizeMode="contain"
              onError={() => setImageFailed(true)}
              accessibilityLabel={`${pokemon.name} artwork`}
            />
          ) : (
            <PokeballIcon active size={31} />
          )}
        </View>
        <View style={styles.memberInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.memberName} numberOfLines={1}>{pokemon.name}</Text>
            <Text style={styles.memberId}>{formatPokemonId(pokemon.id)}</Text>
          </View>
          <View style={styles.typeRow}>
            {typeNames.slice(0, 2).map((type) => <TypePill key={type} type={type} />)}
          </View>
          <Text style={styles.detailsHint}>View details →</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${pokemon.name} from My Team`}
        style={styles.removeButton}
      >
        <Text style={styles.removeText}>Remove</Text>
      </Pressable>
    </View>
  );
}

function FailedMember({ pokemonId, onRetry, onRemove }) {
  return (
    <View style={styles.failedCard}>
      <View style={styles.failedCopy}>
        <Text style={styles.failedTitle}>Couldn’t load Pokémon {formatPokemonId(pokemonId)}</Text>
        <Text style={styles.failedBody}>Check your connection and try again.</Text>
      </View>
      <Pressable onPress={onRetry} accessibilityRole="button" style={styles.retryButton}>
        <Text style={styles.retryText}>Retry</Text>
      </Pressable>
      <Pressable onPress={onRemove} accessibilityRole="button" accessibilityLabel={`Remove Pokémon ${pokemonId} from My Team`} style={styles.failedRemove}>
        <Text style={styles.removeText}>Remove</Text>
      </Pressable>
    </View>
  );
}

export default function MyTeamScreen({ navigation }) {
  const teamIds = useTeamStore((state) => state.teamIds);
  const removePokemon = useTeamStore((state) => state.removePokemon);
  const teamQueries = useQueries({
    queries: teamIds.map((id) => ({
      queryKey: ['pokemon', id],
      queryFn: () => fetchPokemon(id),
    })),
  });

  const loadedPokemon = teamQueries.flatMap((query) => (query.data ? [query.data] : []));
  const uniqueTypes = [...new Set(loadedPokemon.flatMap((pokemon) => pokemon.types.map(({ type }) => type.name)))];
  const averageBaseStatTotal = loadedPokemon.length
    ? Math.round(loadedPokemon.reduce((total, pokemon) => total + pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0), 0) / loadedPokemon.length)
    : 0;
  const teamItems = teamIds.map((id, index) => ({ id, query: teamQueries[index] }));

  function renderTeamMember({ item }) {
    if (item.query.data) {
      return (
        <TeamMember
          pokemon={item.query.data}
          onOpen={() => navigation.navigate('PokemonDetails', { pokemonId: item.id })}
          onRemove={() => removePokemon(item.id)}
        />
      );
    }

    if (item.query.isError) {
      return <FailedMember pokemonId={item.id} onRetry={() => item.query.refetch()} onRemove={() => removePokemon(item.id)} />;
    }

    return (
      <View style={styles.loadingCard} accessibilityLabel={`Loading Pokémon ${item.id}`}>
        <ActivityIndicator color={colors.red} />
        <Text style={styles.loadingText}>Loading team member…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={teamItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderTeamMember}
        contentContainerStyle={styles.content}
        ListHeaderComponent={(
          <View>
            <View style={styles.brandRow}>
              <PokeballIcon active size={19} />
              <Text style={styles.brandText}>POKÉ GUIDE</Text>
              <Text style={styles.regionText}>KANTO</Text>
            </View>
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.eyebrow}>YOUR LINEUP</Text>
                <Text style={styles.title}>My Team</Text>
              </View>
              <Text style={styles.count}>{teamIds.length} / {MAX_TEAM_SIZE}</Text>
            </View>
            <View style={styles.slotRow} accessibilityLabel={`${teamIds.length} of ${MAX_TEAM_SIZE} team slots filled`}>
              {Array.from({ length: MAX_TEAM_SIZE }, (_, index) => (
                <View key={index} style={[styles.slot, index < teamIds.length && styles.slotFilled]}>
                  <PokeballIcon active={index < teamIds.length} size={18} />
                </View>
              ))}
            </View>
            {teamIds.length > 0 && (
              <>
                <View style={styles.statsCard}>
                  <View style={styles.statBlock}>
                    <Text style={styles.statValue}>{uniqueTypes.length}</Text>
                    <Text style={styles.statLabel}>Types covered</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBlock}>
                    <Text style={styles.statValue}>{averageBaseStatTotal || '—'}</Text>
                    <Text style={styles.statLabel}>Avg. stat total</Text>
                  </View>
                </View>
                {uniqueTypes.length > 0 && (
                  <View style={styles.coverageSection}>
                    <Text style={styles.sectionLabel}>TYPE COVERAGE</Text>
                    <View style={styles.coverageTypes}>
                      {uniqueTypes.map((type) => <TypePill key={type} type={type} />)}
                    </View>
                  </View>
                )}
                <View style={styles.membersHeading}>
                  <Text style={styles.sectionTitle}>Team members</Text>
                  <Text style={styles.memberCount}>{teamIds.length} Pokémon</Text>
                </View>
              </>
            )}
          </View>
        )}
        ListEmptyComponent={(
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><PokeballIcon active size={48} /></View>
            <Text style={styles.emptyTitle}>Build your first team</Text>
            <Text style={styles.emptyBody}>Choose up to six Pokémon from the gallery. Your selections will appear here.</Text>
            <Pressable onPress={() => navigation.navigate('Home')} accessibilityRole="button" style={styles.browseButton}>
              <Text style={styles.browseButtonText}>Browse Pokémon</Text>
            </Pressable>
          </View>
        )}
        ListFooterComponent={teamIds.length > 0 && teamIds.length < MAX_TEAM_SIZE ? (
          <Pressable onPress={() => navigation.navigate('Home')} accessibilityRole="button" style={styles.addButton}>
            <Text style={styles.addButtonText}>＋ Add another Pokémon</Text>
          </Pressable>
        ) : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  brandRow: { height: 30, flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 7 },
  brandText: { color: colors.ink, fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
  regionText: { marginLeft: 'auto', color: colors.muted, fontSize: 10, fontWeight: '700', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  eyebrow: { color: colors.red, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { color: colors.ink, fontSize: 30, fontWeight: '800', letterSpacing: -0.8, marginTop: 3 },
  count: { color: colors.red, fontSize: 14, fontWeight: '800', marginBottom: 5 },
  slotRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginBottom: 14 },
  slot: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', opacity: 0.55 },
  slotFilled: { borderStyle: 'solid', borderColor: '#F1C7CA', backgroundColor: colors.redWash, opacity: 1 },
  statsCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  statBlock: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.ink, fontSize: 19, fontWeight: '800' },
  statLabel: { color: colors.muted, fontSize: 10, fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: colors.line },
  coverageSection: { marginTop: 16 },
  sectionLabel: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 0.7 },
  coverageTypes: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  membersHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 19, marginBottom: 10 },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '700' },
  memberCount: { color: colors.muted, fontSize: 11, fontWeight: '600' },
  memberCard: { marginBottom: 11, borderRadius: 17, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, overflow: 'hidden' },
  memberMain: { flexDirection: 'row', alignItems: 'center', minHeight: 112, padding: 11, paddingBottom: 9 },
  artworkBox: { width: 88, height: 88, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  artwork: { width: 79, height: 79 },
  memberInfo: { flex: 1, alignSelf: 'stretch', paddingLeft: 13, paddingTop: 5 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  memberName: { flex: 1, color: colors.ink, fontSize: 18, fontWeight: '700', textTransform: 'capitalize' },
  memberId: { color: colors.muted, fontSize: 10, fontWeight: '700', marginLeft: 8 },
  typeRow: { flexDirection: 'row', marginTop: 8 },
  detailsHint: { color: colors.muted, fontSize: 10, fontWeight: '600', marginTop: 9 },
  removeButton: { minHeight: 38, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderTopColor: colors.line },
  removeText: { color: '#B43138', fontSize: 11, fontWeight: '700' },
  loadingCard: { minHeight: 88, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 11, borderRadius: 17, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  loadingText: { color: colors.muted, fontSize: 12 },
  failedCard: { minHeight: 94, flexDirection: 'row', alignItems: 'center', padding: 13, marginBottom: 11, borderRadius: 17, borderWidth: 1, borderColor: '#F1C7CA', backgroundColor: '#FFF7F7' },
  failedCopy: { flex: 1 },
  failedTitle: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  failedBody: { color: colors.muted, fontSize: 10, marginTop: 3 },
  retryButton: { paddingHorizontal: 10, paddingVertical: 8 },
  retryText: { color: colors.red, fontSize: 11, fontWeight: '700' },
  failedRemove: { paddingHorizontal: 7, paddingVertical: 8 },
  emptyState: { alignItems: 'center', paddingHorizontal: 26, marginTop: 44 },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.redWash, marginBottom: 21 },
  emptyTitle: { color: colors.ink, fontSize: 23, fontWeight: '800' },
  emptyBody: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 8 },
  browseButton: { minWidth: 180, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.red, marginTop: 22 },
  browseButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  addButton: { height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: '#D8B7B9', backgroundColor: colors.redWash, marginTop: 3 },
  addButtonText: { color: colors.red, fontSize: 12, fontWeight: '700' },
});
