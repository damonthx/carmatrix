/**
 * CarMatrix — Dealer Intel™ TypeScript Interfaces & Domain Models
 * Represents the complete data contracts for Dealerships, Reviews,
 * Verification Evidence, Issue Tags, Dealer Claims, and Admin Audit Logs.
 */

export type DealershipType = 'new' | 'used' | 'both';

export interface Dealership {
  id: string;
  name: string;
  normalized_name: string;
  aliases: string[];
  slug: string;

  // Geographic & Physical Address
  street_address: string;
  city: string;
  state: string; // e.g. 'TX'
  zip_code: string;
  market: string; // e.g. 'DFW'
  latitude?: number | null;
  longitude?: number | null;

  // Contact & Identity
  website?: string | null;
  phone?: string | null;
  dealer_group?: string | null;
  brands: string[];
  dealership_type: DealershipType;

  // Operational Status
  is_active: boolean;
  is_claimed: boolean;
  claimed_by?: string | null;
  claimed_at?: string | null;
  verified_contact_email?: string | null;

  // Aggregated Performance & Transparency Metrics
  overall_rating: number; // 0.00 - 5.00
  review_count: number;
  verified_review_count: number;
  price_transparency_score: number; // 0 - 100 index
  would_recommend_pct: number; // 0 - 100%
  avg_reported_doc_fee?: number | null;
  advertised_price_honored_pct: number; // 0 - 100%
  mandatory_addons_reported_pct: number; // 0 - 100%

  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type ExperienceType = 'purchased' | 'attempted_purchase' | 'service_visit' | 'other';
export type VerificationStatus = 'unverified' | 'pending_evidence' | 'verified_purchase' | 'rejected';
export type ModerationStatus = 'published' | 'pending_review' | 'flagged' | 'rejected' | 'archived';

export interface MandatoryAddonItem {
  name: string;
  amount: number;
}

export interface Review {
  id: string;
  dealership_id: string;
  user_id?: string | null;

  // Reviewer Attribution
  reviewer_display_name: string;
  reviewer_city?: string | null;
  reviewer_state?: string | null;

  // Ratings
  overall_rating: number; // 1 to 5
  pricing_transparency_rating?: number | null;
  sales_pressure_rating?: number | null;
  financing_integrity_rating?: number | null;
  service_speed_rating?: number | null;

  // Narrative Content
  title: string;
  review_body: string;
  advice_for_other_buyers?: string | null;

  // Experience Particulars
  experience_date: string; // YYYY-MM-DD
  experience_type: ExperienceType;
  vehicle_year?: number | null;
  vehicle_make?: string | null;
  vehicle_model?: string | null;
  salesperson_name?: string | null;

  // Consumer Protection Metrics
  would_recommend: boolean;
  advertised_price_honored?: boolean | null;
  reported_doc_fee?: number | null;
  mandatory_addons_reported: boolean;
  reported_addons: MandatoryAddonItem[];
  financing_terms_changed: boolean;
  trade_in_lowball_reported: boolean;

  // Verification & Moderation Status
  verification_status: VerificationStatus;
  moderation_status: ModerationStatus;
  moderation_reason?: string | null;
  moderated_by?: string | null;
  moderated_at?: string | null;

  helpful_count: number;
  tags?: Tag[];

  // Optional Official Dealer Response
  dealer_response?: DealerResponse | null;

  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type TagCategory = 'issue' | 'praise';
export type TagSeverity = 'positive' | 'neutral' | 'warning' | 'critical';

export interface Tag {
  id: string;
  slug: string;
  label: string;
  category: TagCategory;
  description?: string | null;
  severity: TagSeverity;
  is_active: boolean;
  created_at: string;
}

export type DocumentType = 
  | 'buyer_order' 
  | 'bill_of_sale' 
  | 'lease_agreement' 
  | 'window_sticker' 
  | 'repair_order' 
  | 'other';

export type EvidenceVerificationStatus = 
  | 'pending_review' 
  | 'verified_valid' 
  | 'rejected_unreadable' 
  | 'rejected_mismatched_dealer' 
  | 'rejected_unredacted_pii';

export interface ReviewEvidence {
  id: string;
  review_id: string;
  user_id: string;
  file_storage_bucket: string;
  file_storage_path: string; // Encrypted/private bucket path
  original_filename?: string | null;
  file_size_bytes?: number | null;
  mime_type?: string | null;
  document_type: DocumentType;
  redaction_confirmed_by_user: boolean;

  verification_status: EvidenceVerificationStatus;
  rejection_reason?: string | null;
  verified_by?: string | null;
  verified_at?: string | null;

  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type ReportType = 'consumer' | 'dealer_representative' | 'system';
export type ReportReason = 
  | 'defamation_claim' 
  | 'hate_speech' 
  | 'pii_exposure' 
  | 'conflict_of_interest_competitor' 
  | 'fake_transaction' 
  | 'harassment' 
  | 'other';

export type ReportStatus = 
  | 'pending' 
  | 'under_review' 
  | 'resolved_dismissed' 
  | 'resolved_content_removed' 
  | 'resolved_content_edited';

export interface ReviewReport {
  id: string;
  review_id: string;
  reporter_user_id?: string | null;
  reporter_type: ReportType;
  reason: ReportReason;
  explanation: string;
  status: ReportStatus;
  moderation_outcome?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type ClaimApprovalStatus = 'pending_review' | 'approved' | 'rejected' | 'revoked';

export interface DealerClaim {
  id: string;
  dealership_id: string;
  claimant_user_id: string;
  claimant_name: string;
  claimant_title: string;
  claimant_work_email: string;
  claimant_phone: string;
  verification_notes?: string | null;
  verification_doc_path?: string | null;
  approval_status: ClaimApprovalStatus;
  rejection_reason?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type ResponseModerationStatus = 'published' | 'pending_review' | 'flagged' | 'hidden';

export interface DealerResponse {
  id: string;
  review_id: string;
  dealership_id: string;
  responder_user_id: string;
  responder_name: string;
  responder_title: string;
  response_body: string;
  moderation_status: ResponseModerationStatus;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type AuditActionType =
  | 'review_moderated'
  | 'review_soft_deleted'
  | 'review_restored'
  | 'evidence_verified'
  | 'evidence_rejected'
  | 'claim_approved'
  | 'claim_rejected'
  | 'claim_revoked'
  | 'dealership_updated'
  | 'response_moderated'
  | 'permission_changed';

export type AuditTargetType =
  | 'review'
  | 'evidence'
  | 'dealership'
  | 'claim'
  | 'response'
  | 'report'
  | 'user';

export interface AdminAuditLog {
  id: string;
  actor_user_id?: string | null;
  actor_role: string;
  action_type: AuditActionType;
  target_type: AuditTargetType;
  target_id: string;
  previous_state?: Record<string, any> | null;
  new_state?: Record<string, any> | null;
  reason?: string | null;
  ip_address?: string | null;
  created_at: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DealerSearchParams {
  query?: string;
  brand?: string;
  city?: string;
  state?: string;
  market?: string;
  minRating?: number;
  minTransparencyScore?: number;
  dealershipType?: DealershipType;
  page?: number;
  pageSize?: number;
  sortBy?: 'rating' | 'transparency' | 'reviews' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface ReviewSearchParams {
  dealershipId: string;
  experienceType?: ExperienceType;
  rating?: number;
  verifiedOnly?: boolean;
  tagSlug?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'recent' | 'rating_high' | 'rating_low' | 'helpful';
}
