export type CategoryId = 'receipt' | 'business_card';

export type FieldType = 'string' | 'number' | 'date' | 'currency' | 'email' | 'phone' | 'url';

export type FieldSpec = {
  id: string;
  labelKey: string;
  type: FieldType;
  editable: boolean;
  required: boolean;
  format?: {
    currency?: string;
    datePattern?: 'YYYY-MM-DD' | 'ISO8601';
  };
};

export type TemplateSection = {
  titleKey: string;
  fieldIds: string[];
};

export type TemplateConfig = {
  component: 'ReceiptTemplate' | 'BusinessCardTemplate';
  sections: TemplateSection[];
};

export type CategoryDefinition = {
  id: CategoryId;
  label: string;
  requiredFields: FieldSpec[];
  optionalFields?: FieldSpec[];
  presentation: TemplateConfig;
  analytics?: {
    enabled: boolean;
  };
};

export const categoryDefinitions: Record<CategoryId, CategoryDefinition> = {
  receipt: {
    id: 'receipt',
    label: 'categories.receipt',
    requiredFields: [
      { id: 'merchant_name', labelKey: 'fields.merchant', type: 'string', editable: true, required: true },
      {
        id: 'total_amount',
        labelKey: 'fields.total',
        type: 'currency',
        editable: false,
        required: true,
        format: { currency: 'USD' },
      },
      {
        id: 'transaction_date',
        labelKey: 'fields.date',
        type: 'date',
        editable: true,
        required: true,
        format: { datePattern: 'YYYY-MM-DD' },
      },
    ],
    optionalFields: [
      { id: 'tax_amount', labelKey: 'fields.tax', type: 'currency', editable: true, required: false },
      { id: 'payment_method', labelKey: 'fields.paymentMethod', type: 'string', editable: true, required: false },
      { id: 'notes', labelKey: 'fields.notes', type: 'string', editable: true, required: false },
      { id: 'items', labelKey: 'fields.items', type: 'string', editable: false, required: false },
    ],
    presentation: {
      component: 'ReceiptTemplate',
      sections: [
        { titleKey: 'receipt.section.summary', fieldIds: ['merchant_name', 'transaction_date', 'total_amount'] },
        { titleKey: 'receipt.section.payment', fieldIds: ['payment_method', 'tax_amount', 'notes'] },
      ],
    },
    analytics: {
      enabled: true,
    },
  },
  business_card: {
    id: 'business_card',
    label: 'categories.businessCard',
    requiredFields: [
      { id: 'full_name', labelKey: 'fields.fullName', type: 'string', editable: true, required: true },
      { id: 'company', labelKey: 'fields.company', type: 'string', editable: true, required: true },
      { id: 'title', labelKey: 'fields.title', type: 'string', editable: true, required: true },
      { id: 'email', labelKey: 'fields.email', type: 'email', editable: true, required: true },
      { id: 'phone_number', labelKey: 'fields.phone', type: 'phone', editable: true, required: true },
    ],
    optionalFields: [
      { id: 'website', labelKey: 'fields.website', type: 'url', editable: true, required: false },
      { id: 'address', labelKey: 'fields.address', type: 'string', editable: true, required: false },
      { id: 'notes', labelKey: 'fields.notes', type: 'string', editable: true, required: false },
    ],
    presentation: {
      component: 'BusinessCardTemplate',
      sections: [
        { titleKey: 'businessCard.section.identity', fieldIds: ['full_name', 'title', 'company'] },
        { titleKey: 'businessCard.section.contact', fieldIds: ['email', 'phone_number', 'website', 'address'] },
      ],
    },
  },
};

export const getCategoryDefinition = (category: CategoryId): CategoryDefinition => categoryDefinitions[category];

export const supportedCategories = Object.keys(categoryDefinitions) as CategoryId[];
