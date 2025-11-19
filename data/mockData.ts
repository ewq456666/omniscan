export type ScanType = 'business_card' | 'receipt' | 'note' | 'document';

export interface ExtractedField {
  id: string;
  fieldId: string;
  label: string;
  value: string | null;
  confidence: number;
  editable?: boolean;
  metadata?: Record<string, unknown>;
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
  category: 'receipt' | 'business_card';
  updatedAt: string;
  tags: string[];
  thumbnail: string;
  fields: ExtractedField[];
}

export const mockScans: ScanItem[] = [
  {
    id: 'scan-1',
    title: 'Acme Corp. Receipt',
    subtitle: 'Total: $124.20 – NYC Store',
    timestamp: '2024-06-01T09:32:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=200&q=60',
    tags: ['Receipt', 'Finance'],
    status: 'synced',
    type: 'receipt',
  },
  {
    id: 'scan-2',
    title: 'Business Card – Jane Doe',
    subtitle: 'Product Design Lead, Nova Labs',
    timestamp: '2024-05-22T14:10:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=60',
    tags: ['Contact', 'Networking'],
    status: 'processing',
    type: 'business_card',
  },
  {
    id: 'scan-3',
    title: 'Handwritten Notes',
    subtitle: 'Product Strategy Brainstorm',
    timestamp: '2024-05-18T17:45:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200&q=60',
    tags: ['Note', 'Ideas'],
    status: 'synced',
    type: 'note',
  },
];

export const mockExtractedFields: ExtractedField[] = [
  {
    id: 'field-1',
    fieldId: 'merchant_name',
    label: 'Merchant',
    value: 'Acme Corp.',
    confidence: 0.96,
  },
  {
    id: 'field-2',
    fieldId: 'total_amount',
    label: 'Total',
    value: '124.20',
    confidence: 0.88,
    metadata: { currency: 'USD' },
  },
  {
    id: 'field-3',
    fieldId: 'transaction_date',
    label: 'Date',
    value: '2024-06-01',
    confidence: 0.92,
  },
  {
    id: 'field-4',
    fieldId: 'payment_method',
    label: 'Payment Method',
    value: 'Visa **** 4242',
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
    category: 'receipt',
    updatedAt: '2024-05-20T12:30:00Z',
    tags: ['Receipt', 'Reimbursement'],
    thumbnail: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=200&q=60',
    fields: mockExtractedFields,
  },
  {
    id: 'content-2',
    title: 'Conference Contacts',
    category: 'business_card',
    updatedAt: '2024-05-12T09:15:00Z',
    tags: ['Business Card', 'Follow-up'],
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=200&q=60',
    fields: [
      {
        id: 'field-5',
        fieldId: 'full_name',
        label: 'Name',
        value: 'Jane Doe',
        confidence: 0.99,
      },
      {
        id: 'field-6',
        fieldId: 'email',
        label: 'Email',
        value: 'jane.doe@example.com',
        confidence: 0.93,
      },
      {
        id: 'field-7',
        fieldId: 'company',
        label: 'Company',
        value: 'Nova Labs',
        confidence: 0.85,
      },
      {
        id: 'field-8',
        fieldId: 'phone_number',
        label: 'Phone',
        value: '+1 (555) 123-4567',
        confidence: 0.9,
      },
    ],
  },
];

export const mockTags = ['Finance', 'Personal', 'Important', 'Follow-up', 'Archive'];
export const mockCategories: Array<'receipt' | 'business_card'> = ['receipt', 'business_card'];
