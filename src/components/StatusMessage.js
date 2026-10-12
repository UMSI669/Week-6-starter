import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { hasTmdbToken } from '../services/tmdbApi';

// Loading spinner or error message for an RTK Query request.
// Renders nothing once the request has succeeded.
export function StatusMessage({ isLoading, error }) {
  if (isLoading) {
    return (
      <View style={styles.box}>
        <ActivityIndicator color="#e8b84a" />
      </View>
    );
  }

  if (!error) {
    return null;
  }

  const title = hasTmdbToken ? 'Could not load movies' : 'TMDB token missing';
  const message = hasTmdbToken
    ? 'Check your connection and try again.'
    : 'Add EXPO_PUBLIC_TMDB_TOKEN to .env and restart Expo.';

  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
  },
  message: {
    color: '#a7aabd',
    marginTop: 7,
    textAlign: 'center',
  },
});
