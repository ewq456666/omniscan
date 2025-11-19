import React, { useState, useMemo } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { gradients } from '@/theme/colors';
import { useMockDataStore } from '@/stores/useMockDataStore';
import {
    calculateMonthlyStats,
    filterByTimeRange,
    groupByMerchant,
    getTopRankings,
    TimeRange,
} from '../utils/receiptAnalytics.utils';

export function ReceiptAnalyticsScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { t } = useTranslation();
    const content = useMockDataStore((state) => state.content);
    const [timeRange, setTimeRange] = useState<TimeRange>(30);

    // Filter only receipts
    const allReceipts = useMemo(() =>
        content.filter((item) => item.category === 'receipt'),
        [content]);

    // Calculate stats based on all receipts (for monthly overview)
    const monthlyStats = useMemo(() =>
        calculateMonthlyStats(allReceipts),
        [allReceipts]);

    // Filter receipts by selected time range for charts/rankings
    const filteredReceipts = useMemo(() =>
        filterByTimeRange(allReceipts, timeRange),
        [allReceipts, timeRange]);

    const breakdown = useMemo(() =>
        groupByMerchant(filteredReceipts),
        [filteredReceipts]);

    const rankings = useMemo(() =>
        getTopRankings(filteredReceipts),
        [filteredReceipts]);

    const renderTimeSelector = () => (
        <View style={[styles.segmentContainer, { backgroundColor: colors.surfaceAlt }]}>
            {[7, 30, 90].map((days) => (
                <TouchableOpacity
                    key={days}
                    style={[
                        styles.segmentButton,
                        timeRange === days && { backgroundColor: colors.surface },
                        timeRange === days && styles.activeSegment,
                    ]}
                    onPress={() => setTimeRange(days as TimeRange)}
                >
                    <Text
                        style={[
                            styles.segmentText,
                            { color: timeRange === days ? colors.text : colors.textMuted },
                        ]}
                    >
                        {t(`analytics.days${days}`, { defaultValue: `${days} Days` })}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>
                    {t('analytics.receiptTitle', { defaultValue: 'Receipt Analytics' })}
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Monthly Overview Card */}
                <LinearGradient
                    colors={gradients.primary as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroCard}
                >
                    <Text style={styles.heroLabel}>
                        {t('analytics.currentMonth', { defaultValue: 'This Month' })}
                    </Text>
                    <Text style={styles.heroAmount}>
                        ${monthlyStats.currentTotal.toFixed(2)}
                    </Text>
                    <View style={styles.trendRow}>
                        <MaterialCommunityIcons
                            name={monthlyStats.trend === 'up' ? 'arrow-up' : 'arrow-down'}
                            size={16}
                            color="rgba(255,255,255,0.9)"
                        />
                        <Text style={styles.trendText}>
                            {monthlyStats.percentChange.toFixed(1)}% {t('analytics.vsLastMonth', { defaultValue: 'vs last month' })}
                        </Text>
                    </View>
                </LinearGradient>

                {/* Time Range Selector */}
                {renderTimeSelector()}

                {/* Spending Breakdown */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('analytics.breakdown', { defaultValue: 'Spending Breakdown' })}
                    </Text>
                    {breakdown.map((item: { label: string; amount: number; percentage: number; count: number }, index: number) => (
                        <View key={item.label} style={styles.breakdownItem}>
                            <View style={styles.breakdownHeader}>
                                <Text style={[styles.breakdownLabel, { color: colors.text }]}>
                                    {item.label}
                                </Text>
                                <Text style={[styles.breakdownAmount, { color: colors.text }]}>
                                    ${item.amount.toFixed(2)}
                                </Text>
                            </View>
                            <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceAlt }]}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        {
                                            backgroundColor: colors.primary,
                                            width: `${item.percentage}%`,
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={[styles.breakdownMeta, { color: colors.textMuted }]}>
                                {item.count} {t('analytics.transactions', { defaultValue: 'transactions' })} • {item.percentage.toFixed(1)}%
                            </Text>
                        </View>
                    ))}
                    {breakdown.length === 0 && (
                        <Text style={{ color: colors.textMuted, textAlign: 'center', padding: spacing.lg }}>
                            {t('analytics.noDataForPeriod', { defaultValue: 'No data for this period' })}
                        </Text>
                    )}
                </View>

                {/* Top Rankings */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('analytics.topRankings', { defaultValue: 'Top Rankings' })}
                    </Text>
                    <View style={styles.rankingsGrid}>
                        {rankings.highest && (
                            <View style={[styles.rankingCard, { backgroundColor: colors.surface }]}>
                                <MaterialCommunityIcons name="trophy-outline" size={24} color={colors.primary} />
                                <Text style={[styles.rankingLabel, { color: colors.textMuted }]}>
                                    {t('analytics.highestTransaction', { defaultValue: 'Highest' })}
                                </Text>
                                <Text style={[styles.rankingValue, { color: colors.text }]}>
                                    ${rankings.highest.amount.toFixed(2)}
                                </Text>
                                <Text style={[styles.rankingSub, { color: colors.textMuted }]} numberOfLines={1}>
                                    {rankings.highest.label}
                                </Text>
                            </View>
                        )}
                        {rankings.frequent && (
                            <View style={[styles.rankingCard, { backgroundColor: colors.surface }]}>
                                <MaterialCommunityIcons name="store" size={24} color={colors.primary} />
                                <Text style={[styles.rankingLabel, { color: colors.textMuted }]}>
                                    {t('analytics.frequentMerchant', { defaultValue: 'Frequent' })}
                                </Text>
                                <Text style={[styles.rankingValue, { color: colors.text }]}>
                                    {rankings.frequent.label}
                                </Text>
                                <Text style={[styles.rankingSub, { color: colors.textMuted }]}>
                                    {rankings.frequent.count} {t('analytics.visits', { defaultValue: 'visits' })}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        paddingBottom: spacing.md,
    },
    backButton: {
        marginRight: spacing.md,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    heroCard: {
        padding: spacing.xl,
        borderRadius: 24,
        marginBottom: spacing.lg,
    },
    heroLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.xs,
    },
    heroAmount: {
        color: '#FFFFFF',
        fontSize: 42,
        fontWeight: '800',
        marginBottom: spacing.sm,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 8,
    },
    trendText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 4,
    },
    segmentContainer: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: 12,
        marginBottom: spacing.xl,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeSegment: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    segmentText: {
        fontSize: 13,
        fontWeight: '600',
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: spacing.md,
    },
    breakdownItem: {
        marginBottom: spacing.md,
    },
    breakdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    breakdownLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    breakdownAmount: {
        fontSize: 15,
        fontWeight: '700',
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        marginBottom: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    breakdownMeta: {
        fontSize: 12,
    },
    rankingsGrid: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    rankingCard: {
        flex: 1,
        padding: spacing.md,
        borderRadius: 16,
        alignItems: 'flex-start',
    },
    rankingLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: spacing.sm,
        marginBottom: 4,
    },
    rankingValue: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 2,
    },
    rankingSub: {
        fontSize: 12,
    },
});
