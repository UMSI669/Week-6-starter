import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MovieCard } from '../../components/MovieCard';
import { MovieDetailsModal } from '../../components/MovieDetailsModal';
import { StateMessage } from '../../components/StateMessage';
import { TmdbCredits } from '../../components/TmdbCredits';
import { getMovies } from '../../services/tmdb';
import { useFavoritesStore } from '../favorites/favoritesStore';

export default function BrowseScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  // Waiting briefly after typing avoids sending an API request for every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const movies = useQuery({
    queryKey: ['movies', search],
    queryFn: ({ signal }) => getMovies(search, signal),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={movies.isRefetching} onRefresh={() => movies.refetch()} />}>
        <Text style={styles.eyebrow}>DISCOVER</Text>
        <Text accessibilityRole="header" style={styles.title}>Find your next movie</Text>
        <TextInput accessibilityLabel="Search movies" placeholder="Search movies by title" placeholderTextColor="#738097" value={searchInput} onChangeText={setSearchInput} autoCorrect={false} returnKeyType="search" style={styles.search} />
        <Text style={styles.resultHeading}>{search ? `Results for “${search}”` : 'Popular movies'}</Text>
        {movies.isPending && <StateMessage message="Loading movies…" />}
        {movies.isError && <StateMessage message={movies.error.message} retry={() => movies.refetch()} />}
        {movies.data?.results.length === 0 && <StateMessage message={search ? 'No movies matched your search. Try another title.' : 'No movies are available right now.'} />}
        {movies.data?.results.map((movie) => {
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
  title: { color: '#18233D', fontSize: 30, fontWeight: '700' },
  search: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CFD6E3', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#18233D' },
  resultHeading: { color: '#18233D', fontSize: 18, fontWeight: '700', marginTop: 8 },
});
