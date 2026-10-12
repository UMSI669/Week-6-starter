import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiscoverScreen from '../screens/DiscoverScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import PokemonDetailsPlaceholder from '../screens/PokemonDetailsPlaceholder';
import PokeballIcon from '../components/PokeballIcon';
import { useTeamStore } from '../store/teamStore';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const teamCount = useTeamStore((state) => state.teamIds.length);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DiscoverScreen}
        options={{ tabBarIcon: ({ focused }) => (
          <View style={[styles.iconPill, focused && styles.iconPillActive]}>
            <View style={styles.homeGrid}>
              {Array.from({ length: 4 }, (_, index) => <View key={index} style={[styles.homeGridCell, { borderColor: focused ? colors.red : colors.muted }]} />)}
            </View>
          </View>
        ) }}
      />
      <Tab.Screen
        name="My team"
        component={MyTeamScreen}
        options={{ tabBarIcon: ({ focused }) => (
          <View style={[styles.iconPill, focused && styles.iconPillActive]}>
            <PokeballIcon active={focused} size={21} />
            {teamCount > 0 && <View style={styles.teamBadge}><Text style={styles.teamBadgeText}>{teamCount}</Text></View>}
          </View>
        ) }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconPill: { width: 52, height: 28, borderRadius: 15, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  iconPillActive: { backgroundColor: colors.redWash },
  homeGrid: { width: 17, height: 17, flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  homeGridCell: { width: 7, height: 7, borderRadius: 1, borderWidth: 1.5 },
  teamBadge: { position: 'absolute', top: -3, right: 4, width: 14, height: 14, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.red, borderWidth: 1, borderColor: '#fff' },
  teamBadgeText: { color: '#fff', fontSize: 8, lineHeight: 10, fontWeight: '800' },
});

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="PokemonDetails"
        component={PokemonDetailsPlaceholder}
        options={{ title: '', headerBackTitle: 'Back', headerShadowVisible: false, headerStyle: { backgroundColor: colors.background }, contentStyle: { backgroundColor: colors.background } }}
      />
    </Stack.Navigator>
  );
}
