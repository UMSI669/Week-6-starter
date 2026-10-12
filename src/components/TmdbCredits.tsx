import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

export function TmdbCredits() {
  return (
    <View style={styles.credits}>
      <Text style={styles.heading}>Credits</Text>
      <Pressable accessibilityRole="link" accessibilityLabel="Visit TMDB" onPress={() => Linking.openURL('https://www.themoviedb.org')}>
        <Image source={require('../../assets/tmdb-logo.png')} resizeMode="contain" style={styles.logo} />
      </Pressable>
      <Text style={styles.notice}>This product uses the TMDB API but is not endorsed or certified by TMDB.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  credits: { paddingVertical: 20, alignItems: 'center', gap: 8 },
  heading: { color: '#526078', fontSize: 13, fontWeight: '700' },
  logo: { width: 160, height: 34 },
  notice: { color: '#526078', fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
