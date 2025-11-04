# Offer Form Wizard Implementation Summary

## Overview
Implemented a complete 6-step offer form wizard based on the rental application wizard pattern. The form captures all necessary information for property offers including KYC verification, financial details, offer terms, buyer's agent information, supporting documents, and digital signature/consent.

## File Structure Created

### Step Components (6 total)

#### 1. **offer-kyc-step.tsx** (`/components/steps/`)
- **Purpose**: Step 1 - KYC Verification
- **Required Fields**: fullName, phone, verifiedId (email auto-filled from cookies)
- **Features**:
  - Full legal name input
  - Email field (auto-filled from cookies, disabled)
  - Phone number input
  - ID document file upload (image/PDF)
  - Blue information banner about KYC verification

#### 2. **offer-financial-step.tsx** (`/components/steps/`)
- **Purpose**: Step 2 - Financial Details
- **Required Fields**: offerAmount, downPayment, depositAmount
- **Features**:
  - Auto-fills propertyAddress from API (`/properties/{listingKey}`)
  - Property address field (disabled, auto-filled)
  - Offer amount input (currency)
  - Down payment percentage input (0-100%)
  - Earnest money deposit amount input
  - Proof of funds file upload
  - Bank letter file upload
  - Live calculation display of down payment amount
  - Loading skeleton while fetching property data

#### 3. **offer-terms-step.tsx** (`/components/steps/`)
- **Purpose**: Step 3 - Offer Terms
- **Required Fields**: closingDatePreference, contingencies (array)
- **Features**:
  - Preferred closing date picker
  - Contingency checkboxes: Inspection, Financing, Appraisal
  - Display of selected contingencies
  - Blue information banner showing selected options

#### 4. **offer-agent-step.tsx** (`/components/steps/`)
- **Purpose**: Step 4 - Buyer's Agent Information
- **Required Fields**: None (all optional)
- **Features**:
  - Buyer's agent name input
  - Buyer's agent email input
  - Buyer's agent phone input
  - Special requests/comments textarea
  - Personal message to seller textarea
  - Gray information banner noting optional fields

#### 5. **offer-documents-step.tsx** (`/components/steps/`)
- **Purpose**: Step 5 - Supporting Documents
- **Required Fields**: None (all optional)
- **Features**:
  - Proof of income file upload (tax returns, W-2s, etc.)
  - ID verification file upload (backup)
  - Multiple additional supporting documents upload
  - File selection display with file names
  - Blue information banner about document requirements

#### 6. **offer-signature-step.tsx** (`/components/steps/`)
- **Purpose**: Step 6 - Signature & Consent
- **Required Fields**: digitalSignature, consentAcknowledged, legalConsent
- **Features**:
  - Digital signature input (type full name)
  - Consent checkbox for offer terms
  - Legal consent checkbox for information accuracy
  - Optional signature image upload
  - Yellow warning banner for offer review
  - Red legal notice banner about binding contract

### Main Wizard Component

#### **OfferFormWizard.tsx** (`/pages/`)
- **Purpose**: Main orchestrator for the 6-step offer form
- **Features**:
  - Multi-step navigation with Previous/Next buttons
  - Progress bar showing completion percentage
  - Real-time validation per step
  - Disabled Next button until all required fields filled
  - Form data management across all steps
  - Multi-step form validation configuration
  - Automatic listingKey population from URL params
  - Email auto-population from cookies
  - Token validation (redirects to login if no token)
  - File handling for 6 file fields + multiple additional documents
  - FormData submission to `/booking/create-offer` endpoint
  - Toast notifications for success/error
  - Redirect to home page on successful submission

## Validation Configuration

```typescript
const requiredFieldsByStep: Record<number, string[]> = {
  1: ["fullName", "phone", "verifiedId"], // Email required by API but auto-filled
  2: ["offerAmount", "downPayment", "depositAmount"],
  3: ["closingDatePreference", "contingencies"],
  4: [], // All optional
  5: [], // All optional
  6: ["digitalSignature", "consentAcknowledged", "legalConsent"],
}
```

## File Fields (Multipart Form)

- `verifiedId` - ID document (step 1)
- `proofOfFunds` - Proof of funds/pre-approval (step 2)
- `bankLetterUrl` - Bank letter (step 2)
- `proofOfIncomeUrl` - Tax returns/W-2s (step 5)
- `idVerificationUrl` - Backup ID (step 5)
- `additionalDocuments[]` - Multiple supporting docs (step 5)
- `signatureImage` - Signature image (step 6, optional)

## Form Data Structure (bodyData JSON)

```typescript
{
  userId: string,
  email: string, // Auto-filled from cookies
  fullName: string,
  phone: string,
  listingKey: string, // Auto-filled from URL params
  propertyAddress: string, // Auto-filled from API
  offerAmount: number,
  downPayment: number,
  depositAmount: number,
  closingDatePreference: string, // ISO date
  contingencies: string[], // ["Inspection", "Financing", "Appraisal"]
  buyersAgentName?: string,
  buyersAgentEmail?: string,
  buyersAgentPhone?: string,
  agentComments?: string,
  message?: string,
  digitalSignature: string,
  consentAcknowledged: boolean,
  isKycVerified: boolean // Set to false initially
}
```

## API Endpoints Used

1. **Auto-fill Property Data**
   - `GET /properties/{listingKey}`
   - Used in: offer-financial-step.tsx
   - Fetches: address for property display

2. **Submit Offer**
   - `POST /booking/create-offer`
   - Headers: `Content-Type: multipart/form-data`, Bearer token from interceptor
   - Body: FormData with files and JSON bodyData

## Design Features

- **Gradient Background**: Primary/accent colors with gradient overlay
- **Card-based Layout**: Consistent with rental-application-wizard
- **Step Icons**: Visual indicators (👤 💰 📋 🤝 📎 🖋️)
- **Color-coded Banners**:
  - Blue: Information/helpful context
  - Yellow: Warnings/review reminders
  - Red: Legal notices
  - Gray: Optional field notes
- **Form Fields**:
  - Auto-disabled fields with gray background (propertyAddress, email)
  - File input fields with selected file name display
  - Responsive grid layouts (1-2 columns)
  - Clear placeholder text and descriptions
- **Button States**:
  - Next disabled until all required fields filled
  - Submit disabled during loading or if validation fails
  - Previous disabled on first step
  - Submit shows loading spinner during submission

## Comparison with Rental Application Wizard

| Feature | Rental App | Offer Form |
|---------|-----------|-----------|
| Steps | 11 | 6 |
| Validation | Step-based required fields | Step-based required fields |
| Auto-fill Sources | Cookies, URL params, API | Cookies, URL params, API |
| File Fields | 5 | 6 (+ multiple additional) |
| Optional Steps | Step 11 | Steps 4, 5 |
| API Endpoint | `/booking/apply-for-rent` PUT | `/booking/create-offer` POST |

## Integration Notes

1. **Token Authentication**: Uses existing axios interceptor that injects JWT token to `x-internal-key` header
2. **Toast Notifications**: Uses existing `toastSuccess()` and `toastError()` utilities
3. **Routing**: Uses Next.js `useRouter()` for navigation and `useParams()` for URL parameters
4. **Component Library**: Uses existing shadcn/ui components (Input, Button, Card, Checkbox, etc.)
5. **API Client**: Uses existing axios instance from `@/lib/baseurl`

## Usage

The wizard is accessed via URL: `/make-offer/[id]` where `[id]` is the listing ID.

The form automatically:
1. Validates user is logged in
2. Populates listingKey from URL
3. Auto-fills email from cookies
4. Fetches property address from API
5. Prevents submission until all required fields are completed
6. Handles file uploads with multipart FormData
7. Redirects to home on successful submission

## Testing Checklist

- [ ] Navigate to `/make-offer/[listing-id]`
- [ ] Verify email is auto-filled and disabled
- [ ] Verify property address loads and is disabled
- [ ] Complete each step with validation
- [ ] Verify Next button disabled until required fields filled
- [ ] Submit form and verify success toast
- [ ] Check FormData structure in console
- [ ] Verify files are included in submission
- [ ] Test with missing required fields
- [ ] Test with invalid data (future date, negative amounts)
- [ ] Verify redirects on successful submission
