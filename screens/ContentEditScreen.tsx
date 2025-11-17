import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { useMockDataStore } from '@/stores/useMockDataStore';
import { TagChip } from '@/components/TagChip';

export function ContentEditScreen() {
  const colors = useThemeColors();
  const { content, tags } = useMockDataStore();
  const params = useLocalSearchParams<{ id?: string }>();
  const item = params.id ? content.find((entry) => entry.id === params.id) : content[0];

  if (!item) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>No content to edit.</Text>
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
        <Text style={[styles.title, { color: colors.text }]}>Edit Metadata</Text>
        <Text style={[styles.label, { color: colors.textMuted }]}>Title</Text>
        <TextInput
          defaultValue={item.title}
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          accessibilityLabel="Edit title"
        />
        <Text style={[styles.label, { color: colors.textMuted }]}>Category</Text>
        <TextInput
          defaultValue={item.category}
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          accessibilityLabel="Edit category"
        />
        <Text style={[styles.label, { color: colors.textMuted }]}>Tags</Text>
        <View style={styles.tagGrid}>
          {tags.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              selected={item.tags.includes(tag)}
              style={styles.tagChip}
            />
          ))}
        </View>
        <Text style={[styles.helper, { color: colors.textMuted }]}>
          Changes are saved automatically in this mock flow.
        </Text>
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
  label: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    borderRadius: 16,
    padding: spacing.md,
    fontSize: 16,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  helper: {
    marginTop: spacing.lg,
    fontSize: 13,
  },
  tagChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
});
