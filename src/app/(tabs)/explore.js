import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';

import { MovieCard } from '../../components/MovieCard';
import { StatusMessage } from '../../components/StatusMessage';
import {
  useGenresQuery,
  useTopRatedMoviesQuery,
  useTrendingMoviesQuery,
} from '../../services/tmdbApi';
import { setGenre, setQuery } from '../../store';

export default function Explore() {
  const dispatch = useDispatch();
  const trending = useTrendingMoviesQuery();
  const topRated = useTopRatedMoviesQuery();
  const { data: genres = [] } = useGenresQuery();

  // Shared client state: set the Search tab's filters from here, then switch to it.
  const browseGenre = (genreId) => {
    dispatch(setQuery(''));
    dispatch(setGenre(genreId));
    router.navigate('/');
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.caption}>What’s trending and what’s timeless.</Text>

        <Text style={styles.section}>Trending this week</Text>
        <StatusMessage isLoading={trending.isLoading} error={trending.error} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {trending.data?.movies.slice(0, 10).map((movie) => (
            <MovieCard key={movie.id} movie={movie} compact />
          ))}
        </ScrollView>

        <Text style={styles.section}>Browse by genre</Text>
        <View style={styles.genres}>
          {genres.map((genre) => (
            <Pressable key={genre.id} onPress={() => browseGenre(genre.id)} style={styles.genre}>
              <Text style={styles.genreText}>{genre.name}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.section}>Top rated of all time</Text>
        <StatusMessage isLoading={topRated.isLoading} error={topRated.error} />
        {topRated.data?.movies.slice(0, 10).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0d0e15',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    color: 'white',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 6,
  },
  caption: {
    color: '#a7aabd',
    marginTop: 6,
  },
  section: {
    color: 'white',
    fontWeight: '800',
    fontSize: 18,
    marginTop: 28,
    marginBottom: 14,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genre: {
    backgroundColor: '#1b1d29',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  genreText: {
    color: '#e8b84a',
    fontSize: 13,
    fontWeight: '700',
  },
});
