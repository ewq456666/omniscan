import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { useMockDataStore } from '@/stores/useMockDataStore';
import { ProcessingStepItem } from '@/components/ProcessingStepItem';

export function ProcessingScreen() {
  const colors = useThemeColors();
  const { processingSteps } = useMockDataStore();
  const total = processingSteps.reduce((sum, step) => sum + step.progress, 0);
  const overallProgress = processingSteps.length === 0 ? 0 : Math.round((total / processingSteps.length) * 100);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={[styles.title, { color: colors.text }]}>Processing</Text>
        <View style={[styles.summary, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
            Overall progress
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {overallProgress}%
          </Text>
        </View>
        {processingSteps.map((step) => (
          <ProcessingStepItem key={step.id} step={step} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  summary: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
  },
  summaryValue: {
    marginTop: spacing.sm,
    fontSize: 32,
    fontWeight: '700',
  },
});
