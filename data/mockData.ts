import { CategoryId } from './categoryDefinitions';

export type ScanItem = {
  id: string;
  thumbnailUri: string;
  originalUri: string;
  dateScanned: string;
  status: 'processing' | 'completed' | 'failed' | 'synced';
  title?: string;
  subtitle?: string;
  category?: CategoryId;
  tags?: string[];
};

export type ExtractedField = {
  id: string;
  fieldId: string;
  value: string;
  confidence: number;
  label?: string;
};

export type ContentItem = {
  id: string;
  scanId: string;
  category: CategoryId;
  title: string;
  dateCreated: string;
  updatedAt: string;
  thumbnailUri?: string;
  tags: string[];
  fields: ExtractedField[];
};

export type ProcessingStep = {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
  progress: number;
  description?: string;
};

export const mockScans: ScanItem[] = [
  {
    id: 'scan_1',
    thumbnailUri: 'https://picsum.photos/id/20/200/300',
    originalUri: 'https://picsum.photos/id/20/800/1200',
    dateScanned: '2023-10-25T14:30:00Z',
    status: 'completed',
    title: 'Starbucks Receipt',
    subtitle: 'Processed',
  },
  {
    id: 'scan_2',
    thumbnailUri: 'https://picsum.photos/id/24/200/300',
    originalUri: 'https://picsum.photos/id/24/800/1200',
    dateScanned: '2023-10-26T09:15:00Z',
    status: 'completed',
    title: 'Tech Corp Card',
    subtitle: 'Processed',
  },
  {
    id: 'scan_3',
    thumbnailUri: 'https://picsum.photos/id/42/200/300',
    originalUri: 'https://picsum.photos/id/42/800/1200',
    dateScanned: '2023-10-27T11:45:00Z',
    status: 'processing',
    title: 'Unknown Document',
    subtitle: 'Processing...',
  },
];

// Helper to create a receipt
const createReceipt = (id: string, merchant: string, amount: string, date: string, tags: string[] = []): ContentItem => ({
  id: `content_${id}`,
  scanId: `scan_${id}`,
  category: 'receipt',
  title: `${merchant} Receipt`,
  dateCreated: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  thumbnailUri: `https://picsum.photos/seed/${id}/200/300`,
  tags: ['expense', ...tags],
  fields: [
    { id: `f_${id}_1`, fieldId: 'merchant_name', value: merchant, confidence: 0.98, label: 'Merchant' },
    { id: `f_${id}_2`, fieldId: 'total_amount', value: amount, confidence: 0.99, label: 'Total' },
    { id: `f_${id}_3`, fieldId: 'transaction_date', value: date, confidence: 0.95, label: 'Date' },
    { id: `f_${id}_4`, fieldId: 'payment_method', value: 'Credit Card', confidence: 0.9, label: 'Payment' },
  ],
});

// Generate dates relative to now
const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const daysAgo = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return formatDate(d);
};

export const mockContentItems: ContentItem[] = [
  // Recent (Last 7 days)
  createReceipt('101', 'Starbucks', '$12.50', daysAgo(1), ['coffee', 'food']),
  createReceipt('102', 'Uber', '$24.00', daysAgo(2), ['transport']),
  createReceipt('103', 'Whole Foods', '$156.32', daysAgo(3), ['groceries']),
  createReceipt('104', 'Amazon', '$45.99', daysAgo(4), ['shopping']),
  createReceipt('105', 'Shell', '$52.00', daysAgo(5), ['gas', 'transport']),

  // Last 30 days
  createReceipt('106', 'Target', '$89.20', daysAgo(10), ['shopping', 'home']),
  createReceipt('107', 'Starbucks', '$8.75', daysAgo(12), ['coffee']),
  createReceipt('108', 'Uber Eats', '$32.50', daysAgo(15), ['food']),
  createReceipt('109', 'Netflix', '$15.99', daysAgo(18), ['subscription']),
  createReceipt('110', 'Whole Foods', '$124.50', daysAgo(20), ['groceries']),
  createReceipt('111', 'CVS', '$22.15', daysAgo(25), ['health']),

  // Last 90 days (Previous months)
  createReceipt('112', 'Best Buy', '$499.99', daysAgo(40), ['electronics', 'shopping']),
  createReceipt('113', 'Starbucks', '$14.20', daysAgo(42), ['coffee']),
  createReceipt('114', 'Delta Airlines', '$350.00', daysAgo(45), ['travel']),
  createReceipt('115', 'Uber', '$28.50', daysAgo(48), ['transport']),
  createReceipt('116', 'Trader Joes', '$85.40', daysAgo(55), ['groceries']),
  createReceipt('117', 'Apple Store', '$1200.00', daysAgo(60), ['electronics']),
  createReceipt('118', 'Spotify', '$9.99', daysAgo(65), ['subscription']),
  createReceipt('119', 'Shell', '$48.00', daysAgo(70), ['gas']),
  createReceipt('120', 'Home Depot', '$145.60', daysAgo(80), ['home']),

  // Business Card
  {
    id: 'content_2',
    scanId: 'scan_2',
    category: 'business_card',
    title: 'John Doe - Tech Corp',
    dateCreated: '2023-10-26T09:16:00Z',
    updatedAt: '2023-10-26T09:16:00Z',
    thumbnailUri: 'https://picsum.photos/id/24/200/300',
    tags: ['networking', 'tech'],
    fields: [
      { id: 'f_2_1', fieldId: 'full_name', value: 'John Doe', confidence: 0.99, label: 'Name' },
      { id: 'f_2_2', fieldId: 'company', value: 'Tech Corp', confidence: 0.95, label: 'Company' },
      { id: 'f_2_3', fieldId: 'title', value: 'Senior Developer', confidence: 0.9, label: 'Title' },
      { id: 'f_2_4', fieldId: 'email', value: 'john.doe@techcorp.com', confidence: 0.98, label: 'Email' },
      { id: 'f_2_5', fieldId: 'phone_number', value: '+1-555-0123', confidence: 0.96, label: 'Phone' },
    ],
  },
];

export const mockExtractedFields: ExtractedField[] = [
  ...mockContentItems.flatMap(item => item.fields)
];

export const mockProcessingSteps: ProcessingStep[] = [
  { id: 'step_1', label: 'Uploading image', status: 'completed', progress: 100 },
  { id: 'step_2', label: 'Analyzing layout', status: 'active', progress: 60 },
  { id: 'step_3', label: 'Extracting text', status: 'pending', progress: 0 },
  { id: 'step_4', label: 'Categorizing', status: 'pending', progress: 0 },
];

export const mockTags = [
  'receipt',
  'business_card',
  'expense',
  'travel',
  'food',
  'office',
  'personal',
  'urgent',
];

export const mockCategories: CategoryId[] = ['receipt', 'business_card'];
