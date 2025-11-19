import React, { useMemo } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    ToastAndroid,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { spacing } from '@/theme/spacing';
import { useMockDataStore } from '@/stores/useMockDataStore';
import { categoryDefinitions, CategoryId } from '@/data/categoryDefinitions';
import { hasAnalytics, getAnalyticsRoute } from '@/components/analytics/registry';

export function AnalyticsHubScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { t } = useTranslation();
    const content = useMockDataStore((state) => state.content);
    const pinnedAnalytics = useMockDataStore((state) => state.pinnedAnalytics);
    const toggleAnalyticsPin = useMockDataStore((state) => state.toggleAnalyticsPin);

    // Get categories that have analytics enabled AND have data
    const availableAnalytics = useMemo(() => {
        const categoriesWithData = new Set(content.map((item) => item.category));

        return Object.values(categoryDefinitions)
            .filter((def) => {
                const hasEnabledAnalytics = def.analytics?.enabled && hasAnalytics(def.id);
                const hasData = categoriesWithData.has(def.id);
                return hasEnabledAnalytics && hasData;
            })
            .map((def) => ({
                ...def,
                count: content.filter((item) => item.category === def.id).length,
                isPinned: pinnedAnalytics.includes(def.id),
            }));
    }, [content, pinnedAnalytics]);

    const handlePinToggle = (categoryId: CategoryId, isPinned: boolean) => {
        toggleAnalyticsPin(categoryId);
        const message = isPinned
            ? t('analytics.unpinnedFromHome', { defaultValue: 'Unpinned from Home' })
            : t('analytics.pinnedToHome', { defaultValue: 'Pinned to Home' });

        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            // Fallback for iOS if needed, or just silent update
            // Alert.alert('Updated', message);
        }
    };

    const handlePressCategory = (categoryId: CategoryId) => {
        const route = getAnalyticsRoute(categoryId);
        if (route) {
            router.push(route as any);
        }
    };

    const renderItem = ({ item }: { item: typeof availableAnalytics[0] }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => handlePressCategory(item.id)}
        >
            <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: colors.surfaceAlt }]}>
                    <MaterialCommunityIcons name="chart-bar" size={24} color={colors.primary} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                        {t(item.label)}
                    </Text>
                    <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                        {t('analytics.itemCount', { count: item.count, defaultValue: '{{count}} items' })}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.pinButton}
                    onPress={() => handlePinToggle(item.id, item.isPinned)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <MaterialCommunityIcons
                        name={item.isPinned ? 'star' : 'star-outline'}
                        size={24}
                        color={item.isPinned ? colors.primary : colors.textMuted}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>
                    {t('analytics.title', { defaultValue: 'Analytics' })}
                </Text>
            </View>

            <FlatList
                data={availableAnalytics}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons
                            name="chart-line-variant"
                            size={64}
                            color={colors.textMuted}
                            style={{ opacity: 0.5 }}
                        />
                        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                            {t('analytics.noData', { defaultValue: 'No analytics available yet' })}
                        </Text>
                        <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                            {t('analytics.startScanning', { defaultValue: 'Scan receipts to see insights here' })}
                        </Text>
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
    listContent: {
        padding: spacing.lg,
    },
    card: {
        borderRadius: 16,
        marginBottom: spacing.md,
        padding: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 14,
    },
    pinButton: {
        padding: spacing.sm,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: spacing.xxl * 2,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
    },
});
