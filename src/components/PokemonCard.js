import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatPokemonId, getPokemonArtwork, getPokemonSprite } from '../api/pokemonApi';
import { colors, typeColors } from '../theme/colors';
import PokeballIcon from './PokeballIcon';
import TypePill from './TypePill';

export default function PokemonCard({ pokemon, onPress, onToggleTeam, onTeam, teamFull }) {
  const [artworkFailed, setArtworkFailed] = useState(false);
  const [spriteFailed, setSpriteFailed] = useState(false);
  const artwork = getPokemonArtwork(pokemon);
  const sprite = getPokemonSprite(pokemon);
  const imageUri = !artworkFailed && artwork ? artwork : (!spriteFailed ? sprite : null);
  const typeNames = (pokemon.types || []).map(({ type }) => type.name);
  const [panelBackground, idColor] = typeColors[typeNames[0]] || [colors.warm, '#B84F26'];

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`View ${pokemon.name}, Pokédex number ${pokemon.id}`}
        style={styles.detailsPressable}
      >
        <View style={[styles.artworkArea, { backgroundColor: panelBackground }]}>
          <View style={styles.artworkHalo} />
          <Text style={[styles.pokemonId, { color: idColor }]}>{formatPokemonId(pokemon.id)}</Text>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.artwork}
              resizeMode="contain"
              onError={() => (artwork && !artworkFailed ? setArtworkFailed(true) : setSpriteFailed(true))}
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
        style={[styles.teamButton, !onTeam && teamFull && styles.teamDisabled]}
      >
        <PokeballIcon active={onTeam} size={22} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, marginBottom: 12, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, overflow: 'hidden', position: 'relative' },
  detailsPressable: { flex: 1 },
  artworkArea: { height: 136, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  artworkHalo: { width: 94, height: 94, borderRadius: 48, backgroundColor: 'rgba(255,255,255,0.48)', position: 'absolute' },
  pokemonId: { position: 'absolute', top: 11, left: 11, color: '#B84F26', fontSize: 11, fontWeight: '700' },
  artwork: { width: '76%', height: '86%' },
  imageFallback: { alignItems: 'center', justifyContent: 'center' },
  fallbackBall: { color: colors.red, fontSize: 32, fontWeight: '700' },
  fallbackText: { color: colors.muted, fontSize: 10, marginTop: 2 },
  cardBody: { paddingHorizontal: 12, paddingTop: 9, paddingBottom: 8 },
  name: { color: colors.ink, fontSize: 16, fontWeight: '700', textTransform: 'capitalize', marginBottom: 7 },
  types: { flexDirection: 'row', minHeight: 25 },
  teamButton: { position: 'absolute', top: 8, right: 8, width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  teamDisabled: { opacity: 0.62 },
});
