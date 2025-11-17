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

type AppStatus = {
  syncStatus: 'idle' | 'syncing' | 'error';
  pendingUploads: number;
};

export type ThemePreference = 'system' | 'light' | 'dark';

export type Preferences = {
  theme: ThemePreference;
  autoSync: boolean;
  notifications: boolean;
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
  categories: string[];
  appStatus: AppStatus;
  preferences: Preferences;
  homeLayout: HomeLayout;
};

type MockDataActions = {
  setThemePreference: (theme: ThemePreference) => void;
  toggleAutoSync: () => void;
  toggleNotifications: () => void;
  setHomeModulesOrder: (order: HomeModuleKey[]) => void;
  setAdaptivePanelType: (panel: AdaptivePanelType) => void;
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
}));
