import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiscoverScreen from '../screens/DiscoverScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import PokemonDetailsPlaceholder from '../screens/PokemonDetailsPlaceholder';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
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
        name="Pokémon"
        component={DiscoverScreen}
        options={{ tabBarIcon: ({ focused }) => <Text style={{ color: focused ? colors.red : colors.muted, fontSize: 19 }}>{focused ? '▦' : '□'}</Text> }}
      />
      <Tab.Screen
        name="My Team"
        component={MyTeamScreen}
        options={{ tabBarIcon: ({ focused }) => <Text style={{ color: focused ? colors.red : colors.muted, fontSize: 19 }}>{focused ? '●' : '◯'}</Text> }}
      />
    </Tab.Navigator>
  );
}

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
