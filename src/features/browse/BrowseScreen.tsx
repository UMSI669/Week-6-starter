import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MovieCard } from '../../components/MovieCard';
import { MovieDetailsModal } from '../../components/MovieDetailsModal';
import { StateMessage } from '../../components/StateMessage';
import { TmdbCredits } from '../../components/TmdbCredits';
import { getMovies } from '../../services/tmdb';
import { useFavoritesStore } from '../favorites/favoritesStore';
import { MOVIE_CATEGORIES, categoryLabel } from './categories';
import { useCategoryStore } from './categoryStore';

export default function BrowseScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const setCategory = useCategoryStore((state) => state.setCategory);

  // Waiting briefly after typing avoids sending an API request for every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const movies = useQuery({
    // Search results ignore the category, so the key only includes the category when browsing a list.
    queryKey: search ? ['movies', 'search', search] : ['movies', 'category', selectedCategory],
    queryFn: ({ signal }) => getMovies(search, selectedCategory, signal),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={movies.isRefetching} onRefresh={() => movies.refetch()} />}>
        <Text style={styles.eyebrow}>DISCOVER</Text>
        <Text accessibilityRole="header" style={styles.title}>Find your next movie</Text>
        <TextInput accessibilityLabel="Search movies" placeholder="Search movies by title" placeholderTextColor="#738097" value={searchInput} onChangeText={setSearchInput} autoCorrect={false} returnKeyType="search" style={styles.search} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityRole="tablist" contentContainerStyle={styles.categories}>
          {MOVIE_CATEGORIES.map((category) => {
            const isSelected = !search && category.id === selectedCategory;
            return (
              <Pressable key={category.id} accessibilityRole="tab" accessibilityState={{ selected: isSelected }} onPress={() => { setCategory(category.id); setSearchInput(''); setSearch(''); }} style={[styles.chip, isSelected && styles.chipSelected]}>
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{category.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Text style={styles.resultHeading}>{search ? `Results for “${search}”` : `${categoryLabel(selectedCategory)} movies`}</Text>
        {movies.isPending && <StateMessage message="Loading movies…" />}
        {movies.isError && <StateMessage message={movies.error.message} retry={() => movies.refetch()} />}
        {movies.data?.results.length === 0 && <StateMessage message={search ? 'No movies matched your search. Try another title.' : 'No movies are available in this category right now.'} />}
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
  categories: { gap: 8, paddingVertical: 2 },
  chip: { borderWidth: 1, borderColor: '#CFD6E3', backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  chipSelected: { backgroundColor: '#3155A6', borderColor: '#3155A6' },
  chipText: { color: '#35435B', fontSize: 14, fontWeight: '600' },
  chipTextSelected: { color: '#FFFFFF' },
  resultHeading: { color: '#18233D', fontSize: 18, fontWeight: '700', marginTop: 8 },
});
