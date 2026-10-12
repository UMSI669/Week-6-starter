import { useQuery } from '@tanstack/react-query';
import { Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFavoritesStore } from '../features/favorites/favoritesStore';
import { getMovieDetails, posterUrl } from '../services/tmdb';
import { StateMessage } from './StateMessage';

type Props = { movieId: number | null; onClose: () => void };

export function MovieDetailsModal({ movieId, onClose }: Props) {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const details = useQuery({
    queryKey: ['movie', movieId],
    queryFn: ({ signal }) => getMovieDetails(movieId!, signal),
    enabled: movieId !== null,
    staleTime: 5 * 60 * 1000,
  });

  const movie = details.data;
  const isFavorite = movie ? favoriteIds.includes(movie.id) : false;
  const poster = movie ? posterUrl(movie.poster_path) : undefined;
  const trailer = movie?.videos.results.find((video) => video.site === 'YouTube' && video.type === 'Trailer');

  return (
    <Modal visible={movieId !== null} animationType="slide" onRequestClose={onClose}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.screen}>
          <View style={styles.topBar}>
            <Text style={styles.heading}>Movie details</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Close movie details" onPress={onClose} hitSlop={8} style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}><Text style={styles.close}>Close ✕</Text></Pressable>
          </View>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {details.isPending && <StateMessage message="Loading movie details…" />}
            {details.isError && <StateMessage message={details.error.message} retry={() => details.refetch()} />}
            {movie && <>
              <View style={styles.hero}>
                {poster ? <Image source={{ uri: poster }} style={styles.poster} /> : <View style={[styles.poster, styles.noPoster]}><Text>No poster</Text></View>}
                <View style={styles.heroText}>
                  <Text accessibilityRole="header" style={styles.title}>{movie.title}</Text>
                  <Text style={styles.meta}>{movie.release_date?.slice(0, 4) || 'Year unknown'}{movie.runtime ? ` · ${movie.runtime} min` : ''}</Text>
                  <Pressable accessibilityRole="button" onPress={() => isFavorite ? removeFavorite(movie.id) : addFavorite(movie.id)} style={styles.saveButton}>
                    <Text style={styles.saveText}>{isFavorite ? '♥ Remove from My List' : '♡ Save to My List'}</Text>
                  </Pressable>
                </View>
              </View>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.body}>{movie.overview || 'No overview is available.'}</Text>
              <Text style={styles.sectionTitle}>Cast</Text>
              <Text style={styles.body}>{movie.credits.cast.length ? movie.credits.cast.slice(0, 5).map((person) => `${person.name} as ${person.character}`).join('\n') : 'No cast information is available.'}</Text>
              <Text style={styles.sectionTitle}>Videos</Text>
              {trailer ? <Pressable accessibilityRole="link" onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`)}><Text style={styles.link}>Watch trailer: {trailer.name} ↗</Text></Pressable> : <Text style={styles.body}>No trailer is available.</Text>}
            </>}
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F6FA' },
  topBar: { flexShrink: 0, zIndex: 1, backgroundColor: '#FFFFFF', padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E9F1' },
  heading: { color: '#18233D', fontSize: 18, fontWeight: '700' },
  scroll: { flex: 1 },
  closeButton: { minWidth: 88, minHeight: 48, paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  closeButtonPressed: { backgroundColor: '#E8EEF9' },
  close: { color: '#3155A6', fontSize: 16, fontWeight: '700' },
  content: { padding: 20, width: '100%', maxWidth: 720, alignSelf: 'center', gap: 12 },
  hero: { flexDirection: 'row', gap: 18, alignItems: 'flex-start' },
  poster: { width: 116, height: 174, borderRadius: 10, backgroundColor: '#E5E9F1' },
  noPoster: { justifyContent: 'center', alignItems: 'center' },
  heroText: { flex: 1, gap: 10 },
  title: { color: '#18233D', fontSize: 24, fontWeight: '700' },
  meta: { color: '#526078', fontSize: 15 },
  saveButton: { backgroundColor: '#3155A6', borderRadius: 8, padding: 10, alignSelf: 'flex-start' },
  saveText: { color: '#FFFFFF', fontWeight: '700' },
  sectionTitle: { color: '#18233D', fontSize: 19, fontWeight: '700', marginTop: 12 },
  body: { color: '#35435B', fontSize: 16, lineHeight: 25 },
  link: { color: '#3155A6', fontSize: 16, lineHeight: 24, fontWeight: '600' },
});
