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
  storageUsage: number;
};

type MockDataState = {
  scans: ScanItem[];
  content: ContentItem[];
  extractedFields: ExtractedField[];
  processingSteps: ProcessingStep[];
  tags: string[];
  categories: string[];
  appStatus: AppStatus;
  toggleFavoriteTag: (tag: string) => void;
};

export const useMockDataStore = create<MockDataState>((set) => ({
  scans: mockScans,
  content: mockContentItems,
  extractedFields: mockExtractedFields,
  processingSteps: mockProcessingSteps,
  tags: mockTags,
  categories: mockCategories,
  appStatus: {
    syncStatus: 'syncing',
    pendingUploads: 3,
    storageUsage: 62,
  },
  toggleFavoriteTag: (tag: string) =>
    set((state) => {
      const exists = state.tags.includes(tag);
      return exists
        ? state
        : {
            ...state,
            tags: [...state.tags, tag],
          };
    }),
}));
