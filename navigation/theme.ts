import { DefaultTheme, Theme } from '@react-navigation/native';
import { palette } from '@/theme/colors';

export const navigationTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: palette.background,
    border: palette.border,
    card: palette.surface,
    primary: palette.primary,
    text: palette.text,
  },
};
