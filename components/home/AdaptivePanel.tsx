import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
};

const panelSequence: AdaptivePanelType[] = ['tags', 'pending'];

export function AdaptivePanel({ panelType, setPanelType, tags, scans }: Props) {
  const colors = useThemeColors();
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
          {panelType === 'tags' ? 'Suggested tags' : 'Pending reviews'}
        </Text>
        <TouchableOpacity onPress={handleCycle} accessibilityRole="button" accessibilityLabel="Change panel content">
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Switch</Text>
        </TouchableOpacity>
      </View>

      {panelType === 'tags' ? (
        <View style={styles.tagsGrid}>
          {tags.slice(0, 8).map((tag) => (
            <TagChip key={tag} label={tag} style={styles.tagChip} />
          ))}
        </View>
      ) : pendingScans.length === 0 ? (
        <Text style={{ color: colors.textMuted }}>All caught up!</Text>
      ) : (
        pendingScans.slice(0, 3).map((scan, index) => (
          <View
            key={scan.id}
            style={[
              styles.pendingItem,
              index < Math.min(3, pendingScans.length) - 1 ? { marginBottom: spacing.sm } : null,
            ]}
          >
            <View style={[styles.dot, { backgroundColor: scan.status === 'processing' ? colors.warning : '#EF4444' }]} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: '600' }} numberOfLines={1}>
                {scan.title}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }} numberOfLines={1}>
                {scan.subtitle}
              </Text>
            </View>
            <Text style={{ color: colors.textMuted, fontSize: 12, marginLeft: spacing.sm }}>{scan.status}</Text>
          </View>
        ))
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
  },
});
