import { Image, StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ScanItem } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { TagChip } from '@/components/TagChip';

dayjs.extend(relativeTime);

type Props = {
  item: ScanItem;
};

export function ScanItemCard({ item }: Props) {
  const colors = useThemeColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}> 
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <StatusBadge status={item.status} />
        </View>
        <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={2}>
          {item.subtitle}
        </Text>
        <View style={styles.tagsRow}>
          {item.tags.map((tag) => (
            <TagChip key={tag} label={tag} style={styles.tagChip} />
          ))}
        </View>
        <Text style={[styles.timestamp, { color: colors.textMuted }]}>
          {dayjs(item.timestamp).fromNow()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  thumbnail: {
    width: 96,
    height: 96,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  timestamp: {
    marginTop: spacing.sm,
    fontSize: 12,
  },
  tagChip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
});
