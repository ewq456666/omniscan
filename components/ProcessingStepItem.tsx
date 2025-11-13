import { StyleSheet, Text, View } from 'react-native';
import { ProcessingStep } from '@/data/mockData';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  step: ProcessingStep;
};

export function ProcessingStepItem({ step }: Props) {
  const colors = useThemeColors();
  const progress = Math.round(step.progress * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceAlt }]}> 
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.text }]}>{step.label}</Text>
        <Text style={[styles.percent, { color: colors.text }]}>{progress}%</Text>
      </View>
      <View style={[styles.bar, { backgroundColor: colors.border }]}> 
        <View
          style={{
            width: `${progress}%`,
            backgroundColor: colors.primary,
            height: '100%',
            borderRadius: 999,
          }}
        />
      </View>
      <Text style={[styles.description, { color: colors.textMuted }]}>
        {step.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
  },
  percent: {
    fontWeight: '600',
    fontSize: 14,
  },
  bar: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  description: {
    marginTop: spacing.sm,
    fontSize: 13,
  },
});
