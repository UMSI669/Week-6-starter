import { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { MovieCard } from '../../components/MovieCard';
import { StatusMessage } from '../../components/StatusMessage';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import {
  SORT_OPTIONS,
  useDiscoverMoviesQuery,
  useGenresQuery,
  useSearchMoviesQuery,
} from '../../services/tmdbApi';
import { setGenre, setQuery, toggleSort } from '../../store';

const MIN_SEARCH_LENGTH = 2;

export default function SearchScreen() {
  const dispatch = useDispatch();

  // Client state: the filters live in the Redux `browse` slice.
  const { query, genreId, sort } = useSelector((state) => state.browse);

  // Server state: TMDB data via RTK Query.
  const debouncedQuery = useDebouncedValue(query.trim());
  const isSearching = debouncedQuery.length >= MIN_SEARCH_LENGTH;

  const { data: genres = [] } = useGenresQuery();
  const searchResult = useSearchMoviesQuery(debouncedQuery, { skip: !isSearching });
  const discoverResult = useDiscoverMoviesQuery({ genreId, sort }, { skip: isSearching });

  // `currentData` is only the result for the current arguments, so old results
  // disappear while new ones load instead of showing stale movies.
  const activeResult = isSearching ? searchResult : discoverResult;
  const fetchedMovies = activeResult.currentData?.movies;

  const movies = useMemo(() => {
    if (!fetchedMovies) {
      return [];
    }
    if (!isSearching) {
      return fetchedMovies; // discover already filtered and sorted on the server
    }

    // TMDB's search endpoint can't filter by genre or sort, so do it here.
    const filtered = fetchedMovies.filter(
      (movie) => genreId === null || movie.genreIds.includes(genreId)
    );
    return [...filtered].sort((a, b) => {
      if (sort === 'rating') {
        return b.rating - a.rating;
      }
      return b.releaseDate.localeCompare(a.releaseDate);
    });
  }, [fetchedMovies, isSearching, genreId, sort]);

  const genreChips = [{ id: null, name: 'All' }, ...genres];

  const header = (
    <>
      <Text style={styles.wordmark}>
        MOVIE<Text style={styles.gold}>wiki</Text>
      </Text>
      <Text style={styles.subtitle}>Find something worth watching.</Text>

      <TextInput
        value={query}
        onChangeText={(text) => dispatch(setQuery(text))}
        placeholder="Search movies by title"
        placeholderTextColor="#8d91a3"
        style={styles.input}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {genreChips.map((genre) => {
          const isActive = genreId === genre.id;
          return (
            <Pressable
              key={genre.id ?? 'all'}
              onPress={() => dispatch(setGenre(genre.id))}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {genre.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.results}>
        <Text style={styles.heading}>{isSearching ? 'Search results' : 'Browse'}</Text>
        <Pressable onPress={() => dispatch(toggleSort())}>
          <Text style={styles.sort}>Sort: {SORT_OPTIONS[sort].label} ↓</Text>
        </Pressable>
      </View>
    </>
  );

  const isWaiting = activeResult.isFetching && !activeResult.currentData;
  const emptyState =
    isWaiting || activeResult.error ? (
      <StatusMessage isLoading={isWaiting} error={activeResult.error} />
    ) : (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No titles found</Text>
        <Text style={styles.emptyText}>Try another title or genre.</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MovieCard movie={item} />}
        ListHeaderComponent={header}
        ListEmptyComponent={emptyState}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0d0e15',
  },
  list: {
    padding: 20,
    paddingBottom: 32,
  },
  wordmark: {
    color: 'white',
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -1,
  },
  gold: {
    color: '#e8b84a',
  },
  subtitle: {
    color: '#a7aabd',
    marginTop: 5,
    marginBottom: 19,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1b1d29',
    color: 'white',
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  chips: {
    marginTop: 16,
    marginBottom: 20,
  },
  chip: {
    borderColor: '#373a4b',
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#e8b84a',
    borderColor: '#e8b84a',
  },
  chipText: {
    color: '#bec1ce',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#17130a',
  },
  results: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },
  heading: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  sort: {
    color: '#e8b84a',
    fontSize: 13,
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 55,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    color: '#a7aabd',
    marginTop: 7,
  },
});
