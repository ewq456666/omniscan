import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colors = useThemeColors();
  const statusBarStyle = colors.isDark ? 'light' : 'dark';

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="camera" />
        <Stack.Screen name="gallery" />
        <Stack.Screen name="processing" />
        <Stack.Screen name="results" />
        <Stack.Screen name="content-list" />
        <Stack.Screen name="content-detail" />
        <Stack.Screen name="content-edit" />
        <Stack.Screen name="pending-reviews" />
      </Stack>
      <StatusBar style={statusBarStyle} backgroundColor={colors.background} />
    </SafeAreaProvider>
  );
}
