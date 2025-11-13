import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';

type Status = 'synced' | 'processing' | 'error';

type Props = {
  status: Status;
};

const statusCopy: Record<Status, string> = {
  synced: 'Synced',
  processing: 'Processing',
  error: 'Needs Attention',
};

export function StatusBadge({ status }: Props) {
  const colors = useThemeColors();
  const backgroundColor =
    status === 'synced'
      ? colors.success
      : status === 'processing'
      ? colors.warning
      : '#EF4444';

  return (
    <View style={[styles.container, { backgroundColor }]}> 
      <Text style={styles.text}>{statusCopy[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  text: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '600',
  },
});
