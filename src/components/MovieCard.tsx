import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { posterUrl } from '../services/tmdb';
import type { Movie } from '../types/movie';

type Props = {
  movie: Movie;
  isFavorite: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
};

export function MovieCard({ movie, isFavorite, onOpen, onToggleFavorite }: Props) {
  const poster = posterUrl(movie.poster_path);
  return (
    <View style={styles.card}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Details for ${movie.title}`} onPress={onOpen} style={styles.main}>
        {poster ? <Image source={{ uri: poster }} style={styles.poster} /> : <View style={[styles.poster, styles.noPoster]}><Text style={styles.noPosterText}>No poster</Text></View>}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
          <Text style={styles.year}>{movie.release_date?.slice(0, 4) || 'Year unknown'}</Text>
          <Text style={styles.hint}>View details →</Text>
        </View>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`${isFavorite ? 'Remove' : 'Save'} ${movie.title} ${isFavorite ? 'from' : 'to'} My List`} onPress={onToggleFavorite} style={[styles.saveButton, isFavorite && styles.savedButton]}>
        <Text style={[styles.saveText, isFavorite && styles.savedText]}>{isFavorite ? '♥ Saved' : '♡ Save'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, gap: 10, borderWidth: 1, borderColor: '#E5E9F1' },
  main: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  poster: { width: 78, height: 116, borderRadius: 8, backgroundColor: '#E5E9F1' },
  noPoster: { alignItems: 'center', justifyContent: 'center' },
  noPosterText: { color: '#526078', fontSize: 12, textAlign: 'center' },
  info: { flex: 1, gap: 8 },
  title: { color: '#18233D', fontSize: 17, fontWeight: '700' },
  year: { color: '#526078', fontSize: 14 },
  hint: { color: '#3155A6', fontSize: 14, fontWeight: '600' },
  saveButton: { alignSelf: 'flex-end', borderColor: '#3155A6', borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  savedButton: { backgroundColor: '#E7EEFD' },
  saveText: { color: '#3155A6', fontWeight: '700' },
  savedText: { color: '#20437E' },
});
