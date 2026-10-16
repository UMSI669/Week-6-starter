import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { MAX_TEAM_SIZE, useTeamStore } from '../store/teamStore';
import { colors } from '../theme/colors';

export default function MyTeamScreen({ navigation }) {
  const teamIds = useTeamStore((state) => state.teamIds);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>My Team</Text>
        <Text style={styles.count}>{teamIds.length} / {MAX_TEAM_SIZE} Pokémon</Text>
        <View style={styles.note}>
          <Text style={styles.noteTitle}>Temporary integration screen</Text>
          <Text style={styles.body}>This route reads the shared team count. The Pokémon list, remove controls, and team statistics are reserved for the My Team teammate.</Text>
        </View>
        {teamIds.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.body}>Your team is empty.</Text>
            <Pressable onPress={() => navigation.navigate('Home')}><Text style={styles.link}>Browse Pokémon →</Text></Pressable>
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.body}>{teamIds.length} Pokémon selected. The team view is ready for its full implementation.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 22 },
  title: { color: colors.ink, fontSize: 28, fontWeight: '800', marginTop: 12 },
  count: { color: colors.red, fontSize: 12, fontWeight: '700', alignSelf: 'flex-end', marginTop: -25 },
  note: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16, marginTop: 24, marginBottom: 16 },
  noteTitle: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  body: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 6 },
  empty: { alignItems: 'center', padding: 28, backgroundColor: colors.surface, borderRadius: 16 },
  link: { color: colors.red, fontSize: 13, fontWeight: '700', marginTop: 14 },
});
