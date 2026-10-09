import { z } from 'zod';

/**
 * CarMatrix — Dealer Intel™ Zod Validation Schemas
 * Enforces rigorous server-side validation for all inputs to ensure data integrity,
 * prevent malformed records, and protect against injection / malicious payloads.
 */

// Phone number regex (US formats: (XXX) XXX-XXXX, XXX-XXX-XXXX, or 10-11 digits)
const phoneRegex = /^(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
// Standard US 5-digit or 9-digit ZIP regex
const zipRegex = /^\d{5}(-\d{4})?$/;
// URL slug regex (lowercase alphanumeric and hyphens only)
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * 1. DEALERSHIP QUERY & FILTER VALIDATION SCHEMA
 */
export const DealerSearchSchema = z.object({
  query: z.string().trim().max(100).optional(),
  brand: z.string().trim().max(50).optional(),
  city: z.string().trim().max(50).optional(),
  state: z.string().trim().length(2).default('TX').optional(),
  market: z.string().trim().max(50).default('DFW').optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  minTransparencyScore: z.coerce.number().min(0).max(100).optional(),
  dealershipType: z.enum(['new', 'used', 'both']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['rating', 'transparency', 'reviews', 'name']).default('rating'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export type DealerSearchParamsInput = z.input<typeof DealerSearchSchema>;

/**
 * 2. DEALERSHIP CREATION & UPDATE SCHEMA (Admin / Ingestion)
 */
export const DealershipSchema = z.object({
  name: z.string().trim().min(2, 'Dealership name must be at least 2 characters').max(150),
  normalized_name: z.string().trim().min(2).max(150).optional(),
  aliases: z.array(z.string().trim().max(150)).default([]),
  slug: z.string().trim().regex(slugRegex, 'Slug must contain only lowercase letters, numbers, and single hyphens'),
  street_address: z.string().trim().min(3).max(200),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().length(2).toUpperCase().default('TX'),
  zip_code: z.string().trim().regex(zipRegex, 'Valid 5-digit US ZIP code is required'),
  market: z.string().trim().default('DFW'),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  website: z.string().trim().url('Must be a valid website URL').nullable().optional(),
  phone: z.string().trim().regex(phoneRegex, 'Must be a valid US phone number').nullable().optional(),
  dealer_group: z.string().trim().max(150).nullable().optional(),
  brands: z.array(z.string().trim().max(50)).default([]),
  dealership_type: z.enum(['new', 'used', 'both']).default('both'),
  is_active: z.boolean().default(true)
});

export type DealershipInput = z.infer<typeof DealershipSchema>;

/**
 * 3. MANDATORY ADD-ON ITEM SCHEMA
 */
export const MandatoryAddonItemSchema = z.object({
  name: z.string().trim().min(1, 'Add-on name cannot be empty').max(100),
  amount: z.number().min(0, 'Add-on price cannot be negative').max(50000)
});

/**
 * 4. REVIEW SUBMISSION SCHEMA
 */
export const CreateReviewSchema = z.object({
  dealership_id: z.string().uuid('Valid dealership ID is required'),
  reviewer_display_name: z.string().trim().min(2).max(100).default('Verified Buyer'),
  reviewer_city: z.string().trim().max(100).optional(),
  reviewer_state: z.string().trim().length(2).toUpperCase().optional(),

  // Ratings
  overall_rating: z.number().int().min(1, 'Overall rating must be between 1 and 5').max(5),
  pricing_transparency_rating: z.number().int().min(1).max(5).optional(),
  sales_pressure_rating: z.number().int().min(1).max(5).optional(),
  financing_integrity_rating: z.number().int().min(1).max(5).optional(),
  service_speed_rating: z.number().int().min(1).max(5).optional(),

  // Content
  title: z.string().trim().min(3, 'Review title must be at least 3 characters').max(150),
  review_body: z.string().trim().min(20, 'Please provide detailed feedback (at least 20 characters)').max(5000),
  advice_for_other_buyers: z.string().trim().max(1000).optional(),

  // Particulars
  experience_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  experience_type: z.enum(['purchased', 'attempted_purchase', 'service_visit', 'other']),
  vehicle_year: z.number().int().min(1990).max(new Date().getFullYear() + 2).optional(),
  vehicle_make: z.string().trim().max(50).optional(),
  vehicle_model: z.string().trim().max(50).optional(),
  salesperson_name: z.string().trim().max(100).optional(),

  // Protection Indicators
  would_recommend: z.boolean(),
  advertised_price_honored: z.boolean().optional(),
  reported_doc_fee: z.number().min(0).max(5000).optional(),
  mandatory_addons_reported: z.boolean().default(false),
  reported_addons: z.array(MandatoryAddonItemSchema).default([]),
  financing_terms_changed: z.boolean().default(false),
  trade_in_lowball_reported: z.boolean().default(false),

  // Associated Tag Slugs
  tag_slugs: z.array(z.string().trim().max(50)).default([])
}).refine(data => {
  // Experience date cannot be in the future
  const expDate = new Date(data.experience_date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return expDate <= tomorrow;
}, {
  message: 'Experience date cannot be in the future',
  path: ['experience_date']
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;

/**
 * 5. REVIEW QUERY / FILTER SCHEMA
 */
export const ReviewSearchSchema = z.object({
  dealershipId: z.string().uuid(),
  experienceType: z.enum(['purchased', 'attempted_purchase', 'service_visit', 'other']).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  verifiedOnly: z.coerce.boolean().optional(),
  tagSlug: z.string().trim().max(50).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  sortBy: z.enum(['recent', 'rating_high', 'rating_low', 'helpful']).default('recent')
});

export type ReviewSearchParamsInput = z.input<typeof ReviewSearchSchema>;

/**
 * 6. REVIEW EVIDENCE RECORD SCHEMA
 */
export const CreateEvidenceSchema = z.object({
  review_id: z.string().uuid('Valid review ID is required'),
  file_storage_bucket: z.string().trim().default('dealer-intel-evidence'),
  file_storage_path: z.string().trim().min(5, 'Valid storage path is required'),
  original_filename: z.string().trim().max(255).optional(),
  file_size_bytes: z.number().int().positive().max(25 * 1024 * 1024, 'Evidence files must be under 25MB').optional(),
  mime_type: z.enum(['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  document_type: z.enum(['buyer_order', 'bill_of_sale', 'lease_agreement', 'window_sticker', 'repair_order', 'other']),
  redaction_confirmed_by_user: z.literal(true, {
    message: 'You must confirm that sensitive PII (SSN, banking account numbers, home address) has been redacted.'
  })
});

export type CreateEvidenceInput = z.infer<typeof CreateEvidenceSchema>;

/**
 * 7. REVIEW REPORT / MODERATION FLAG SCHEMA
 */
export const CreateReportSchema = z.object({
  review_id: z.string().uuid('Valid review ID is required'),
  reporter_type: z.enum(['consumer', 'dealer_representative', 'system']).default('consumer'),
  reason: z.enum([
    'defamation_claim',
    'hate_speech',
    'pii_exposure',
    'conflict_of_interest_competitor',
    'fake_transaction',
    'harassment',
    'other'
  ]),
  explanation: z.string().trim().min(10, 'Please provide an explanation of at least 10 characters').max(2000)
});

export type CreateReportInput = z.infer<typeof CreateReportSchema>;

/**
 * 8. DEALER CLAIM SCHEMA
 */
export const CreateClaimSchema = z.object({
  dealership_id: z.string().uuid('Valid dealership ID is required'),
  claimant_name: z.string().trim().min(2).max(150),
  claimant_title: z.string().trim().min(2, 'Official title is required (e.g. General Manager, Dealer Principal)').max(100),
  claimant_work_email: z.string().trim().email('Must provide a valid corporate or dealership email address'),
  claimant_phone: z.string().trim().regex(phoneRegex, 'Must provide a valid phone number'),
  verification_notes: z.string().trim().max(1000).optional(),
  verification_doc_path: z.string().trim().optional()
});

export type CreateClaimInput = z.infer<typeof CreateClaimSchema>;

/**
 * 9. DEALER RESPONSE SCHEMA
 */
export const CreateResponseSchema = z.object({
  review_id: z.string().uuid('Valid review ID is required'),
  dealership_id: z.string().uuid('Valid dealership ID is required'),
  responder_name: z.string().trim().min(2).max(150),
  responder_title: z.string().trim().min(2).max(100),
  response_body: z.string().trim().min(15, 'Official response must be at least 15 characters').max(3000)
});

export type CreateResponseInput = z.infer<typeof CreateResponseSchema>;

/**
 * 10. ADMIN MODERATION ACTIONS SCHEMA
 */
export const ModerateReviewSchema = z.object({
  review_id: z.string().uuid(),
  action: z.enum(['approve', 'reject', 'flag', 'soft_delete', 'restore']),
  moderation_reason: z.string().trim().min(3).max(500),
  verification_status: z.enum(['unverified', 'pending_evidence', 'verified_purchase', 'rejected']).optional()
});

export type ModerateReviewInput = z.infer<typeof ModerateReviewSchema>;

export const ModerateClaimSchema = z.object({
  claim_id: z.string().uuid(),
  action: z.enum(['approve', 'reject', 'revoke']),
  notes: z.string().trim().max(500).optional()
});

export type ModerateClaimInput = z.infer<typeof ModerateClaimSchema>;
