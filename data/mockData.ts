export type ScanType = 'Business Card' | 'Receipt' | 'Note' | 'Document';

export interface ExtractedField {
  id: string;
  label: string;
  value: string;
  confidence: number;
  editable?: boolean;
}

export interface ScanItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  thumbnail: string;
  tags: string[];
  status: 'synced' | 'processing' | 'error';
  type: ScanType;
}

export interface ProcessingStep {
  id: string;
  label: string;
  progress: number;
  description: string;
}

export interface ContentItem {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
  tags: string[];
  thumbnail: string;
  fields: ExtractedField[];
}

export const mockScans: ScanItem[] = [
  {
    id: 'scan-1',
    title: 'Acme Corp. Receipt',
    subtitle: 'Total: $124.20 · NYC Store',
    timestamp: '2024-06-01T09:32:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=200&q=60',
    tags: ['Receipt', 'Finance'],
    status: 'synced',
    type: 'Receipt',
  },
  {
    id: 'scan-2',
    title: 'Business Card · Jane Doe',
    subtitle: 'Product Design Lead, Nova Labs',
    timestamp: '2024-05-22T14:10:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=60',
    tags: ['Contact', 'Networking'],
    status: 'processing',
    type: 'Business Card',
  },
  {
    id: 'scan-3',
    title: 'Handwritten Notes',
    subtitle: 'Product Strategy Brainstorm',
    timestamp: '2024-05-18T17:45:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200&q=60',
    tags: ['Note', 'Ideas'],
    status: 'synced',
    type: 'Note',
  },
];

export const mockExtractedFields: ExtractedField[] = [
  {
    id: 'field-1',
    label: 'Merchant',
    value: 'Acme Corp.',
    confidence: 0.96,
  },
  {
    id: 'field-2',
    label: 'Total',
    value: '$124.20',
    confidence: 0.88,
  },
  {
    id: 'field-3',
    label: 'Date',
    value: 'June 1, 2024',
    confidence: 0.92,
  },
  {
    id: 'field-4',
    label: 'Payment Method',
    value: 'Visa •••• 4242',
    confidence: 0.74,
  },
];

export const mockProcessingSteps: ProcessingStep[] = [
  {
    id: 'step-1',
    label: 'Uploading',
    progress: 1,
    description: 'Upload complete',
  },
  {
    id: 'step-2',
    label: 'Enhancing Image',
    progress: 0.8,
    description: 'Applying clarity and noise reduction',
  },
  {
    id: 'step-3',
    label: 'Extracting Data',
    progress: 0.45,
    description: 'Detecting text and table regions',
  },
];

export const mockContentItems: ContentItem[] = [
  {
    id: 'content-1',
    title: 'Q1 Expense Report',
    category: 'Finance',
    updatedAt: '2024-05-20T12:30:00Z',
    tags: ['Receipt', 'Reimbursement'],
    thumbnail: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=200&q=60',
    fields: mockExtractedFields,
  },
  {
    id: 'content-2',
    title: 'Conference Contacts',
    category: 'Networking',
    updatedAt: '2024-05-12T09:15:00Z',
    tags: ['Business Card', 'Follow-up'],
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=200&q=60',
    fields: [
      {
        id: 'field-5',
        label: 'Name',
        value: 'Jane Doe',
        confidence: 0.99,
      },
      {
        id: 'field-6',
        label: 'Email',
        value: 'jane.doe@example.com',
        confidence: 0.93,
      },
      {
        id: 'field-7',
        label: 'Company',
        value: 'Nova Labs',
        confidence: 0.85,
      },
    ],
  },
];

export const mockTags = ['Finance', 'Personal', 'Important', 'Follow-up', 'Archive'];
export const mockCategories = ['All', 'Receipts', 'Business Cards', 'Notes', 'Documents'];
