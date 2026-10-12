import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { useGenresQuery } from '../services/tmdbApi';

// A tappable movie summary. `compact` renders a tall poster card for horizontal rows.
export function MovieCard({ movie, compact = false }) {
  // The genre list is cached by RTK Query, so every card shares one request.
  const { data: genres = [] } = useGenresQuery();
  const genreName = genres.find((genre) => genre.id === movie.genreIds[0])?.name;

  const openDetails = () => router.push(`/movie/${movie.id}`);

  return (
    <Pressable onPress={openDetails} style={[styles.card, compact && styles.compact]}>
      <Image source={{ uri: movie.poster }} style={[styles.poster, compact && styles.smallPoster]} />
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.title}>
          {movie.title}
        </Text>
        <Text style={styles.meta}>
          {genreName ? `${movie.year} · ${genreName}` : movie.year}
        </Text>
        <Text style={styles.rating}>★ {movie.rating.toFixed(1)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 13,
    padding: 12,
    backgroundColor: '#171923',
    borderRadius: 16,
    marginBottom: 12,
  },
  compact: {
    width: 205,
    flexDirection: 'column',
    padding: 0,
    overflow: 'hidden',
    marginRight: 12,
  },
  poster: {
    height: 126,
    width: 86,
    borderRadius: 10,
    backgroundColor: '#303244',
  },
  smallPoster: {
    height: 240,
    width: 205,
    borderRadius: 0,
  },
  copy: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 3,
    paddingHorizontal: 2,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: '#a7aabd',
    fontSize: 13,
  },
  rating: {
    color: '#f6c453',
    fontWeight: '700',
    fontSize: 13,
  },
});
