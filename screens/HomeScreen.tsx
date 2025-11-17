import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { SectionHeader } from '@/components/SectionHeader';
import { QuickActionCard } from '@/components/QuickActionCard';
import { ScanItemCard } from '@/components/ScanItemCard';
import { TagChip } from '@/components/TagChip';
import { useMockDataStore } from '@/stores/useMockDataStore';

export function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { scans, appStatus } = useMockDataStore();
  const hasPendingUploads = appStatus.pendingUploads > 0;
  const pendingCopy = `${appStatus.pendingUploads} pending ${appStatus.pendingUploads === 1 ? 'upload' : 'uploads'}`;
  const quickActions = [
    {
      key: 'capture',
      title: hasPendingUploads ? 'Resume Capture' : 'Start Scan',
      subtitle: hasPendingUploads ? pendingCopy : 'Capture a new document',
      icon: (
        <MaterialCommunityIcons
          name="camera"
          size={28}
          color="#FFFFFF"
        />
      ),
      onPress: () => router.push('/camera'),
      variant: 'primary' as const,
    },
    {
      key: 'import',
      title: 'Import',
      subtitle: 'Add from gallery',
      icon: (
        <MaterialCommunityIcons
          name="image-multiple"
          size={28}
          color="#FFFFFF"
        />
      ),
      onPress: () => router.push('/gallery'),
      accentColor: colors.secondary,
    },
    {
      key: 'progress',
      title: 'Track Progress',
      subtitle: 'Processing status',
      icon: (
        <MaterialCommunityIcons
          name="progress-clock"
          size={28}
          color="#FFFFFF"
        />
      ),
      onPress: () => router.push('/processing'),
      accentColor: colors.success,
    },
    {
      key: 'results',
      title: 'Review Latest',
      subtitle: 'Inspect extraction',
      icon: (
        <MaterialCommunityIcons
          name="file-document-edit"
          size={28}
          color="#FFFFFF"
        />
      ),
      onPress: () => router.push('/results'),
      accentColor: colors.warning,
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <FlatList
        data={scans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ScanItemCard item={item} />}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: spacing.xxl, paddingHorizontal: spacing.lg }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View>
                <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                  OmniScan keeps your documents organized
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.syncBadge, { backgroundColor: colors.surface }]}
                onPress={() => router.push('/processing')}
                accessibilityRole="button"
                accessibilityLabel="View processing queue"
                accessibilityHint="Opens the processing progress screen"
              >
                <MaterialCommunityIcons
                  name={appStatus.syncStatus === 'syncing' ? 'sync' : 'check-circle'}
                  color={colors.primary}
                  size={18}
                />
                <Text style={[styles.syncText, { color: colors.text }]}>
                  {appStatus.pendingUploads} pending
                </Text>
              </TouchableOpacity>
            </View>

            <SectionHeader title="Quick Actions" />
            <FlatList
              data={quickActions}
              horizontal
              keyExtractor={(item) => item.key}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: spacing.md,
                paddingRight: spacing.lg,
              }}
              renderItem={({ item }) => (
                <QuickActionCard
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  onPress={item.onPress}
                  variant={item.variant}
                  accentColor={item.accentColor}
                />
              )}
            />

            <SectionHeader
              title="Recent Scans"
              action={
                <TouchableOpacity onPress={() => router.push('/content-list')}>
                  <Text style={{ color: colors.primary }}>View All</Text>
                </TouchableOpacity>
              }
            />
          </View>
        }
        ListFooterComponent={
          <View style={{ marginTop: spacing.xl }}>
            <SectionHeader title="Suggested Tags" />
            <FlatList
              horizontal
              data={scans.flatMap((scan) => scan.tags)}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <View style={{ marginRight: spacing.sm }}>
                  <TagChip label={item} />
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: spacing.lg }}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 15,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  syncText: {
    marginLeft: spacing.xs,
    fontSize: 13,
    fontWeight: '600',
  },
});
