# Offer Form Wizard - Quick Reference

## Components Created

```
src/
├── pages/
│   └── OfferFormWizard.tsx (MAIN - 6-step wizard orchestrator)
│
└── components/steps/
    ├── offer-kyc-step.tsx (Step 1)
    ├── offer-financial-step.tsx (Step 2)
    ├── offer-terms-step.tsx (Step 3)
    ├── offer-agent-step.tsx (Step 4)
    ├── offer-documents-step.tsx (Step 5)
    └── offer-signature-step.tsx (Step 6)
```

## Step Details

### Step 1: KYC Verification (offer-kyc-step.tsx)
**Required Fields**: fullName, phone, verifiedId
```
- Full Legal Name (required, text input)
- Email (auto-filled from cookies, disabled)
- Phone Number (required, tel input)
- ID Document Upload (required, file input)
```

### Step 2: Financial Details (offer-financial-step.tsx)
**Required Fields**: offerAmount, downPayment, depositAmount
```
- Property Address (auto-filled from API, disabled)
- Offer Amount (required, USD currency)
- Down Payment % (required, 0-100%)
- Earnest Money Deposit (required, USD currency)
- Proof of Funds (optional, file upload)
- Bank Letter (optional, file upload)
- Live Down Payment Calculation Display
```

### Step 3: Offer Terms (offer-terms-step.tsx)
**Required Fields**: closingDatePreference, contingencies
```
- Preferred Closing Date (required, date picker)
- Contingencies (required, checkboxes):
  - Inspection Contingency
  - Financing Contingency
  - Appraisal Contingency
- Selected Contingencies Display
```

### Step 4: Buyer's Agent (offer-agent-step.tsx)
**Required Fields**: None (all optional)
```
- Buyer's Agent Name (optional, text)
- Buyer's Agent Email (optional, email)
- Buyer's Agent Phone (optional, tel)
- Special Requests/Comments (optional, textarea)
- Personal Message to Seller (optional, textarea)
```

### Step 5: Supporting Documents (offer-documents-step.tsx)
**Required Fields**: None (all optional)
```
- Proof of Income (optional, file upload)
  - Tax returns, W-2s, income statements
- ID Verification (optional, file upload)
  - Driver's license or passport backup
- Additional Documents (optional, multiple file upload)
```

### Step 6: Signature & Consent (offer-signature-step.tsx)
**Required Fields**: digitalSignature, consentAcknowledged, legalConsent
```
- Digital Signature (required, full name typed)
- Consent to Terms (required, checkbox)
- Legal Accuracy Certification (required, checkbox)
- Signature Image (optional, file upload)
- Legal Notice Display
```

## Form State Structure

```typescript
formData = {
  // Auto-populated
  userId: string,
  email: string,
  listingKey: string,
  propertyAddress: string,
  
  // Step 1
  fullName: string,
  phone: string,
  verifiedId: File,
  
  // Step 2
  offerAmount: number,
  downPayment: number,
  depositAmount: number,
  proofOfFunds?: File,
  bankLetterUrl?: File,
  
  // Step 3
  closingDatePreference: string,
  contingencies: string[],
  
  // Step 4
  buyersAgentName?: string,
  buyersAgentEmail?: string,
  buyersAgentPhone?: string,
  agentComments?: string,
  message?: string,
  
  // Step 5
  proofOfIncomeUrl?: File,
  idVerificationUrl?: File,
  additionalDocuments?: File[],
  
  // Step 6
  digitalSignature: string,
  consentAcknowledged: boolean,
  legalConsent: boolean,
  signatureImage?: File,
  
  // Validation flags
  isKycVerified: false,
}
```

## Key Features

### ✅ Auto-fill Logic
- **Email**: From cookies, auto-populated and disabled in step 1
- **ListingKey**: From URL params (`/make-offer/[id]`)
- **Property Address**: From API endpoint `/properties/{listingKey}`, auto-populated and disabled in step 2

### ✅ Validation Rules
- Each step validates all required fields
- Next button disabled until current step is complete
- Arrays (contingencies) must have at least 1 item
- Files must be File instances
- Form cannot be submitted if any step has invalid data

### ✅ File Handling
6 file fields that are submitted as FormData:
1. `verifiedId` - ID document
2. `proofOfFunds` - Proof of funds
3. `bankLetterUrl` - Bank letter
4. `proofOfIncomeUrl` - Income proof
5. `idVerificationUrl` - ID backup
6. `additionalDocuments[]` - Multiple supporting docs
7. `signatureImage` - Signature image (optional)

### ✅ API Integration
- **Property Data**: `GET /properties/{listingKey}`
- **Submit Offer**: `POST /booking/create-offer`
- **Auth**: Bearer token injected via axios interceptor to `x-internal-key`

### ✅ User Experience
- Progress bar showing completion %
- Step icons and titles
- Real-time validation feedback
- Loading states with spinners
- Toast notifications for success/error
- Color-coded information banners
- Form auto-saves to state as you type
- Go back and edit previous steps

## Usage Example

```tsx
// Route: /make-offer/[id]
// The id is automatically captured from URL params
// Email is auto-filled from cookies
// Property address loads from API

// User Flow:
1. Load page → auto-fills email & property address
2. Enter KYC details → Next enabled
3. Enter financial details → Next enabled
4. Select contingencies → Next enabled
5. (Optional) Enter agent details
6. (Optional) Upload supporting docs
7. Enter signature & accept terms → Submit enabled
8. Click Submit → FormData sent to API
9. Success → Redirect to home, show toast
```

## Error Handling

### Validation Errors
- "Please fill all required fields" - missing data in current step
- "Please log in" - no auth token, redirects to login

### API Errors
- Network errors caught and displayed
- Server errors show toast notification
- Detailed errors logged to console

## Styling

- **Background**: Gradient (primary → accent)
- **Card**: Standard shadcn card with header/content
- **Buttons**: Primary for submit, outline for previous
- **Inputs**: Full width, disabled fields have gray background
- **Banners**: 
  - Blue (`bg-blue-50`) - Information
  - Yellow (`bg-yellow-50`) - Warnings
  - Red (`bg-red-50`) - Legal notices
  - Gray (`bg-gray-50`) - Optional info
- **Icons**: lucide-react (ChevronLeft, ChevronRight, Loader, etc.)

## Browser Compatibility

- File uploads: All modern browsers
- FormData API: All modern browsers
- Date inputs: All modern browsers
- File types: image/* and .pdf supported

## Performance Notes

- Property data fetched once per component mount
- FormData kept in state (not localStorage)
- useRef prevents infinite re-renders on property fetch
- No external API calls except property data fetch
