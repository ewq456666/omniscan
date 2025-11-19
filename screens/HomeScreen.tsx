import { useMemo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { HeroInsightCard } from '@/components/home/HeroInsightCard';
import { QuickAction, QuickActionGrid } from '@/components/home/QuickActionGrid';
import { ProcessingCapsule } from '@/components/home/ProcessingCapsule';
import { RecentScansStack } from '@/components/home/RecentScansStack';
import { AdaptivePanel } from '@/components/home/AdaptivePanel';
import { useMockDataStore, HomeModuleKey } from '@/stores/useMockDataStore';

type ModuleItem = {
  key: HomeModuleKey;
};

export function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { t } = useTranslation();
  const scans = useMockDataStore((state) => state.scans);
  const appStatus = useMockDataStore((state) => state.appStatus);
  const processingSteps = useMockDataStore((state) => state.processingSteps);
  const tags = useMockDataStore((state) => state.tags);
  const homeLayout = useMockDataStore((state) => state.homeLayout);
  const setAdaptivePanelType = useMockDataStore((state) => state.setAdaptivePanelType);

  const modules: ModuleItem[] = homeLayout.order.map((key) => ({ key }));
  const pendingScansCount = useMemo(() => scans.filter((scan) => scan.status !== 'synced').length, [scans]);
  const lastScanTitle = scans[0]?.title;
  const overallProgress =
    processingSteps.length === 0
      ? 0
      : Math.round(
        (processingSteps.reduce((sum, step) => sum + step.progress, 0) / processingSteps.length) * 100,
      );

  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        key: 'capture',
        title:
          appStatus.pendingUploads > 0
            ? t('home.quickActions.capture.titlePending')
            : t('home.quickActions.capture.titleReady'),
        subtitle:
          appStatus.pendingUploads > 0
            ? t('home.quickActions.capture.subtitlePending', { count: appStatus.pendingUploads })
            : t('home.quickActions.capture.subtitleReady'),
        icon: <MaterialCommunityIcons name="camera" size={24} color="#FFFFFF" />,
        onPress: () => router.push('/camera'),
        accentColor: colors.primary,
        emphasis: true,
      },
      {
        key: 'import',
        title: t('home.quickActions.import.title'),
        subtitle: t('home.quickActions.import.subtitle'),
        icon: <MaterialCommunityIcons name="image-multiple" size={22} color={colors.text} />,
        onPress: () => router.push('/gallery'),
      },
      {
        key: 'progress',
        title: t('home.quickActions.progress.title'),
        subtitle: t('home.quickActions.progress.subtitle'),
        icon: <MaterialCommunityIcons name="progress-check" size={22} color={colors.text} />,
        onPress: () => router.push('/processing'),
      },
      {
        key: 'results',
        title: t('home.quickActions.results.title'),
        subtitle: t('home.quickActions.results.subtitle'),
        icon: <MaterialCommunityIcons name="file-document-edit" size={22} color={colors.text} />,
        onPress: () => router.push('/results'),
      },
      {
        key: 'pending',
        title: t('home.quickActions.pending.title'),
        subtitle: t('home.quickActions.pending.subtitle', { count: pendingScansCount }),
        icon: <MaterialCommunityIcons name="progress-alert" size={22} color={colors.text} />,
        onPress: () => router.push('/pending-reviews'),
      },
    ],
    [appStatus.pendingUploads, colors.primary, colors.text, pendingScansCount, router, t],
  );

  const pinnedAnalytics = useMockDataStore((state) => state.pinnedAnalytics);

  const pinnedActions: QuickAction[] = useMemo(() => {
    return pinnedAnalytics.map(categoryId => {
      // Currently only receipt is supported, but this is extensible
      if (categoryId === 'receipt') {
        return {
          key: 'analytics-receipt',
          title: t('analytics.receiptTitle', { defaultValue: 'Receipt Analytics' }),
          subtitle: t('analytics.viewInsights', { defaultValue: 'View spending insights' }),
          icon: <MaterialCommunityIcons name="chart-bar" size={22} color={colors.primary} /> as any,
          onPress: () => router.push('/receipt-analytics'),
          accentColor: colors.primary,
        };
      }
      return null;
    }).filter((action) => action !== null) as QuickAction[];
  }, [pinnedAnalytics, colors.primary, router, t]);

  const allQuickActions = [...pinnedActions, ...quickActions];

  const renderModule = ({ item }: ListRenderItemInfo<ModuleItem>) => {
    switch (item.key) {
      case 'hero':
        return (
          <View style={styles.module}>
            <HeroInsightCard
              pendingUploads={appStatus.pendingUploads}
              lastScanTitle={lastScanTitle}
              onPrimaryAction={() =>
                appStatus.pendingUploads > 0 ? router.push('/processing') : router.push('/camera')
              }
              onSecondaryAction={() =>
                appStatus.pendingUploads > 0 ? router.push('/camera') : router.push('/results')
              }
            />
          </View>
        );
      case 'quickActions':
        return (
          <View style={styles.module}>
            <QuickActionGrid actions={allQuickActions} />
          </View>
        );
      case 'processing':
        return (
          <View style={styles.module}>
            <ProcessingCapsule progress={overallProgress} onPress={() => router.push('/processing')} />
          </View>
        );
      case 'recentScans':
        return (
          <View style={styles.module}>
            <RecentScansStack
              scans={scans}
              onPressLibrary={() => router.push('/content-list')}
              onPressScan={(scan) => router.push({ pathname: '/content-detail', params: { scanId: scan.id } })}
            />
          </View>
        );
      case 'adaptive':
        return (
          <View style={styles.module}>
            <AdaptivePanel
              panelType={homeLayout.adaptivePanel}
              setPanelType={setAdaptivePanelType}
              tags={tags}
              scans={scans}
              onSelectTag={(tag) => router.push({ pathname: '/search', params: { tag } })}
              onSelectPending={(scan) => router.push({ pathname: '/content-detail', params: { scanId: scan.id } })}
              onViewAllPending={() => router.push('/pending-reviews')}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <FlatList
        data={modules}
        keyExtractor={(item) => item.key}
        renderItem={renderModule}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xxl,
        }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>{t('home.welcomeTitle')}</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t('home.welcomeSubtitle')}</Text>
            </View>
            <View style={[styles.syncBadge, { backgroundColor: colors.surface }]}>
              <MaterialCommunityIcons
                name={appStatus.syncStatus === 'syncing' ? 'sync' : 'check-circle'}
                color={colors.primary}
                size={18}
              />
              <Text style={[styles.syncText, { color: colors.text }]}>
                {t('home.syncBadge', { count: appStatus.pendingUploads })}
              </Text>
            </View>
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
  header: {
    paddingBottom: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
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
  module: {
    width: '100%',
  },
});
