import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { useMockDataStore } from '@/stores/useMockDataStore';
import { TagChip } from '@/components/TagChip';
import { CategoryTemplate } from '@/components/CategoryTemplate';
import { categoryDefinitions, CategoryId } from '@/data/categoryDefinitions';

dayjs.extend(relativeTime);

export function ContentDetailScreen() {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const router = useRouter();
  const { content, scans } = useMockDataStore();
  const params = useLocalSearchParams<{ id?: string; scanId?: string }>();
  const contentId = typeof params.id === 'string' ? params.id : undefined;
  const scanId = typeof params.scanId === 'string' ? params.scanId : undefined;
  const resolvedContentId = contentId ?? (!scanId ? content[0]?.id : undefined);
  const contentItem = resolvedContentId
    ? content.find((entry) => entry.id === resolvedContentId)
    : undefined;
  const scanItem = scanId ? scans.find((scan) => scan.id === scanId) : undefined;
  const getCategoryLabel = () => {
    if (contentItem) {
      return t(categoryDefinitions[contentItem.category].label);
    }
    if (scanItem && scanItem.category && isCategoryId(scanItem.category)) {
      return t(categoryDefinitions[scanItem.category].label);
    }
    return scanItem?.category ?? t('common.uncategorized');
  };

  if (!contentItem && !scanItem) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>{t('contentDetail.noContent')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {contentItem?.title ?? scanItem?.title}
        </Text>
        <Text style={{ color: colors.textMuted }}>{getCategoryLabel()}</Text>
        <View style={styles.tagRow}>
          {(contentItem?.tags ?? scanItem?.tags ?? []).map((tag) => (
            <TagChip key={tag} label={tag} style={styles.tagChip} />
          ))}
        </View>
        {contentItem ? (
          <View>
            <View style={styles.headerRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('contentDetail.extractedHeading')}</Text>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/content-edit', params: { id: contentItem.id } })}
                accessibilityRole="button"
                accessibilityLabel={t('common.accessibility.editExtractedData')}
              >
                <Text style={{ color: colors.primary }}>{t('contentDetail.edit')}</Text>
              </TouchableOpacity>
            </View>
            <CategoryTemplate category={contentItem.category} fields={contentItem.fields} />
          </View>
        ) : null}

        {scanItem ? (
          <View style={{ marginTop: spacing.lg }}>
            <View style={styles.headerRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('contentDetail.scanStatus')}</Text>
            </View>
            <View style={[styles.scanMetaCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.metaLabel, { color: colors.textMuted }]}>{t('contentDetail.type')}</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{getCategoryLabel()}</Text>
              <Text style={[styles.metaLabel, { color: colors.textMuted }]}>{t('contentDetail.status')}</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{t(`common.status.${scanItem.status}`)}</Text>
              <Text style={[styles.metaLabel, { color: colors.textMuted }]}>{t('contentDetail.captured')}</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {dayjs(scanItem.dateScanned).format('MMM D, YYYY h:mm A')} ({dayjs(scanItem.dateScanned).fromNow()})
              </Text>
            </View>
          </View>
        ) : null}

        {!contentItem && scanItem ? (
          <Text style={{ color: colors.textMuted, marginTop: spacing.md }}>
            {t('contentDetail.pendingNote')}
          </Text>
        ) : null}
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
    marginBottom: spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tagChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  scanMetaCard: {
    borderRadius: 20,
    padding: spacing.md,
    gap: spacing.sm,
  },
  metaLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});

function isCategoryId(value: string): value is CategoryId {
  return value in categoryDefinitions;
}
