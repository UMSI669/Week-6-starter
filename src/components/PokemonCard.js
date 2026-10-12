import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatPokemonId, getPokemonArtwork, getPokemonSprite } from '../api/pokemonApi';
import { colors } from '../theme/colors';
import TypePill from './TypePill';

export default function PokemonCard({ pokemon, onPress, onToggleTeam, onTeam, teamFull }) {
  const [artworkFailed, setArtworkFailed] = useState(false);
  const [spriteFailed, setSpriteFailed] = useState(false);
  const artwork = getPokemonArtwork(pokemon);
  const sprite = getPokemonSprite(pokemon);
  const imageUri = !artworkFailed && artwork ? artwork : (!spriteFailed ? sprite : null);
  const typeNames = (pokemon.types || []).map(({ type }) => type.name);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`View ${pokemon.name}, Pokédex number ${pokemon.id}`}
        style={styles.detailsPressable}
      >
        <View style={styles.artworkArea}>
          <Text style={styles.pokemonId}>{formatPokemonId(pokemon.id)}</Text>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.artwork}
              resizeMode="contain"
              onError={() => (artworkFailed ? setSpriteFailed(true) : setArtworkFailed(true))}
              accessibilityLabel={`${pokemon.name} artwork`}
            />
          ) : (
            <View style={styles.imageFallback} accessibilityLabel="Artwork unavailable">
              <Text style={styles.fallbackBall}>◉</Text>
              <Text style={styles.fallbackText}>Artwork unavailable</Text>
            </View>
          )}
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.name} numberOfLines={1}>{pokemon.name}</Text>
          <View style={styles.types}>
            {typeNames.slice(0, 2).map((type) => <TypePill key={type} type={type} />)}
          </View>
        </View>
      </Pressable>
      <Pressable
        onPress={onToggleTeam}
        disabled={!onTeam && teamFull}
        accessibilityRole="button"
        accessibilityState={{ selected: onTeam, disabled: !onTeam && teamFull }}
        accessibilityLabel={onTeam ? `Remove ${pokemon.name} from My Team` : teamFull ? 'My Team is full' : `Add ${pokemon.name} to My Team`}
        style={[styles.teamToggle, onTeam && styles.teamSelected, !onTeam && teamFull && styles.teamDisabled]}
      >
        <Text style={[styles.teamToggleText, onTeam && styles.teamToggleSelectedText]}>
          {onTeam ? '✓ On team' : teamFull ? 'Team full' : '+ Add to team'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, marginBottom: 12, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  detailsPressable: { flex: 1 },
  artworkArea: { height: 136, backgroundColor: colors.warm, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  pokemonId: { position: 'absolute', top: 11, left: 11, color: '#B84F26', fontSize: 11, fontWeight: '700' },
  artwork: { width: '76%', height: '86%' },
  imageFallback: { alignItems: 'center', justifyContent: 'center' },
  fallbackBall: { color: colors.red, fontSize: 32, fontWeight: '700' },
  fallbackText: { color: colors.muted, fontSize: 10, marginTop: 2 },
  cardBody: { paddingHorizontal: 12, paddingTop: 9, paddingBottom: 8 },
  name: { color: colors.ink, fontSize: 16, fontWeight: '700', textTransform: 'capitalize', marginBottom: 7 },
  types: { flexDirection: 'row', minHeight: 25 },
  teamToggle: { marginHorizontal: 10, marginBottom: 10, minHeight: 34, borderRadius: 10, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  teamSelected: { backgroundColor: colors.redWash, borderColor: colors.redWash },
  teamDisabled: { backgroundColor: '#F1F2F4' },
  teamToggleText: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  teamToggleSelectedText: { color: colors.red },
});
