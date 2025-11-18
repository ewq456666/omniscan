import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TagChip } from '@/components/TagChip';
import { ScanItem } from '@/data/mockData';
import { AdaptivePanelType } from '@/stores/useMockDataStore';

type Props = {
  panelType: AdaptivePanelType;
  setPanelType: (panel: AdaptivePanelType) => void;
  tags: string[];
  scans: ScanItem[];
  onSelectTag?: (tag: string) => void;
  onSelectPending?: (scan: ScanItem) => void;
  onViewAllPending?: () => void;
};

const panelSequence: AdaptivePanelType[] = ['tags', 'pending'];

export function AdaptivePanel({
  panelType,
  setPanelType,
  tags,
  scans,
  onSelectTag,
  onSelectPending,
  onViewAllPending,
}: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const pendingScans = scans.filter((scan) => scan.status !== 'synced');

  const handleCycle = () => {
    const currentIndex = panelSequence.indexOf(panelType);
    const next = panelSequence[(currentIndex + 1) % panelSequence.length];
    setPanelType(next);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {panelType === 'tags' ? t('home.adaptivePanel.tagsTitle') : t('home.adaptivePanel.pendingTitle')}
        </Text>
        <View style={styles.actions}>
          {panelType === 'pending' && pendingScans.length > 0 ? (
            <TouchableOpacity
              onPress={onViewAllPending}
              accessibilityRole="button"
              accessibilityLabel={t('home.adaptivePanel.viewAll')}
              style={{ marginRight: spacing.md }}
            >
              <Text style={{ color: colors.textMuted, fontWeight: '600' }}>{t('home.adaptivePanel.viewAll')}</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={handleCycle}
            accessibilityRole="button"
            accessibilityLabel={t('common.accessibility.changePanel')}
          >
            <Text style={{ color: colors.primary, fontWeight: '600' }}>{t('home.adaptivePanel.switch')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {panelType === 'tags' ? (
        <View style={styles.tagsGrid}>
          {tags.slice(0, 8).map((tag) => (
            <TouchableOpacity
              key={tag}
              onPress={() => onSelectTag?.(tag)}
              accessibilityRole="button"
              accessibilityLabel={t('common.accessibility.filterBy', { value: tag })}
            >
              <TagChip label={tag} style={styles.tagChip} />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View>
          {pendingScans.length === 0 ? (
            <Text style={{ color: colors.textMuted }}>{t('home.adaptivePanel.empty')}</Text>
          ) : (
            pendingScans.slice(0, 3).map((scan, index) => (
              <TouchableOpacity
                key={scan.id}
                style={[
                  styles.pendingItem,
                  index < Math.min(3, pendingScans.length) - 1 ? { marginBottom: spacing.sm } : null,
                ]}
                onPress={() => onSelectPending?.(scan)}
                accessibilityRole="button"
                accessibilityLabel={t('common.accessibility.reviewItem', { title: scan.title })}
              >
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: scan.status === 'processing' ? colors.warning : '#EF4444' },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: '600' }} numberOfLines={1}>
                    {scan.title}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }} numberOfLines={1}>
                    {scan.subtitle}
                  </Text>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginLeft: spacing.sm }}>
                  {t(`common.status.${scan.status}`)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
});
