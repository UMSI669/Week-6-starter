import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import PokeballIcon from '../components/PokeballIcon';
import TypePill from '../components/TypePill';
import { fetchPokemon, formatPokemonId, getPokemonArtwork, getPokemonSprite } from '../api/pokemonApi';
import { MAX_TEAM_SIZE, useTeamStore } from '../store/teamStore';
import { colors, typeColors } from '../theme/colors';

const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
}

function MessageScreen({ title, body, actionLabel, onAction, loading }) {
  return (
    <SafeAreaView style={styles.messageScreen}>
      <View style={styles.messageCard}>
        {loading ? <ActivityIndicator color={colors.red} size="large" /> : <PokeballIcon active size={44} />}
        <Text style={styles.messageTitle}>{title}</Text>
        <Text style={styles.messageBody}>{body}</Text>
        {onAction && (
          <Pressable onPress={onAction} accessibilityRole="button" style={styles.retryButton}>
            <Text style={styles.retryButtonText}>{actionLabel}</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

export default function PokemonDetailsScreen({ route, navigation }) {
  const pokemonId = Number(route.params?.pokemonId);
  const hasValidId = Number.isInteger(pokemonId) && pokemonId > 0;
  const teamIds = useTeamStore((state) => state.teamIds);
  const addPokemon = useTeamStore((state) => state.addPokemon);
  const removePokemon = useTeamStore((state) => state.removePokemon);
  const [imageIndex, setImageIndex] = useState(0);
  const [teamMessage, setTeamMessage] = useState('');

  const pokemonQuery = useQuery({
    queryKey: ['pokemon', pokemonId],
    queryFn: () => fetchPokemon(pokemonId),
    enabled: hasValidId,
  });
  const pokemon = pokemonQuery.data;
  const onTeam = hasValidId && teamIds.includes(pokemonId);
  const teamFull = teamIds.length >= MAX_TEAM_SIZE;

  useLayoutEffect(() => {
    navigation.setOptions({ title: pokemon ? capitalize(pokemon.name) : 'Pokémon details' });
  }, [navigation, pokemon]);

  useEffect(() => {
    setImageIndex(0);
    setTeamMessage('');
  }, [pokemonId]);

  useEffect(() => {
    if (!teamMessage) return undefined;
    const timer = setTimeout(() => setTeamMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [teamMessage]);

  if (!hasValidId) {
    return <MessageScreen title="Pokémon not specified" body="Return to the gallery and select a Pokémon to view its details." />;
  }

  if (pokemonQuery.isPending) {
    return <MessageScreen loading title="Loading Pokémon…" body="Retrieving the latest record from PokéAPI." />;
  }

  if (pokemonQuery.isError) {
    return (
      <MessageScreen
        title="Couldn’t load this Pokémon"
        body={pokemonQuery.error?.message || 'Check your connection and try again.'}
        actionLabel="Try again"
        onAction={() => pokemonQuery.refetch()}
      />
    );
  }

  const typeNames = pokemon.types.map(({ type }) => type.name);
  const [heroBackground, accentColor] = typeColors[typeNames[0]] || [colors.warm, colors.red];
  const images = [...new Set([getPokemonArtwork(pokemon), getPokemonSprite(pokemon)].filter(Boolean))];
  const imageUri = images[imageIndex];
  const totalStats = pokemon.stats.reduce((total, { base_stat: value }) => total + value, 0);
  const height = (pokemon.height / 10).toFixed(1);
  const weight = (pokemon.weight / 10).toFixed(1);

  function toggleTeam() {
    if (onTeam) {
      removePokemon(pokemonId);
      setTeamMessage(`${capitalize(pokemon.name)} was removed from My Team.`);
      return;
    }

    const added = addPokemon(pokemonId);
    setTeamMessage(added
      ? `${capitalize(pokemon.name)} was added to My Team.`
      : 'My Team is full. Remove a Pokémon before adding another.');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={pokemonQuery.isRefetching} onRefresh={pokemonQuery.refetch} tintColor={colors.red} />}
      >
        <View style={[styles.hero, { backgroundColor: heroBackground }]}>
          <View style={styles.heroTopRow}>
            <Text style={[styles.pokemonId, { color: accentColor }]}>{formatPokemonId(pokemon.id)}</Text>
            <View style={styles.sourceBadge}><Text style={styles.sourceText}>POKÉAPI</Text></View>
          </View>
          <View style={styles.heroHalo} />
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.artwork}
              resizeMode="contain"
              onError={() => setImageIndex((current) => current + 1)}
              accessibilityLabel={`${pokemon.name} artwork`}
            />
          ) : (
            <View style={styles.artworkFallback}>
              <PokeballIcon active size={58} />
              <Text style={styles.fallbackText}>Artwork unavailable</Text>
            </View>
          )}
        </View>

        <View style={styles.identitySection}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <View style={styles.typeRow}>
            {typeNames.map((type) => <TypePill key={type} type={type} />)}
          </View>
        </View>

        <View style={styles.measurementsCard}>
          <View style={styles.measurement}>
            <Text style={styles.measurementValue}>{height} m</Text>
            <Text style={styles.measurementLabel}>HEIGHT</Text>
          </View>
          <View style={styles.measurementDivider} />
          <View style={styles.measurement}>
            <Text style={styles.measurementValue}>{weight} kg</Text>
            <Text style={styles.measurementLabel}>WEIGHT</Text>
          </View>
          <View style={styles.measurementDivider} />
          <View style={styles.measurement}>
            <Text style={styles.measurementValue}>{pokemon.base_experience ?? '—'}</Text>
            <Text style={styles.measurementLabel}>BASE XP</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abilities</Text>
          <View style={styles.abilityList}>
            {pokemon.abilities.map(({ ability, is_hidden: isHidden }) => (
              <View key={ability.name} style={styles.abilityPill}>
                <Text style={styles.abilityName}>{ability.name.replace(/-/g, ' ')}</Text>
                {isHidden && <Text style={styles.hiddenLabel}>HIDDEN</Text>}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.statsHeading}>
            <Text style={styles.sectionTitle}>Base stats</Text>
            <Text style={styles.statTotal}>Total {totalStats}</Text>
          </View>
          <View style={styles.statsCard}>
            {pokemon.stats.map(({ base_stat: value, stat }) => (
              <View key={stat.name} style={styles.statRow}>
                <Text style={styles.statName}>{STAT_LABELS[stat.name] || capitalize(stat.name)}</Text>
                <Text style={styles.statValue}>{value}</Text>
                <View style={styles.statTrack}>
                  <View
                    accessibilityRole="progressbar"
                    accessibilityValue={{ min: 0, max: 255, now: value }}
                    style={[styles.statFill, { width: `${Math.min((value / 255) * 100, 100)}%`, backgroundColor: accentColor }]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {!!teamMessage && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.teamMessage}>{teamMessage}</Text>}
        <Pressable
          onPress={toggleTeam}
          disabled={!onTeam && teamFull}
          accessibilityRole="button"
          accessibilityState={{ selected: onTeam, disabled: !onTeam && teamFull }}
          style={[styles.teamButton, onTeam && styles.removeTeamButton, !onTeam && teamFull && styles.disabledButton]}
        >
          <PokeballIcon active={onTeam} size={22} />
          <Text style={[styles.teamButtonText, onTeam && styles.removeTeamText]}>
            {onTeam ? 'Remove from My Team' : teamFull ? 'My Team is full' : 'Add to My Team'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 28 },
  messageScreen: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 },
  messageCard: { alignItems: 'center', padding: 28, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  messageTitle: { color: colors.ink, fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: 16 },
  messageBody: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 7 },
  retryButton: { height: 44, minWidth: 130, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: colors.red, marginTop: 20 },
  retryButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  hero: { height: 285, borderRadius: 24, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  heroTopRow: { position: 'absolute', top: 16, left: 17, right: 17, zIndex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pokemonId: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  sourceBadge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.72)' },
  sourceText: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  heroHalo: { position: 'absolute', width: 210, height: 210, borderRadius: 105, backgroundColor: 'rgba(255,255,255,0.42)' },
  artwork: { width: '82%', height: '82%', zIndex: 1 },
  artworkFallback: { alignItems: 'center', zIndex: 1 },
  fallbackText: { color: colors.muted, fontSize: 11, fontWeight: '600', marginTop: 9 },
  identitySection: { alignItems: 'center', paddingTop: 18, paddingBottom: 17 },
  name: { color: colors.ink, fontSize: 30, fontWeight: '800', letterSpacing: -0.7, textTransform: 'capitalize' },
  typeRow: { flexDirection: 'row', marginTop: 9 },
  measurementsCard: { minHeight: 76, flexDirection: 'row', alignItems: 'center', borderRadius: 17, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  measurement: { flex: 1, alignItems: 'center' },
  measurementValue: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  measurementLabel: { color: colors.muted, fontSize: 8, fontWeight: '800', letterSpacing: 0.7, marginTop: 4 },
  measurementDivider: { width: 1, height: 34, backgroundColor: colors.line },
  section: { marginTop: 22 },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  abilityList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 11 },
  abilityPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  abilityName: { color: colors.ink, fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  hiddenLabel: { color: colors.red, fontSize: 7, fontWeight: '800', letterSpacing: 0.4, marginLeft: 7 },
  statsHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statTotal: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  statsCard: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 17, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, marginTop: 11 },
  statRow: { minHeight: 36, flexDirection: 'row', alignItems: 'center' },
  statName: { width: 55, color: colors.muted, fontSize: 10, fontWeight: '700' },
  statValue: { width: 32, color: colors.ink, fontSize: 11, fontWeight: '800', textAlign: 'right', marginRight: 10 },
  statTrack: { flex: 1, height: 7, borderRadius: 4, backgroundColor: colors.line, overflow: 'hidden' },
  statFill: { height: '100%', borderRadius: 4 },
  teamMessage: { color: colors.ink, fontSize: 11, lineHeight: 16, textAlign: 'center', marginTop: 20, paddingHorizontal: 12 },
  teamButton: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: 16, backgroundColor: colors.red, marginTop: 18 },
  teamButtonText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  removeTeamButton: { borderWidth: 1, borderColor: '#F1C7CA', backgroundColor: colors.redWash },
  removeTeamText: { color: colors.red },
  disabledButton: { opacity: 0.55 },
});
