import { Tabs } from 'expo-router';

const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: '#e8b84a',
  tabBarInactiveTintColor: '#85899b',
  tabBarStyle: {
    backgroundColor: '#11121a',
    borderTopColor: '#272938',
  },
};

export default function TabsLayout() {
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen name="index" options={{ title: 'Search', tabBarIcon: () => null }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites', tabBarIcon: () => null }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: () => null }} />
      {/* The detail screen is a route but should not appear as a tab. */}
      <Tabs.Screen name="movie/[id]" options={{ href: null }} />
    </Tabs>
  );
}
