import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Tabs } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { palette } from '@/theme/colors';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const iconMap: Record<'index' | 'search' | 'settings', IconName> = {
  index: 'home-variant',
  search: 'magnify',
  settings: 'cog',
};

export default function TabsLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
        },
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name={iconMap[route.name as keyof typeof iconMap]}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
