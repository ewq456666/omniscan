import { useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { TagChip } from '@/components/TagChip';
import { useMockDataStore } from '@/stores/useMockDataStore';
import { ScanItem } from '@/data/mockData';

dayjs.extend(relativeTime);

type PendingStatus = Extract<ScanItem['status'], 'processing' | 'error'>;

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Processing', value: 'processing' },
  { label: 'Needs attention', value: 'error' },
] as const;

type FilterValue = (typeof filters)[number]['value'];

export function PendingReviewsScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const scans = useMockDataStore((state) => state.scans);
  const pendingScans = useMemo(() => scans.filter(isPendingScan), [scans]);
  const [filter, setFilter] = useState<FilterValue>('all');

  const filtered = pendingScans.filter((scan) => (filter === 'all' ? true : scan.status === filter));
  const focusId = typeof params.id === 'string' ? params.id : undefined;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Pending reviews</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Finish reviewing your latest captures to keep everything synced.
        </Text>

        <View style={styles.filtersRow}>
          {filters.map(({ label, value }) => {
            const isActive = filter === value;
            return (
              <TouchableOpacity
                key={value}
                onPress={() => setFilter(value)}
                style={{ marginRight: spacing.sm }}
                accessibilityRole="button"
                accessibilityLabel={`Filter ${label}`}
                accessibilityState={{ selected: isActive }}
              >
                <TagChip label={label} selected={isActive} />
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
          ListEmptyComponent={
            <Text style={{ color: colors.textMuted, marginTop: spacing.xl }}>
              {pendingScans.length === 0
                ? 'You are all caught up.'
                : 'No items match this filter.'}
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: item.id === focusId ? colors.primary : colors.surface,
                },
              ]}
              onPress={() => router.push({ pathname: '/content-detail', params: { scanId: item.id } })}
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.title}`}
            >
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <StatusPill status={item.status} />
                </View>
                <Text style={{ color: colors.textMuted }} numberOfLines={1}>
                  {item.subtitle}
                </Text>
                <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                  {dayjs(item.timestamp).fromNow()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function StatusPill({ status }: { status: PendingStatus }) {
  const colors = useThemeColors();
  const backgroundColor = status === 'processing' ? colors.warning : '#EF4444';
  const label = status === 'processing' ? 'Processing' : 'Needs attention';
  return (
    <View style={[styles.statusPill, { backgroundColor }]}>
      <Text style={styles.statusLabel}>{label}</Text>
    </View>
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
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    fontSize: 15,
  },
  filtersRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
  },
  thumbnail: {
    width: 72,
    height: 96,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  timestamp: {
    fontSize: 12,
    marginTop: spacing.sm,
  },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  statusLabel: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '600',
  },
});

function isPendingScan(scan: ScanItem): scan is ScanItem & { status: PendingStatus } {
  return scan.status !== 'synced';
}
