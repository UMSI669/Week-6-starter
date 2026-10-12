import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { QueryProvider } from '../providers/QueryProvider';

export default function RootLayout() {
  return (
    <QueryProvider>
      <StatusBar style="dark" />
      <Tabs screenOptions={{ headerTitle: 'Movie List', tabBarActiveTintColor: '#3155A6', headerShadowVisible: false, tabBarStyle: { backgroundColor: '#FFFFFF' } }}>
        <Tabs.Screen name="index" options={{ title: 'Browse', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>⌕</Text> }} />
        <Tabs.Screen name="my-list" options={{ title: 'My List', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>♡</Text> }} />
      </Tabs>
    </QueryProvider>
  );
}
