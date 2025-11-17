import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { spacing } from '@/theme/spacing';

type Props = {
  pendingUploads: number;
  lastScanTitle?: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
};

export function HeroInsightCard({
  pendingUploads,
  lastScanTitle,
  onPrimaryAction,
  onSecondaryAction,
}: Props) {
  const hasPending = pendingUploads > 0;
  const title = hasPending ? 'Finish outstanding captures' : 'Ready for a new scan?';
  const subtitle = hasPending
    ? `You have ${pendingUploads} pending ${pendingUploads === 1 ? 'upload' : 'uploads'}`
    : lastScanTitle
      ? `Last scan: ${lastScanTitle}`
      : 'No scans yet. Capture your first document.';
  const primaryLabel = hasPending ? 'Review uploads' : 'Start scan';
  const secondaryLabel = hasPending ? 'Start another scan' : 'View results';

  return (
    <LinearGradient colors={['#1E3A8A', '#7C3AED']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.copyBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: '#FFFFFF' }]}
          onPress={onPrimaryAction}
          accessibilityRole="button"
          accessibilityLabel={primaryLabel}
        >
          <Text style={[styles.primaryLabel, { color: '#0F172A' }]}>{primaryLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: 'rgba(255,255,255,0.6)' }]}
          onPress={onSecondaryAction}
          accessibilityRole="button"
          accessibilityLabel={secondaryLabel}
        >
          <Text style={styles.secondaryLabel}>{secondaryLabel}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  copyBlock: {
    gap: spacing.sm,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
