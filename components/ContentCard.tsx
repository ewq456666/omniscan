import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ContentItem } from '@/data/mockData';
import { spacing } from '@/theme/spacing';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TagChip } from '@/components/TagChip';

interface Props {
  item: ContentItem;
  onPress?: () => void;
}

export function ContentCard({ item, onPress }: Props) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.container, { backgroundColor: colors.surface }]}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.category}`}
      accessibilityHint="Opens content details"
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.category, { color: colors.textMuted }]}>
          {item.category}
        </Text>
        <View style={styles.tagsRow}>
          {item.tags.map((tag) => (
            <TagChip key={tag} label={tag} style={styles.tagChip} />
          ))}
        </View>
        <Text style={[styles.updatedAt, { color: colors.textMuted }]}>
          Updated {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
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
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    marginTop: spacing.xs,
    fontSize: 13,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  updatedAt: {
    marginTop: spacing.sm,
    fontSize: 12,
  },
  tagChip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
});
