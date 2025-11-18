import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';

type Props = {
  progress: number;
  onPress: () => void;
};

export function ProcessingCapsule({ progress, onPress }: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('common.accessibility.viewProcessing')}
      accessibilityHint={t('common.accessibility.processingHint')}
    >
      <View style={[styles.iconBubble, { backgroundColor: colors.surfaceAlt }]}>
        <MaterialCommunityIcons name="progress-clock" size={26} color={colors.primary} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.label, { color: colors.textMuted }]}>{t('home.processingCapsule.label')}</Text>
        <Text style={[styles.value, { color: colors.text }]}>{t('home.processingCapsule.value', { progress })}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={28} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  label: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
