import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  title: string;
  action?: ReactNode;
};

export function SectionHeader({ title, action }: Props) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { borderColor: colors.border }]}> 
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {action ? <View>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: typography.heading3,
    fontWeight: '600',
  },
});
