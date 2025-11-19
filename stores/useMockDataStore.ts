import { create } from 'zustand';
import {
  ContentItem,
  ExtractedField,
  ProcessingStep,
  ScanItem,
  mockCategories,
  mockContentItems,
  mockExtractedFields,
  mockProcessingSteps,
  mockScans,
  mockTags,
} from '@/data/mockData';
import type { CategoryId } from '@/data/categoryDefinitions';

type AppStatus = {
  syncStatus: 'idle' | 'syncing' | 'error';
  pendingUploads: number;
};

export type ThemePreference = 'system' | 'light' | 'dark';
export type LocalePreference = 'system' | 'en' | 'zh-TW';

export type Preferences = {
  theme: ThemePreference;
  autoSync: boolean;
  notifications: boolean;
  locale: LocalePreference;
};

export type HomeModuleKey = 'hero' | 'quickActions' | 'processing' | 'recentScans' | 'adaptive';
export type AdaptivePanelType = 'tags' | 'pending';

type HomeLayout = {
  order: HomeModuleKey[];
  adaptivePanel: AdaptivePanelType;
};

type MockDataState = {
  scans: ScanItem[];
  content: ContentItem[];
  extractedFields: ExtractedField[];
  processingSteps: ProcessingStep[];
  tags: string[];
  categories: CategoryId[];
  appStatus: AppStatus;
  preferences: Preferences;
  homeLayout: HomeLayout;
  pinnedAnalytics: CategoryId[];
};

type MockDataActions = {
  setThemePreference: (theme: ThemePreference) => void;
  toggleAutoSync: () => void;
  toggleNotifications: () => void;
  setLocalePreference: (locale: LocalePreference) => void;
  setHomeModulesOrder: (order: HomeModuleKey[]) => void;
  setAdaptivePanelType: (panel: AdaptivePanelType) => void;
  toggleAnalyticsPin: (categoryId: CategoryId) => void;
};

export const useMockDataStore = create<MockDataState & MockDataActions>((set) => ({
  scans: mockScans,
  content: mockContentItems,
  extractedFields: mockExtractedFields,
  processingSteps: mockProcessingSteps,
  tags: mockTags,
  categories: mockCategories,
  appStatus: {
    syncStatus: 'syncing',
    pendingUploads: 3,
  },
  preferences: {
    theme: 'system',
    autoSync: true,
    notifications: false,
    locale: 'system',
  },
  homeLayout: {
    order: ['hero', 'quickActions', 'processing', 'recentScans', 'adaptive'],
    adaptivePanel: 'tags',
  },
  setThemePreference: (theme) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        theme,
      },
    })),
  toggleAutoSync: () =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        autoSync: !state.preferences.autoSync,
      },
    })),
  toggleNotifications: () =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        notifications: !state.preferences.notifications,
      },
    })),
  setLocalePreference: (locale) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        locale,
      },
    })),
  setHomeModulesOrder: (order) =>
    set((state) => ({
      homeLayout: {
        ...state.homeLayout,
        order,
      },
    })),
  setAdaptivePanelType: (panel) =>
    set((state) => ({
      homeLayout: {
        ...state.homeLayout,
        adaptivePanel: panel,
      },
    })),
  pinnedAnalytics: [],
  toggleAnalyticsPin: (categoryId) =>
    set((state) => {
      const isPinned = state.pinnedAnalytics.includes(categoryId);
      return {
        pinnedAnalytics: isPinned
          ? state.pinnedAnalytics.filter((id) => id !== categoryId)
          : [...state.pinnedAnalytics, categoryId],
      };
    }),
}));
