import dayjs from 'dayjs';
import { ContentItem, ExtractedField } from '@/data/mockData';

export type TimeRange = 7 | 30 | 90;

export type MonthlyStats = {
    currentTotal: number;
    previousTotal: number;
    percentChange: number;
    trend: 'up' | 'down' | 'neutral';
};

export type SpendingBreakdown = {
    label: string;
    amount: number;
    percentage: number;
    count: number;
};

export type RankingItem = {
    id: string;
    label: string;
    value: number;
    subLabel?: string;
};

// Helper to extract numeric amount from fields
export function extractAmount(fields: ExtractedField[]): number {
    const field = fields.find((f) => f.fieldId === 'total_amount');
    if (!field || !field.value) return 0;
    // Remove currency symbols and parse
    const cleanValue = field.value.replace(/[^0-9.-]+/g, '');
    return parseFloat(cleanValue) || 0;
}

// Helper to extract date from fields
export function extractDate(fields: ExtractedField[]): string | null {
    const field = fields.find((f) => f.fieldId === 'transaction_date');
    return field?.value || null;
}

// Helper to extract merchant name
export function extractMerchant(fields: ExtractedField[]): string {
    const field = fields.find((f) => f.fieldId === 'merchant_name');
    return field?.value || 'Unknown Merchant';
}

// Filter receipts by time range
export function filterByTimeRange(receipts: ContentItem[], days: TimeRange): ContentItem[] {
    const cutoffDate = dayjs().subtract(days, 'day');
    return receipts.filter((item) => {
        const dateStr = extractDate(item.fields);
        if (!dateStr) return false;
        return dayjs(dateStr).isAfter(cutoffDate);
    });
}

// Calculate monthly statistics
export function calculateMonthlyStats(receipts: ContentItem[]): MonthlyStats {
    const now = dayjs();
    const currentMonthStart = now.startOf('month');
    const previousMonthStart = now.subtract(1, 'month').startOf('month');
    const previousMonthEnd = now.subtract(1, 'month').endOf('month');

    let currentTotal = 0;
    let previousTotal = 0;

    receipts.forEach((item) => {
        const dateStr = extractDate(item.fields);
        if (!dateStr) return;

        const date = dayjs(dateStr);
        const amount = extractAmount(item.fields);

        if (date.isAfter(currentMonthStart)) {
            currentTotal += amount;
        } else if (date.isAfter(previousMonthStart) && date.isBefore(previousMonthEnd)) {
            previousTotal += amount;
        }
    });

    const percentChange = previousTotal === 0
        ? 0
        : ((currentTotal - previousTotal) / previousTotal) * 100;

    return {
        currentTotal,
        previousTotal,
        percentChange: Math.abs(percentChange),
        trend: percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral',
    };
}

// Group spending by merchant
export function groupByMerchant(receipts: ContentItem[]): SpendingBreakdown[] {
    const groups: Record<string, { amount: number; count: number }> = {};
    let totalAmount = 0;

    receipts.forEach((item) => {
        const merchant = extractMerchant(item.fields);
        const amount = extractAmount(item.fields);

        if (!groups[merchant]) {
            groups[merchant] = { amount: 0, count: 0 };
        }

        groups[merchant].amount += amount;
        groups[merchant].count += 1;
        totalAmount += amount;
    });

    return Object.entries(groups)
        .map(([label, data]) => ({
            label,
            amount: data.amount,
            count: data.count,
            percentage: totalAmount === 0 ? 0 : (data.amount / totalAmount) * 100,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5); // Top 5
}

// Get top rankings
export function getTopRankings(receipts: ContentItem[]) {
    // Highest transaction
    const highestTransaction = [...receipts].sort((a, b) => {
        return extractAmount(b.fields) - extractAmount(a.fields);
    })[0];

    // Most frequent merchant
    const merchantCounts: Record<string, number> = {};
    receipts.forEach((item) => {
        const merchant = extractMerchant(item.fields);
        merchantCounts[merchant] = (merchantCounts[merchant] || 0) + 1;
    });

    const frequentMerchant = Object.entries(merchantCounts)
        .sort(([, a], [, b]) => b - a)[0];

    return {
        highest: highestTransaction ? {
            label: extractMerchant(highestTransaction.fields),
            amount: extractAmount(highestTransaction.fields),
            date: extractDate(highestTransaction.fields),
        } : null,
        frequent: frequentMerchant ? {
            label: frequentMerchant[0],
            count: frequentMerchant[1],
        } : null,
    };
}
