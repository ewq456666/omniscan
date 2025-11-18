import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import i18next from '@/i18n/config';
import { useThemeColors } from '@/hooks/useThemeColors';
import { LocalizationProvider } from '@/providers/LocalizationProvider';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colors = useThemeColors();
  const statusBarStyle = colors.isDark ? 'light' : 'dark';

  return (
    <I18nextProvider i18n={i18next}>
      <LocalizationProvider>
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
      </LocalizationProvider>
    </I18nextProvider>
  );
}
