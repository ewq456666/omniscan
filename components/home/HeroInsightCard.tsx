import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const hasPending = pendingUploads > 0;
  const title = hasPending ? t('home.hero.pendingTitle') : t('home.hero.readyTitle');
  const subtitle = hasPending
    ? t('home.hero.pendingSubtitle', { count: pendingUploads })
    : lastScanTitle
      ? t('home.hero.lastScan', { title: lastScanTitle })
      : t('home.hero.emptySubtitle');
  const primaryLabel = hasPending ? t('home.hero.primaryPending') : t('home.hero.primaryReady');
  const secondaryLabel = hasPending ? t('home.hero.secondaryPending') : t('home.hero.secondaryReady');

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
