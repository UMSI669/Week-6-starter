import { useQueries } from '@tanstack/react-query';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MovieCard } from '../../components/MovieCard';
import { MovieDetailsModal } from '../../components/MovieDetailsModal';
import { StateMessage } from '../../components/StateMessage';
import { TmdbCredits } from '../../components/TmdbCredits';
import { getMovieDetails } from '../../services/tmdb';
import { useFavoritesStore } from '../favorites/favoritesStore';
import { MAX_RECENTLY_VIEWED, useRecentlyViewedStore } from './recentlyViewedStore';

export default function RecentlyViewedScreen() {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const recentIds = useRecentlyViewedStore((state) => state.recentIds);
  const clearRecentlyViewed = useRecentlyViewedStore((state) => state.clearRecentlyViewed);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  // Recently viewed IDs are client state; the same ['movie', id] cache used by details supplies the records.
  const movieQueries = useQueries({ queries: recentIds.map((id) => ({
    queryKey: ['movie', id],
    queryFn: ({ signal }: { signal: AbortSignal }) => getMovieDetails(id, signal),
    staleTime: 5 * 60 * 1000,
  })) });
  const failedQuery = movieQueries.find((query) => query.isError);
  const isLoading = movieQueries.some((query) => query.isPending);

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>HISTORY</Text>
        <View style={styles.headerRow}>
          <Text accessibilityRole="header" style={styles.title}>Recently Viewed</Text>
          {recentIds.length > 0 && (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear recently viewed movies" onPress={clearRecentlyViewed} style={styles.clearButton}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.subtitle}>The last {MAX_RECENTLY_VIEWED} movies you opened, newest first.</Text>
        {recentIds.length === 0 && <StateMessage message="Nothing here yet. Open a movie from Browse or My List and it will appear here." />}
        {recentIds.length > 0 && isLoading && <StateMessage message="Loading recently viewed movies…" />}
        {failedQuery && <StateMessage message={failedQuery.error?.message || 'Could not load a recently viewed movie.'} retry={() => movieQueries.forEach((query) => { if (query.isError) query.refetch(); })} />}
        {movieQueries.map((query) => {
          const movie = query.data;
          if (!movie) return null;
          const isFavorite = favoriteIds.includes(movie.id);
          return <MovieCard key={movie.id} movie={movie} isFavorite={isFavorite} onOpen={() => setSelectedMovieId(movie.id)} onToggleFavorite={() => isFavorite ? removeFavorite(movie.id) : addFavorite(movie.id)} />;
        })}
        <TmdbCredits />
      </ScrollView>
      <MovieDetailsModal movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 20, width: '100%', maxWidth: 720, alignSelf: 'center', gap: 14 },
  eyebrow: { color: '#3155A6', fontSize: 12, fontWeight: '700', letterSpacing: 2, marginTop: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { color: '#18233D', fontSize: 30, fontWeight: '700', flexShrink: 1 },
  clearButton: { borderColor: '#3155A6', borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  clearText: { color: '#3155A6', fontWeight: '700' },
  subtitle: { color: '#526078', fontSize: 16, marginBottom: 8 },
});
