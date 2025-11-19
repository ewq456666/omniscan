# Category Template & Extraction Spec

Last updated: 2025-11-18

## 1. Goals
- Define official OmniScan categories, each with a canonical field contract.
- Describe how the LLM/vision pipeline must format its response so the client can render the appropriate template.
- Provide validation rules so backend + app can reject incomplete payloads and route items into the Pending flow when required fields are missing.

## 2. Category Definitions

> Add new rows by extending this table and updating the schema below.

| Category ID      | Label Key                 | Required Fields                                            | Optional Fields                                   | Template Component       |
|------------------|---------------------------|------------------------------------------------------------|---------------------------------------------------|--------------------------|
| `receipt`        | `categories.receipt`      | `merchant_name`, `total_amount`, `transaction_date`        | `tax_amount`, `payment_method`, `notes`, `items`  | `ReceiptTemplate`        |
| `business_card`  | `categories.businessCard` | `full_name`, `company`, `title`, `email`, `phone_number`   | `website`, `address`, `notes`                     | `BusinessCardTemplate`   |

### 2.1 Field Specification

```ts
type FieldSpec = {
  id: string;                // canonical key returned by the LLM
  labelKey: string;          // i18n key for UI labels
  type: 'string' | 'number' | 'date' | 'currency' | 'email' | 'phone' | 'url';
  editable: boolean;
  required: boolean;
  format?: {
    currency?: 'USD' | 'TWD' | 'custom';
    datePattern?: 'YYYY-MM-DD' | 'ISO8601';
  };
};
```

Maintain these specs in a single source (`data/categoryDefinitions.ts` or backend config). The UI template and server validation both consume this structure.

## 3. LLM Response Contract

Every successful extraction must return JSON shaped as follows:

```jsonc
{
  "scanId": "scan-123",
  "category": "receipt",
  "categoryConfidence": 0.93,
  "fields": [
    { "id": "merchant_name", "value": "Acme Corp.", "confidence": 0.96 },
    { "id": "total_amount", "value": "124.20", "confidence": 0.88, "currency": "USD" },
    { "id": "transaction_date", "value": "2025-06-01", "confidence": 0.92 },
    { "id": "tax_amount", "value": "10.30", "confidence": 0.72 },
    { "id": "payment_method", "value": "Visa **** 4242", "confidence": 0.74 },
    { "id": "notes", "value": "Business lunch", "confidence": 0.42 }
  ],
  "extras": {
    "thumbnailUrl": "https://cdn.omniscan.app/scan-123-thumb.jpg",
    "tableRows": [
      { "description": "Meal", "amount": "110.00" },
      { "description": "Tip", "amount": "14.20" }
    ]
  },
  "processingDiagnostics": {
    "modelVersion": "vision-qa-2.1",
    "latencyMs": 2150,
    "warnings": []
  }
}
```

### Contract Rules
1. **Required coverage** — For the returned `category`, all `requiredFields` must be present in `fields`. If the value cannot be determined, return the field with `"value": null` and `"confidence": 0` so the client can prompt the user.
2. **Additional fields welcome** — The model may return extra fields (not listed in the category spec). They will be shown in an “Additional Details” section.
3. **Category mismatch** — If the classifier is unsure, set `categoryConfidence < 0.7` and include `candidateCategories: [{ id, confidence }]`. The client can prompt the user to reclassify.
4. **Formatting** — Dates must be ISO strings (`YYYY-MM-DD` or full ISO8601). Currency values should be raw numbers as strings plus an optional `currency` code.

## 4. Validation Pipeline

1. **Backend sanity check**
   - Lookup the category definition.
   - Verify every required field exists.
   - Normalize types (dates → ISO, numbers → decimals).
   - If validation fails, mark the scan as `needs_review` and include the missing field IDs in the payload.

2. **Client store update**
   - Update the `Scan` (`status: 'synced'`, link `contentId`).
   - Insert/merge a `Content` record with fields grouped by category definition.
   - If missing required fields, surface warnings in the template and keep the entry in Pending until the user completes them.

3. **Template rendering**
   - Each template component receives `{ content, categoryDefinition }`.
   - Use `categoryDefinition.presentation.sections` to lay out data consistently.
   - Optional fields render only when present.

## 5. Template Configuration Example

```ts
export const categoryDefinitions: Record<CategoryId, CategoryDefinition> = {
  receipt: {
    id: 'receipt',
    label: 'categories.receipt',
    requiredFields: [
      { id: 'merchant_name', labelKey: 'fields.merchant', type: 'string', editable: true, required: true },
      { id: 'total_amount', labelKey: 'fields.total', type: 'currency', editable: false, required: true, format: { currency: 'USD' } },
      { id: 'transaction_date', labelKey: 'fields.date', type: 'date', editable: true, required: true, format: { datePattern: 'YYYY-MM-DD' } }
    ],
    optionalFields: [
      { id: 'tax_amount', labelKey: 'fields.tax', type: 'currency', editable: true, required: false },
      { id: 'payment_method', labelKey: 'fields.paymentMethod', type: 'string', editable: true, required: false }
    ],
    presentation: {
      component: 'ReceiptTemplate',
      sections: [
        { titleKey: 'receipt.section.summary', fieldIds: ['merchant_name', 'transaction_date', 'total_amount'] },
        { titleKey: 'receipt.section.payment', fieldIds: ['payment_method', 'tax_amount'] }
      ]
    }
  },
  business_card: {
    id: 'business_card',
    label: 'categories.businessCard',
    requiredFields: [
      { id: 'full_name', labelKey: 'fields.fullName', type: 'string', editable: true, required: true },
      { id: 'company', labelKey: 'fields.company', type: 'string', editable: true, required: true },
      { id: 'title', labelKey: 'fields.title', type: 'string', editable: true, required: true },
      { id: 'email', labelKey: 'fields.email', type: 'email', editable: true, required: true },
      { id: 'phone_number', labelKey: 'fields.phone', type: 'phone', editable: true, required: true }
    ],
    optionalFields: [
      { id: 'website', labelKey: 'fields.website', type: 'url', editable: true, required: false },
      { id: 'address', labelKey: 'fields.address', type: 'string', editable: true, required: false },
      { id: 'notes', labelKey: 'fields.notes', type: 'string', editable: true, required: false }
    ],
    presentation: {
      component: 'BusinessCardTemplate',
      sections: [
        { titleKey: 'businessCard.section.identity', fieldIds: ['full_name', 'title', 'company'] },
        { titleKey: 'businessCard.section.contact', fieldIds: ['email', 'phone_number', 'website', 'address'] }
      ]
    }
  }
};
```

## 6. Implementation Checklist
1. **Backend**
   - Host the category definitions (JSON, DB table, or config service).
   - Validate LLM output before persisting.
   - Attach missing-field info to the Scan to drive Pending UI.
2. **LLM Prompt**
   - Embed the schema + required field list in system instructions.
   - Enforce JSON schema (use `response_format: json_schema` if available).
3. **Client**
   - Add utilities to load `categoryDefinitions` (compile-time or fetch once).
   - Build template components per `TemplateConfig`.
   - Update Pending flow to highlight missing required fields.
4. **Docs**
   - When adding a category, update:
     - `doc/category_templates.md`
     - Localization entries for labels/sections
     - Store/type definitions

By centralizing the contract here, we can evolve categories confidently and keep the LLM, backend, and client in sync.
