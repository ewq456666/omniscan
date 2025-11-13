import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  label: string;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function TagChip({ label, selected = false, style }: Props) {
  const colors = useThemeColors();

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
