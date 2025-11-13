import { StyleSheet, Text, View } from 'react-native';
import { ExtractedField } from '@/data/mockData';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';

interface Props {
  field: ExtractedField;
}

export function FieldCard({ field }: Props) {
  const colors = useThemeColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceAlt }]}> 
      <Text style={[styles.label, { color: colors.textMuted }]}>{field.label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{field.value}</Text>
      <Text style={[styles.confidence, { color: colors.textMuted }]}>
        Confidence {(field.confidence * 100).toFixed(0)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  confidence: {
    marginTop: spacing.xs,
    fontSize: 12,
  },
});
