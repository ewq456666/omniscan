import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const iconMap: Record<'index' | 'capture' | 'search' | 'settings', IconName> = {
  index: 'home-variant',
  capture: 'camera-plus',
  search: 'magnify',
  settings: 'cog',
};

export default function TabsLayout() {
  const colors = useThemeColors();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 74,
          paddingBottom: 8,
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
      <Tabs.Screen name="index" options={{ title: t('navigation.tabs.home') }} />
      <Tabs.Screen
        name="capture"
        options={{ title: t('navigation.tabs.scan') }}
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push('/camera');
          },
        }}
      />
      <Tabs.Screen name="search" options={{ title: t('navigation.tabs.search') }} />
      <Tabs.Screen name="settings" options={{ title: t('navigation.tabs.settings') }} />
    </Tabs>
  );
}
