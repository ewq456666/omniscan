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

type MockDataState = {
  scans: ScanItem[];
  content: ContentItem[];
  extractedFields: ExtractedField[];
  processingSteps: ProcessingStep[];
  tags: string[];
  categories: string[];
  appStatus: AppStatus;
  preferences: Preferences;
};

type MockDataActions = {
  setThemePreference: (theme: ThemePreference) => void;
  toggleAutoSync: () => void;
  toggleNotifications: () => void;
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
}));
