import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { SectionHeader } from '@/components/SectionHeader';
import { QuickActionCard } from '@/components/QuickActionCard';
import { ScanItemCard } from '@/components/ScanItemCard';
import { TagChip } from '@/components/TagChip';
import { useMockDataStore } from '@/stores/useMockDataStore';

export function HomeScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { scans, appStatus } = useMockDataStore();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
    >
      <View style={{ height: insets.top }} />
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}> 
            OmniScan keeps your documents organized
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.syncBadge, { backgroundColor: colors.surface }]}
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.md, paddingRight: spacing.lg }}
      >
        <QuickActionCard
          title="Start Scan"
          subtitle="Capture a new document"
          icon={
            <MaterialCommunityIcons
              name='camera'
              size={28}
              color='#FFFFFF'
            />
          }
          onPress={() => router.push('/camera')}
        />
        <QuickActionCard
          title="Import"
          subtitle="Add from gallery"
          icon={
            <MaterialCommunityIcons
              name='image-multiple'
              size={28}
              color='#FFFFFF'
            />
          }
          onPress={() => router.push('/gallery')}
        />
        <QuickActionCard
          title="Track Progress"
          subtitle="View processing status"
          icon={
            <MaterialCommunityIcons
              name='progress-clock'
              size={28}
              color='#FFFFFF'
            />
          }
          onPress={() => router.push('/processing')}
        />
        <QuickActionCard
          title="Review Latest"
          subtitle="Inspect recent extraction"
          icon={
            <MaterialCommunityIcons
              name='file-document-edit'
              size={28}
              color='#FFFFFF'
            />
          }
          onPress={() => router.push('/results')}
        />
      </ScrollView>

      <SectionHeader
        title="Recent Scans"
        action={
          <TouchableOpacity onPress={() => router.push('/content-list')}>
            <Text style={{ color: colors.primary }}>View All</Text>
          </TouchableOpacity>
        }
      />
      {scans.map((scan) => (
        <ScanItemCard key={scan.id} item={scan} />
      ))}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
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
