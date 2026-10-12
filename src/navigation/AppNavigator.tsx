import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { colors } from '../theme/colors';
import { BrowseScreen } from '../screens/BrowseScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { CollectionDetailScreen } from '../screens/CollectionDetailScreen';
import { AddPokemonScreen } from '../screens/AddPokemonScreen';
import { PokemonDetailScreen } from '../screens/PokemonDetailScreen';

export type RootStackParamList = {
  Home: undefined;
  CollectionDetail: { collectionId: string };
  AddPokemon: { collectionId: string };
  PokemonDetail: { pokemonId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

function HomeTabs() {
  return <Tabs.Navigator screenOptions={{
    headerStyle: { backgroundColor: colors.red }, headerTintColor: colors.white,
    headerTitleStyle: { fontWeight: '900' },
    tabBarActiveTintColor: colors.redDark, tabBarInactiveTintColor: colors.muted,
    tabBarStyle: { height: 62, paddingBottom: 6 },
  }}>
    <Tabs.Screen name="Browse" component={BrowseScreen} options={{ title: 'Pokédex', tabBarLabel: 'Browse',
      tabBarIcon: ({ color }) => <Text style={{ fontSize: 25, color }}>◉</Text> }} />
    <Tabs.Screen name="Library" component={LibraryScreen} options={{ title: 'My Library', tabBarLabel: 'My Library',
      tabBarIcon: ({ color }) => <Text style={{ fontSize: 25, color }}>♥</Text> }} />
  </Tabs.Navigator>;
}

export function AppNavigator() {
  return <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.red }, headerTintColor: colors.white, headerTitleStyle: { fontWeight: '800' } }}>
      <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} options={{ title: 'Collection' }} />
      <Stack.Screen name="AddPokemon" component={AddPokemonScreen} options={{ title: 'Add Pokémon' }} />
      <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen} options={{ title: 'Pokémon' }} />
    </Stack.Navigator>
  </NavigationContainer>;
}
