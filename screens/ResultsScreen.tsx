import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { useMockDataStore } from '@/stores/useMockDataStore';
import { FieldCard } from '@/components/FieldCard';
import { TagChip } from '@/components/TagChip';

export function ResultsScreen() {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { extractedFields, tags } = useMockDataStore();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={[styles.title, { color: colors.text }]}>{t('results.title')}</Text>
        <View style={[styles.preview, { backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.textMuted }}>{t('results.preview')}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('results.extracted')}</Text>
        {extractedFields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('results.suggestedTags')}</Text>
        <View style={styles.tagGrid}>
          {tags.map((tag) => (
            <TagChip key={tag} label={tag} style={styles.tagChip} />
          ))}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: colors.border }]}
            accessibilityRole="button"
            accessibilityLabel={t('common.accessibility.shareResults')}
          >
            <MaterialCommunityIcons name="share" color={colors.text} size={20} />
            <Text style={[styles.actionText, { color: colors.text }]}>{t('results.share')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonTrailing, { borderColor: colors.border }]}
            accessibilityRole="button"
            accessibilityLabel={t('common.accessibility.saveResults')}
          >
            <MaterialCommunityIcons name="content-save" color={colors.text} size={20} />
            <Text style={[styles.actionText, { color: colors.text }]}>{t('results.save')}</Text>
          </TouchableOpacity>
        </View>
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
  preview: {
    height: 220,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: spacing.md,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  tagChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionButtonTrailing: {
    marginLeft: spacing.sm,
  },
});
