import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { MovieCard } from '../../components/MovieCard';
import { signOut } from '../../lib/auth';
import { useMovieDetailsQuery } from '../../services/tmdbApi';
import { signedOut } from '../../store';

export default function Favorites() {
  const dispatch = useDispatch();
  // `user` is briefly null after signing out, before this screen unmounts.
  const user = useSelector((state) => state.auth.user);
  const favoriteIds = useSelector((state) => state.favorites.ids);

  const handleSignOut = async () => {
    await signOut().catch(() => {});
    dispatch(signedOut());
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Your favorites</Text>
        <Text style={styles.caption}>Your saved watchlist, always close by.</Text>

        <View style={styles.account}>
          <Text style={styles.accountText}>Signed in as {user?.username}</Text>
          <Pressable onPress={handleSignOut}>
            <Text style={styles.signOut}>Sign out</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          {favoriteIds.length > 0 ? (
            favoriteIds.map((id) => <FavoriteMovie key={id} movieId={id} />)
          ) : (
            <EmptyState />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// We only store movie IDs; the movie itself comes from TMDB. If the detail
// screen already loaded it, RTK Query returns the cached copy instantly.
function FavoriteMovie({ movieId }) {
  const { data: movie } = useMovieDetailsQuery(movieId);
  return movie ? <MovieCard movie={movie} /> : null;
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.heart}>♡</Text>
      <Text style={styles.emptyTitle}>Nothing saved yet</Text>
      <Text style={styles.emptyText}>Tap the heart on a movie to add it here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0d0e15',
  },
  scroll: {
    padding: 20,
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
  account: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  accountText: {
    color: '#a7aabd',
    fontSize: 13,
  },
  signOut: {
    color: '#e8b84a',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    marginTop: 27,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 110,
  },
  heart: {
    color: '#e8b84a',
    fontSize: 52,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 14,
  },
  emptyText: {
    color: '#a7aabd',
    marginTop: 8,
    textAlign: 'center',
  },
});
