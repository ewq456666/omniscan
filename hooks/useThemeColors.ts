import { useColorScheme } from 'react-native';
import { palette } from '@/theme/colors';
import { useMockDataStore } from '@/stores/useMockDataStore';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  isDark: boolean;
};

export const useThemeColors = (): ThemeColors => {
  const scheme = useColorScheme();
  const themePreference = useMockDataStore((state) => state.preferences.theme);
  const systemScheme = scheme ?? 'light';
  const resolvedScheme = themePreference === 'system' ? systemScheme : themePreference;
  const isDark = resolvedScheme !== 'light';

  return {
    background: isDark ? palette.background : '#F3F4F6',
    surface: isDark ? palette.surface : '#FFFFFF',
    surfaceAlt: isDark ? palette.surfaceAlt : '#F9FAFB',
    text: isDark ? palette.text : '#111827',
    textMuted: isDark ? palette.textMuted : '#6B7280',
    border: isDark ? palette.border : '#E5E7EB',
    primary: palette.primary,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    isDark,
  };
};
