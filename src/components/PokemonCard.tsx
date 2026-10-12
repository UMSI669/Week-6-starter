import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PokemonRef } from '../api/types';
import { usePokemonDetails } from '../hooks/pokemonQueries';
import { usePokemonStore } from '../store/usePokemonStore';
import { colors } from '../theme/colors';
import { formatPokemonName, pokemonArtwork } from '../utils/pokemon';
import { PokeballIcon } from './PokeballIcon';
import { TypeBadge } from './TypeBadge';

type Props = {
  pokemon: PokemonRef;
  onOpen?: () => void;
  onCollectionPress: (displayName: string) => void;
  collectionName?: string;
  inCollection?: boolean;
};

export function PokemonCard({ pokemon, onOpen, onCollectionPress, collectionName, inCollection = false }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const detail = usePokemonDetails(pokemon.id);
  const favorite = usePokemonStore((state) => state.favoritePokemonIds.includes(pokemon.id));
  const toggleFavorite = usePokemonStore((state) => state.toggleFavorite);
  const name = detail.data?.name ?? pokemon.name;
  const displayName = formatPokemonName(name);
  const artwork = pokemonArtwork(detail.data);
  return <View style={styles.card}>
    {/* QJ Comment: this is where the pokemon can be clicked on to view more information */}
    <Pressable accessibilityRole="button" accessibilityLabel={`View ${displayName} details`} disabled={!onOpen} onPress={onOpen} style={styles.main}>
      <View style={styles.artwork}>
        {artwork && !imageFailed ? <Image source={{ uri: artwork }} onError={() => setImageFailed(true)} style={styles.image} accessibilityLabel={`${displayName} artwork`} />
          : <PokeballIcon color={colors.blue} size={42} />}
      </View>
      <View style={styles.details}>
        <Text style={styles.number}>#{String(pokemon.id).padStart(4, '0')}</Text>
        <Text style={styles.name} numberOfLines={2}>{displayName}</Text>
        {detail.isPending ? <Text style={styles.subtle}>Loading types…</Text> : detail.isError
          ? <Text style={styles.subtle}>Details unavailable</Text>
          : <View style={styles.types}>{detail.data.types?.map(({ type }) => <TypeBadge key={type.name} type={type.name} />)}</View>}
      </View>
    </Pressable>
    <View style={styles.actions}>
      {/* QJ Comment: here is where the ability to favorite comes in, if it is already favorited it is removed */}
      <Pressable accessibilityRole="button" accessibilityLabel={`${favorite ? 'Remove' : 'Add'} ${displayName} ${favorite ? 'from' : 'to'} favorites`}
        accessibilityState={{ selected: favorite }} onPress={() => toggleFavorite(pokemon.id)} style={styles.action}>
        <Text style={[styles.heart, favorite && styles.heartActive]}>{favorite ? '♥' : '♡'}</Text>
      </Pressable>
      {/* QJ Comment: This is where users get to add pokemon to a collection*/}
      <Pressable accessibilityRole="button" accessibilityLabel={collectionName
        ? `${inCollection ? 'Remove' : 'Add'} ${displayName} ${inCollection ? 'from' : 'to'} ${collectionName}`
        : `Add ${displayName} to collection`}
        accessibilityState={{ selected: inCollection }} onPress={() => onCollectionPress(displayName)} style={styles.action}>
        <PokeballIcon color={inCollection ? colors.success : colors.red} size={28} />
      </Pressable>
      {detail.isError && <Pressable accessibilityRole="button" accessibilityLabel={`Retry loading ${displayName} details`}
        onPress={() => void detail.refetch()} style={styles.action}><Text style={styles.retry}>↻</Text></Pressable>}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.border, marginHorizontal: 16, marginVertical: 6, minHeight: 112, padding: 10 },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', minHeight: 88 },
  artwork: { width: 82, height: 82, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2F5F8', borderRadius: 14 },
  image: { width: 78, height: 78, resizeMode: 'contain' },
  details: { flex: 1, paddingHorizontal: 11 },
  number: { color: colors.blue, fontSize: 12, fontWeight: '800' },
  name: { color: colors.ink, fontWeight: '800', fontSize: 17, lineHeight: 21 },
  subtle: { color: colors.muted, fontSize: 11, marginTop: 5 },
  types: { flexDirection: 'row', flexWrap: 'wrap' },
  actions: { alignItems: 'center', justifyContent: 'center' },
  action: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  heart: { color: colors.muted, fontSize: 32, lineHeight: 36 },
  heartActive: { color: colors.red },
  retry: { color: colors.blue, fontSize: 28, fontWeight: '800' },
});
