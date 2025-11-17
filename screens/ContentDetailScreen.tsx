import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { useMockDataStore } from '@/stores/useMockDataStore';
import { FieldCard } from '@/components/FieldCard';
import { TagChip } from '@/components/TagChip';

export function ContentDetailScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { content } = useMockDataStore();
  const params = useLocalSearchParams<{ id?: string }>();
  const item = params.id ? content.find((entry) => entry.id === params.id) : content[0];

  if (!item) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>No content available.</Text>
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
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <Text style={{ color: colors.textMuted }}>{item.category}</Text>
        <View style={styles.tagRow}>
          {item.tags.map((tag) => (
            <TagChip key={tag} label={tag} style={styles.tagChip} />
          ))}
        </View>
        <View style={styles.headerRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Extracted Data</Text>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/content-edit', params: { id: item.id } })}
            accessibilityRole="button"
            accessibilityLabel="Edit extracted data"
          >
            <Text style={{ color: colors.primary }}>Edit</Text>
          </TouchableOpacity>
        </View>
        {item.fields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
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
});
