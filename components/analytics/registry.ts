import { CategoryId } from '@/data/categoryDefinitions';

/**
 * Registry mapping category IDs to their analytics screen routes.
 * Only categories with enabled analytics should be listed here.
 */
export const analyticsRegistry: Partial<Record<CategoryId, string>> = {
    receipt: '/receipt-analytics',
    // Future categories can be added here
    // invoice: '/invoice-analytics',
};

/**
 * Gets the analytics route for a specific category.
 * Returns undefined if the category does not have analytics.
 */
export function getAnalyticsRoute(categoryId: CategoryId): string | undefined {
    return analyticsRegistry[categoryId];
}

/**
 * Checks if a category has an analytics implementation.
 */
export function hasAnalytics(categoryId: CategoryId): boolean {
    return !!analyticsRegistry[categoryId];
}
