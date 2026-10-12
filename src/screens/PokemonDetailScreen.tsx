import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CollectionPickerModal } from '../components/CollectionPickerModal';
import { ErrorState, LoadingState } from '../components/Feedback';
import { PokeballIcon } from '../components/PokeballIcon';
import { TypeBadge } from '../components/TypeBadge';
import { usePokemonDetails } from '../hooks/pokemonQueries';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { usePokemonStore } from '../store/usePokemonStore';
import { colors } from '../theme/colors';
import { formatPokemonName, pokemonArtwork } from '../utils/pokemon';

type Props = NativeStackScreenProps<RootStackParamList, 'PokemonDetail'>;

export function PokemonDetailScreen({ route }: Props) {
  const { pokemonId } = route.params;
  const query = usePokemonDetails(pokemonId);
  const favorite = usePokemonStore((state) => state.favoritePokemonIds.includes(pokemonId));
  const toggleFavorite = usePokemonStore((state) => state.toggleFavorite);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  if (query.isPending) return <LoadingState label="Loading Pokémon details…" />;
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />;
  const pokemon = query.data;
  const name = formatPokemonName(pokemon.name);
  const artwork = pokemonArtwork(pokemon);
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.hero}>
      <Text style={styles.number}>#{String(pokemon.id).padStart(4, '0')}</Text>
      {artwork && !imageFailed ? <Image source={{ uri: artwork }} onError={() => setImageFailed(true)} style={styles.artwork} accessibilityLabel={`${name} artwork`} />
        : <View style={styles.fallback}><PokeballIcon color={colors.blue} size={76} /><Text style={styles.fallbackText}>Artwork unavailable</Text></View>}
      <Text style={styles.name}>{name}</Text>
      <View style={styles.types}>{pokemon.types?.map(({ type }) => <TypeBadge key={type.name} type={type.name} />)}</View>
    </View>
    <View style={styles.actions}>
      <Pressable accessibilityRole="button" accessibilityLabel={`${favorite ? 'Remove' : 'Add'} ${name} ${favorite ? 'from' : 'to'} favorites`}
        accessibilityState={{ selected: favorite }} onPress={() => toggleFavorite(pokemonId)} style={[styles.action, favorite && styles.selectedAction]}>
        <Text style={[styles.actionText, favorite && styles.selectedText]}>{favorite ? '♥ Favorited' : '♡ Favorite'}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`Add ${name} to collection`} onPress={() => setPickerOpen(true)} style={[styles.action, styles.collectionAction]}>
        <PokeballIcon color={colors.red} size={28} /><Text style={styles.actionText}>Collections</Text>
      </Pressable>
    </View>
    <View style={styles.panel}><Text style={styles.panelTitle}>Abilities</Text>
      {pokemon.abilities?.length ? pokemon.abilities.map(({ ability, is_hidden }) => <Text key={ability.name} style={styles.item}>• {formatPokemonName(ability.name)}{is_hidden ? ' (hidden)' : ''}</Text>)
        : <Text style={styles.muted}>No ability data available.</Text>}
    </View>
    <View style={styles.panel}><Text style={styles.panelTitle}>Base stats</Text>
      {pokemon.stats?.length ? pokemon.stats.map(({ stat, base_stat }) => <View key={stat.name} style={styles.stat}>
        <Text style={styles.statName}>{formatPokemonName(stat.name)}</Text><Text style={styles.statValue}>{base_stat}</Text>
      </View>) : <Text style={styles.muted}>No stats available.</Text>}
    </View>
    <CollectionPickerModal pokemonId={pickerOpen ? pokemonId : null} pokemonName={pokemon.name} onClose={() => setPickerOpen(false)} />
  </ScrollView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { paddingBottom: 30 }, hero: { alignItems: 'center', backgroundColor: colors.white, paddingVertical: 20 },
  number: { color: colors.blue, fontWeight: '900' }, artwork: { width: 220, height: 220, resizeMode: 'contain' },
  fallback: { height: 220, alignItems: 'center', justifyContent: 'center' }, fallbackText: { color: colors.muted, marginTop: 12 },
  name: { color: colors.ink, fontSize: 30, fontWeight: '900' }, types: { flexDirection: 'row', marginTop: 8 },
  actions: { flexDirection: 'row', gap: 10, margin: 16 }, action: { flex: 1, minHeight: 52, borderRadius: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  selectedAction: { borderColor: colors.red }, collectionAction: { borderColor: colors.blue }, actionText: { color: colors.ink, fontWeight: '900' }, selectedText: { color: colors.redDark },
  panel: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 16, marginHorizontal: 16, marginBottom: 12, padding: 18 },
  panelTitle: { color: colors.ink, fontSize: 18, fontWeight: '900', marginBottom: 10 }, item: { color: colors.ink, lineHeight: 27 }, muted: { color: colors.muted },
  stat: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 8 }, statName: { color: colors.ink }, statValue: { color: colors.blue, fontWeight: '900' },
});
