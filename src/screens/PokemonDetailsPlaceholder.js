import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function PokemonDetailsPlaceholder({ route }) {
  const { pokemonId } = route.params || {};
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.label}>TEMPORARY INTEGRATION PLACEHOLDER</Text>
        <Text style={styles.title}>Pokémon details</Text>
        <Text style={styles.body}>Details screen teammate: retrieve this Pokémon from TanStack Query with ID {String(pokemonId ?? 'missing')}.</Text>
        <Text style={styles.code}>route.params.pokemonId: {String(pokemonId ?? 'undefined')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, marginTop: 12 },
  label: { color: colors.red, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  title: { color: colors.ink, fontSize: 27, fontWeight: '800', marginTop: 10 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 14 },
  code: { color: colors.ink, backgroundColor: colors.surface, borderRadius: 10, padding: 12, marginTop: 18, fontSize: 12 },
});
