import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

import { MovieCard } from '../../../components/MovieCard';
import { StatusMessage } from '../../../components/StatusMessage';
import { saveFavorite } from '../../../lib/favorites';
import { useMovieDetailsQuery } from '../../../services/tmdbApi';
import { toggleFavorite } from '../../../store';

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const movieId = Number(id);

  // Server state: details, cast, reviews and recommendations from TMDB.
  const { data: movie, isLoading, error } = useMovieDetailsQuery(movieId);

  // Client state: whether this movie is in the user's favorites.
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  const isSaved = useSelector((state) => state.favorites.ids.includes(movieId));

  // Update the UI immediately, then persist. Undo the change if saving fails.
  const handleToggleFavorite = async () => {
    const nextSaved = !isSaved;
    dispatch(toggleFavorite(movieId));
    try {
      await saveFavorite(userId, movieId, nextSaved);
    } catch {
      dispatch(toggleFavorite(movieId));
    }
  };

  const backButton = (
    <Pressable style={styles.back} onPress={() => router.back()}>
      <Text style={styles.backText}>‹</Text>
    </Pressable>
  );

  if (!movie) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.statusHeader}>{backButton}</View>
        <StatusMessage isLoading={isLoading} error={error} />
      </SafeAreaView>
    );
  }

  const meta = [movie.year, movie.runtime, movie.genres.join(', ')].filter(Boolean).join('  ·  ');

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView>
        <View style={styles.hero}>
          <Image source={{ uri: movie.backdrop || movie.poster }} style={styles.backdrop} />
          <View style={styles.overlay} />
          {backButton}
          <Pressable style={styles.heart} onPress={handleToggleFavorite}>
            <Text style={styles.heartText}>{isSaved ? '♥' : '♡'}</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.meta}>{meta}</Text>
          <Text style={styles.score}>
            ★ {movie.rating.toFixed(1)} <Text style={styles.scoreLabel}>/ 10 on TMDB</Text>
          </Text>

          <Text style={styles.heading}>Overview</Text>
          <Text style={styles.body}>{movie.overview || 'No overview available.'}</Text>

          {movie.cast.length > 0 && (
            <>
              <Text style={styles.heading}>Top cast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {movie.cast.map((person) => (
                  <CastMember key={person.id} person={person} />
                ))}
              </ScrollView>
            </>
          )}

          <Text style={styles.heading}>Reviews</Text>
          {movie.reviews.length > 0 ? (
            movie.reviews.map((review) => (
              <View key={review.id} style={styles.review}>
                <Text numberOfLines={5} style={styles.reviewText}>
                  {review.content}
                </Text>
                <Text style={styles.author}>— {review.author}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.body}>No reviews yet.</Text>
          )}

          {movie.recommendations.length > 0 && (
            <>
              <Text style={styles.heading}>You may also like</Text>
              {movie.recommendations.slice(0, 3).map((item) => (
                <MovieCard key={item.id} movie={item} />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CastMember({ person }) {
  return (
    <View style={styles.person}>
      {person.photo ? (
        <Image source={{ uri: person.photo }} style={styles.avatar} />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{person.name[0]}</Text>
        </View>
      )}
      <Text numberOfLines={2} style={styles.name}>
        {person.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0d0e15',
  },
  statusHeader: {
    height: 76,
  },
  hero: {
    height: 280,
  },
  backdrop: {
    width: '100%',
    height: '100%',
    opacity: 0.58,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13,14,21,.28)',
  },
  back: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.45)',
    borderRadius: 20,
  },
  backText: {
    color: 'white',
    fontSize: 37,
    lineHeight: 37,
  },
  heart: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.45)',
    borderRadius: 20,
  },
  heartText: {
    color: '#e8b84a',
    fontSize: 25,
  },
  content: {
    padding: 20,
    marginTop: -17,
    backgroundColor: '#0d0e15',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
  },
  meta: {
    color: '#a7aabd',
    marginTop: 7,
  },
  score: {
    color: '#f6c453',
    marginTop: 15,
    fontWeight: '800',
  },
  scoreLabel: {
    color: '#a7aabd',
    fontWeight: '400',
  },
  heading: {
    color: 'white',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 28,
    marginBottom: 10,
  },
  body: {
    color: '#c2c4cf',
    lineHeight: 22,
  },
  person: {
    width: 76,
    alignItems: 'center',
    marginRight: 8,
  },
  avatar: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: '#393c4d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#e8b84a',
    fontSize: 20,
    fontWeight: '800',
  },
  name: {
    color: '#c2c4cf',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 6,
  },
  review: {
    backgroundColor: '#191b27',
    borderRadius: 13,
    padding: 14,
    marginBottom: 10,
  },
  reviewText: {
    color: 'white',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  author: {
    color: '#e8b84a',
    marginTop: 8,
    fontSize: 12,
  },
});
