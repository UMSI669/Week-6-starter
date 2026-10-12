import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors, shadow, type } from '../../theme/tokens';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.cream },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: type.label,
          fontWeight: '700',
          marginBottom: 8,
        },
        tabBarStyle: {
          height: 76,
          paddingTop: 8,
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          ...shadow,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarAccessibilityLabel: 'Explore map',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons color={color} name={focused ? 'map' : 'map-outline'} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'My List',
          tabBarAccessibilityLabel: 'My saved destinations',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons color={color} name={focused ? 'bookmark' : 'bookmark-outline'} size={25} />
          ),
        }}
      />
    </Tabs>
  );
}
