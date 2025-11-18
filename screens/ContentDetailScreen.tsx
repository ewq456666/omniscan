import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { useMockDataStore } from '@/stores/useMockDataStore';
import { FieldCard } from '@/components/FieldCard';
import { TagChip } from '@/components/TagChip';
import { ScanItem } from '@/data/mockData';

dayjs.extend(relativeTime);

export function ContentDetailScreen() {
  const colors = useThemeColors();
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

  if (!contentItem && !scanItem) {
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
        <Text style={[styles.title, { color: colors.text }]}>
          {contentItem?.title ?? scanItem?.title}
        </Text>
        <Text style={{ color: colors.textMuted }}>
          {contentItem?.category ?? scanItem?.type ?? 'Uncategorized'}
        </Text>
        <View style={styles.tagRow}>
          {(contentItem?.tags ?? scanItem?.tags ?? []).map((tag) => (
            <TagChip key={tag} label={tag} style={styles.tagChip} />
          ))}
        </View>
        {contentItem ? (
          <View>
            <View style={styles.headerRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Extracted Data</Text>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/content-edit', params: { id: contentItem.id } })}
                accessibilityRole="button"
                accessibilityLabel="Edit extracted data"
              >
                <Text style={{ color: colors.primary }}>Edit</Text>
              </TouchableOpacity>
            </View>
            {contentItem.fields.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))}
          </View>
        ) : null}

        {scanItem ? (
          <View style={{ marginTop: spacing.lg }}>
            <View style={styles.headerRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Scan status</Text>
            </View>
            <View style={[styles.scanMetaCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Type</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{scanItem.type}</Text>
              <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Status</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{scanItem.status}</Text>
              <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Captured</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {dayjs(scanItem.timestamp).format('MMM D, YYYY h:mm A')} ({dayjs(scanItem.timestamp).fromNow()})
              </Text>
            </View>
          </View>
        ) : null}

        {!contentItem && scanItem ? (
          <Text style={{ color: colors.textMuted, marginTop: spacing.md }}>
            This scan has not been fully extracted yet. Review and save it once extraction completes.
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
