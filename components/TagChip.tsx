import {
  AccessibilityRole,
  AccessibilityState,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  label: string;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
};

export function TagChip({
  label,
  selected = false,
  style,
  accessibilityLabel,
  accessibilityRole,
  accessibilityHint,
  accessibilityState,
}: Props) {
  const colors = useThemeColors();
  const derivedState = selected ? { selected: true } : undefined;
  const isAccessible = Boolean(accessibilityRole || accessibilityLabel || accessibilityHint || accessibilityState);

  return (
    <View
      style={[
        styles.container,
        style,
        {
          backgroundColor: selected ? colors.primary : colors.surfaceAlt,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
      accessible={isAccessible}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState ?? derivedState}
    >
      <Text
        style={[
          styles.text,
          { color: selected ? '#FFFFFF' : colors.text },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
});
