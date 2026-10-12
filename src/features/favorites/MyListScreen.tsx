import { useQueries } from '@tanstack/react-query';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MovieCard } from '../../components/MovieCard';
import { MovieDetailsModal } from '../../components/MovieDetailsModal';
import { StateMessage } from '../../components/StateMessage';
import { TmdbCredits } from '../../components/TmdbCredits';
import { getMovieDetails } from '../../services/tmdb';
import { useFavoritesStore } from './favoritesStore';

export default function MyListScreen() {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  // Favorite IDs are client state; the movie records themselves come from Query.
  const movieQueries = useQueries({ queries: favoriteIds.map((id) => ({
    queryKey: ['movie', id],
    queryFn: ({ signal }: { signal: AbortSignal }) => getMovieDetails(id, signal),
    staleTime: 5 * 60 * 1000,
  })) });
  const failedQuery = movieQueries.find((query) => query.isError);
  const isLoading = movieQueries.some((query) => query.isPending);

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>YOUR COLLECTION</Text>
        <Text accessibilityRole="header" style={styles.title}>My List</Text>
        <Text style={styles.subtitle}>Movies you saved while using the app.</Text>
        {favoriteIds.length === 0 && <StateMessage message="Your list is empty. Save a movie from Browse to see it here." />}
        {favoriteIds.length > 0 && isLoading && <StateMessage message="Loading your saved movies…" />}
        {failedQuery && <StateMessage message={failedQuery.error?.message || 'Could not load a saved movie.'} retry={() => movieQueries.forEach((query) => { if (query.isError) query.refetch(); })} />}
        {movieQueries.map((query) => query.data && <MovieCard key={query.data.id} movie={query.data} isFavorite onOpen={() => setSelectedMovieId(query.data!.id)} onToggleFavorite={() => removeFavorite(query.data!.id)} />)}
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
  title: { color: '#18233D', fontSize: 30, fontWeight: '700' },
  subtitle: { color: '#526078', fontSize: 16, marginBottom: 8 },
});
