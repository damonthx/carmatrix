-- ============================================================================
-- CarMatrix — Dealer Intel™ Core Database Migration
-- Version: 20261008_dealer_intel_core.sql
-- Description: Complete data model, RLS security policies, triggers, and seed tags
-- for the Dealer Intel consumer protection intelligence module.
-- ============================================================================

-- Ensure pgcrypto extension is active for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. DEALERSHIPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dealer_intel_dealerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  aliases TEXT[] DEFAULT '{}',
  slug TEXT NOT NULL UNIQUE,
  
  -- Address & Geographic Location
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state VARCHAR(2) NOT NULL DEFAULT 'TX',
  zip_code VARCHAR(10) NOT NULL,
  market VARCHAR(50) NOT NULL DEFAULT 'DFW',
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  
  -- Communication & Identity
  website TEXT,
  phone VARCHAR(25),
  dealer_group TEXT,
  brands TEXT[] DEFAULT '{}',
  dealership_type VARCHAR(20) NOT NULL DEFAULT 'both' CHECK (dealership_type IN ('new', 'used', 'both')),
  
  -- Operational Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_claimed BOOLEAN NOT NULL DEFAULT false,
  claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at TIMESTAMPTZ,
  verified_contact_email TEXT,

  -- Computed Aggregate Metrics (Denormalized & maintained via triggers)
  overall_rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
  review_count INTEGER NOT NULL DEFAULT 0,
  verified_review_count INTEGER NOT NULL DEFAULT 0,
  price_transparency_score INTEGER NOT NULL DEFAULT 0, -- 0 to 100
  would_recommend_pct INTEGER NOT NULL DEFAULT 0, -- 0 to 100%
  avg_reported_doc_fee NUMERIC(8, 2),
  advertised_price_honored_pct INTEGER NOT NULL DEFAULT 0, -- 0 to 100%
  mandatory_addons_reported_pct INTEGER NOT NULL DEFAULT 0, -- 0 to 100%

  -- Timestamps & Soft Deletion
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Performance & Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_di_dealers_slug ON public.dealer_intel_dealerships(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_di_dealers_market ON public.dealer_intel_dealerships(market) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_di_dealers_city_state ON public.dealer_intel_dealerships(city, state) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_di_dealers_rating ON public.dealer_intel_dealerships(overall_rating DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_di_dealers_brands ON public.dealer_intel_dealerships USING GIN (brands);
CREATE INDEX IF NOT EXISTS idx_di_dealers_normalized ON public.dealer_intel_dealerships(normalized_name);

-- ============================================================================
-- 2. STANDARDIZED ISSUE & PRAISE TAGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dealer_intel_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) NOT NULL UNIQUE,
  label TEXT NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('issue', 'praise')),
  description TEXT,
  severity VARCHAR(20) DEFAULT 'neutral' CHECK (severity IN ('positive', 'neutral', 'warning', 'critical')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Standardized Tags (13 core tags defined in project requirements)
INSERT INTO public.dealer_intel_tags (slug, label, category, severity, description)
VALUES
  ('unexpected-fees', 'Unexpected Fees', 'issue', 'critical', 'Dealer attempted to introduce unannounced fees at time of signing.'),
  ('forced-addons', 'Forced Add-ons', 'issue', 'critical', 'Mandatory protection packages, tint, nitrogen, or coatings added above asking price.'),
  ('advertised-price-discrepancy', 'Advertised Price Discrepancy', 'issue', 'warning', 'Actual showroom vehicle price did not match the online advertised price.'),
  ('financing-terms-changed', 'Financing Terms Changed', 'issue', 'critical', 'Financing rates, terms, or monthly payments were altered between sales and F&I.'),
  ('high-pressure-sales', 'High-Pressure Sales', 'issue', 'warning', 'Aggressive or coercive sales tactics used during negotiation.'),
  ('trade-in-concerns', 'Trade-in Concerns', 'issue', 'warning', 'Trade-in allowance reduced or undervalued without mechanical basis.'),
  ('misleading-vehicle-availability', 'Misleading Vehicle Availability', 'issue', 'warning', 'Advertised car was not in stock or was already sold before arrival.'),
  ('clear-pricing', 'Clear Pricing', 'praise', 'positive', 'Upfront, transparent pricing with zero surprise charges.'),
  ('no-pressure-experience', 'No-Pressure Experience', 'praise', 'positive', 'Respectful, consultative sales process without artificial urgency.'),
  ('helpful-staff', 'Helpful Staff', 'praise', 'positive', 'Professional, knowledgeable, and courteous dealership personnel.'),
  ('fair-negotiation', 'Fair Negotiation', 'praise', 'positive', 'Willingness to negotiate reasonably and honor commitments.'),
  ('transparent-financing', 'Transparent Financing', 'praise', 'positive', 'Clear F&I process with full disclosure of rates, terms, and optional products.'),
  ('positive-overall-experience', 'Positive Overall Experience', 'praise', 'positive', 'High consumer satisfaction across all stages of the transaction.')
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  category = EXCLUDED.category,
  severity = EXCLUDED.severity,
  description = EXCLUDED.description;

-- ============================================================================
-- 3. CONSUMER REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dealer_intel_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealership_id UUID NOT NULL REFERENCES public.dealer_intel_dealerships(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Public Attribution (Privacy-respecting)
  reviewer_display_name VARCHAR(100) NOT NULL DEFAULT 'Verified Buyer',
  reviewer_city VARCHAR(100),
  reviewer_state VARCHAR(2),

  -- Ratings
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  pricing_transparency_rating INTEGER CHECK (pricing_transparency_rating BETWEEN 1 AND 5),
  sales_pressure_rating INTEGER CHECK (sales_pressure_rating BETWEEN 1 AND 5),
  financing_integrity_rating INTEGER CHECK (financing_integrity_rating BETWEEN 1 AND 5),
  service_speed_rating INTEGER CHECK (service_speed_rating BETWEEN 1 AND 5),

  -- Narrative
  title VARCHAR(150) NOT NULL,
  review_body TEXT NOT NULL,
  advice_for_other_buyers TEXT,

  -- Experience Particulars
  experience_date DATE NOT NULL,
  experience_type VARCHAR(30) NOT NULL CHECK (experience_type IN ('purchased', 'attempted_purchase', 'service_visit', 'other')),
  vehicle_year INTEGER CHECK (vehicle_year BETWEEN 1990 AND EXTRACT(YEAR FROM now()) + 2),
  vehicle_make VARCHAR(50),
  vehicle_model VARCHAR(50),
  salesperson_name VARCHAR(100),
  
  -- Consumer Protection Flags
  would_recommend BOOLEAN NOT NULL DEFAULT true,
  advertised_price_honored BOOLEAN,
  reported_doc_fee NUMERIC(8, 2),
  mandatory_addons_reported BOOLEAN DEFAULT false,
  reported_addons JSONB DEFAULT '[]'::jsonb, -- e.g. [{"name": "Nitrogen", "amount": 199}]
  financing_terms_changed BOOLEAN DEFAULT false,
  trade_in_lowball_reported BOOLEAN DEFAULT false,

  -- Verification Status
  verification_status VARCHAR(30) NOT NULL DEFAULT 'unverified' 
    CHECK (verification_status IN ('unverified', 'pending_evidence', 'verified_purchase', 'rejected')),
  
  -- Moderation Lifecycle
  moderation_status VARCHAR(30) NOT NULL DEFAULT 'published' 
    CHECK (moderation_status IN ('published', 'pending_review', 'flagged', 'rejected', 'archived')),
  moderation_reason TEXT,
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMPTZ,

  helpful_count INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamps & Soft Deletion
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,

  -- Prevent duplicate reviews from the same user for the same dealership on the same experience date
  CONSTRAINT unique_user_dealer_experience_date UNIQUE (dealership_id, user_id, experience_date)
);

CREATE INDEX IF NOT EXISTS idx_di_reviews_dealership ON public.dealer_intel_reviews(dealership_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_di_reviews_user ON public.dealer_intel_reviews(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_di_reviews_moderation ON public.dealer_intel_reviews(moderation_status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_di_reviews_created ON public.dealer_intel_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_di_reviews_verification ON public.dealer_intel_reviews(verification_status);

-- ============================================================================
-- 4. REVIEW TO TAG JUNCTION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dealer_intel_review_tags (
  review_id UUID NOT NULL REFERENCES public.dealer_intel_reviews(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.dealer_intel_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (review_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_di_review_tags_tag ON public.dealer_intel_review_tags(tag_id);

-- ============================================================================
-- 5. REVIEW EVIDENCE TABLE (PRIVATE SUPPORTING DOCUMENTS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dealer_intel_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.dealer_intel_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Storage Pointer (Private bucket only)
  file_storage_bucket VARCHAR(100) NOT NULL DEFAULT 'dealer-intel-evidence',
  file_storage_path TEXT NOT NULL,
  original_filename VARCHAR(255),
  file_size_bytes INTEGER,
  mime_type VARCHAR(100),
  
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('buyer_order', 'bill_of_sale', 'lease_agreement', 'window_sticker', 'repair_order', 'other')),
  redaction_confirmed_by_user BOOLEAN NOT NULL DEFAULT false,
  
  -- Verification Lifecycle
  verification_status VARCHAR(30) NOT NULL DEFAULT 'pending_review' 
    CHECK (verification_status IN ('pending_review', 'verified_valid', 'rejected_unreadable', 'rejected_mismatched_dealer', 'rejected_unredacted_pii')),
  rejection_reason TEXT,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  
  -- Audit Log of Administrative Access
  access_audit_log JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_di_evidence_review ON public.dealer_intel_evidence(review_id);
CREATE INDEX IF NOT EXISTS idx_di_evidence_user ON public.dealer_intel_evidence(user_id);
CREATE INDEX IF NOT EXISTS idx_di_evidence_status ON public.dealer_intel_evidence(verification_status);

-- ============================================================================
-- 6. REVIEW REPORTS TABLE (CONSUMER & DEALER MODERATION FLAGS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dealer_intel_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.dealer_intel_reviews(id) ON DELETE CASCADE,
  reporter_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_type VARCHAR(30) NOT NULL CHECK (reporter_type IN ('consumer', 'dealer_representative', 'system')),
  
  reason VARCHAR(50) NOT NULL CHECK (reason IN (
    'defamation_claim',
    'hate_speech',
    'pii_exposure',
    'conflict_of_interest_competitor',
    'fake_transaction',
    'harassment',
    'other'
  )),
  explanation TEXT NOT NULL,
  
  -- Moderation Resolution
  status VARCHAR(30) NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'under_review', 'resolved_dismissed', 'resolved_content_removed', 'resolved_content_edited')),
  moderation_outcome TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_di_reports_review ON public.dealer_intel_reports(review_id);
CREATE INDEX IF NOT EXISTS idx_di_reports_status ON public.dealer_intel_reports(status);

-- ============================================================================
-- 7. DEALER CLAIMS TABLE (OWNERSHIP VERIFICATION)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dealer_intel_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealership_id UUID NOT NULL REFERENCES public.dealer_intel_dealerships(id) ON DELETE CASCADE,
  claimant_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  claimant_name VARCHAR(150) NOT NULL,
  claimant_title VARCHAR(100) NOT NULL,
  claimant_work_email VARCHAR(255) NOT NULL,
  claimant_phone VARCHAR(25) NOT NULL,
  verification_notes TEXT,
  verification_doc_path TEXT, -- Stored in private storage
  
  approval_status VARCHAR(30) NOT NULL DEFAULT 'pending_review' 
    CHECK (approval_status IN ('pending_review', 'approved', 'rejected', 'revoked')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_di_claims_dealer ON public.dealer_intel_claims(dealership_id);
CREATE INDEX IF NOT EXISTS idx_di_claims_user ON public.dealer_intel_claims(claimant_user_id);
CREATE INDEX IF NOT EXISTS idx_di_claims_status ON public.dealer_intel_claims(approval_status);

-- ============================================================================
-- 8. DEALER RESPONSES TABLE (OFFICIAL REPRESENTATIVE REPLIES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dealer_intel_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.dealer_intel_reviews(id) ON DELETE CASCADE,
  dealership_id UUID NOT NULL REFERENCES public.dealer_intel_dealerships(id) ON DELETE CASCADE,
  responder_user_id UUID NOT NULL REFERENCES auth.users(id),
  
  responder_name VARCHAR(150) NOT NULL,
  responder_title VARCHAR(100) NOT NULL,
  response_body TEXT NOT NULL,
  
  moderation_status VARCHAR(30) NOT NULL DEFAULT 'published' 
    CHECK (moderation_status IN ('published', 'pending_review', 'flagged', 'hidden')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,

  -- Exactly one official response per consumer review
  CONSTRAINT unique_response_per_review UNIQUE (review_id)
);

CREATE INDEX IF NOT EXISTS idx_di_responses_review ON public.dealer_intel_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_di_responses_dealer ON public.dealer_intel_responses(dealership_id);

-- ============================================================================
-- 9. ADMIN AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dealer_intel_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role VARCHAR(50) NOT NULL DEFAULT 'admin',
  
  action_type VARCHAR(60) NOT NULL CHECK (action_type IN (
    'review_moderated',
    'review_soft_deleted',
    'review_restored',
    'evidence_verified',
    'evidence_rejected',
    'claim_approved',
    'claim_rejected',
    'claim_revoked',
    'dealership_updated',
    'response_moderated',
    'permission_changed'
  )),
  
  target_type VARCHAR(50) NOT NULL CHECK (target_type IN (
    'review', 'evidence', 'dealership', 'claim', 'response', 'report', 'user'
  )),
  target_id UUID NOT NULL,
  
  previous_state JSONB,
  new_state JSONB,
  reason TEXT,
  ip_address VARCHAR(50),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_di_audit_target ON public.dealer_intel_audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_di_audit_created ON public.dealer_intel_audit_logs(created_at DESC);

-- ============================================================================
-- 10. DATABASE TRIGGERS: AUTOMATED UPDATED_AT & AGGREGATE STATS
-- ============================================================================

-- Generic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_dealers_updated_at
  BEFORE UPDATE ON public.dealer_intel_dealerships
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON public.dealer_intel_reviews
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

CREATE TRIGGER trg_evidence_updated_at
  BEFORE UPDATE ON public.dealer_intel_evidence
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

CREATE TRIGGER trg_reports_updated_at
  BEFORE UPDATE ON public.dealer_intel_reports
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

CREATE TRIGGER trg_claims_updated_at
  BEFORE UPDATE ON public.dealer_intel_claims
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

CREATE TRIGGER trg_responses_updated_at
  BEFORE UPDATE ON public.dealer_intel_responses
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

-- Trigger to recalculate dealership metrics upon review changes
CREATE OR REPLACE FUNCTION public.fn_recalculate_dealer_aggregates()
RETURNS TRIGGER AS $$
DECLARE
  target_dealer_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_dealer_id := OLD.dealership_id;
  ELSE
    target_dealer_id := NEW.dealership_id;
  END IF;

  UPDATE public.dealer_intel_dealerships
  SET
    review_count = COALESCE(stats.cnt, 0),
    verified_review_count = COALESCE(stats.verified_cnt, 0),
    overall_rating = COALESCE(ROUND(stats.avg_rating, 2), 0.00),
    would_recommend_pct = CASE WHEN stats.cnt > 0 THEN ROUND((stats.recommend_cnt::numeric / stats.cnt) * 100) ELSE 0 END,
    avg_reported_doc_fee = ROUND(stats.avg_doc, 2),
    advertised_price_honored_pct = CASE WHEN stats.cnt_price_eval > 0 THEN ROUND((stats.price_honored_cnt::numeric / stats.cnt_price_eval) * 100) ELSE 0 END,
    mandatory_addons_reported_pct = CASE WHEN stats.cnt > 0 THEN ROUND((stats.addons_cnt::numeric / stats.cnt) * 100) ELSE 0 END,
    price_transparency_score = CASE 
      WHEN stats.cnt = 0 THEN 50
      ELSE GREATEST(0, LEAST(100, ROUND(
        (COALESCE(stats.avg_transparency, 3.0) / 5.0 * 50) +
        (CASE WHEN stats.cnt_price_eval > 0 THEN (stats.price_honored_cnt::numeric / stats.cnt_price_eval * 30) ELSE 15 END) +
        (CASE WHEN stats.cnt > 0 THEN (1.0 - (stats.addons_cnt::numeric / stats.cnt)) * 20 ELSE 10 END)
      )))
    END,
    updated_at = now()
  FROM (
    SELECT
      COUNT(*) AS cnt,
      COUNT(*) FILTER (WHERE verification_status = 'verified_purchase') AS verified_cnt,
      AVG(overall_rating) AS avg_rating,
      AVG(pricing_transparency_rating) AS avg_transparency,
      COUNT(*) FILTER (WHERE would_recommend = true) AS recommend_cnt,
      AVG(reported_doc_fee) FILTER (WHERE reported_doc_fee IS NOT NULL) AS avg_doc,
      COUNT(*) FILTER (WHERE advertised_price_honored IS NOT NULL) AS cnt_price_eval,
      COUNT(*) FILTER (WHERE advertised_price_honored = true) AS price_honored_cnt,
      COUNT(*) FILTER (WHERE mandatory_addons_reported = true) AS addons_cnt
    FROM public.dealer_intel_reviews
    WHERE dealership_id = target_dealer_id
      AND moderation_status = 'published'
      AND deleted_at IS NULL
  ) AS stats
  WHERE id = target_dealer_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_refresh_dealer_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.dealer_intel_reviews
  FOR EACH ROW EXECUTE FUNCTION public.fn_recalculate_dealer_aggregates();

-- ============================================================================
-- 11. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.dealer_intel_dealerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_intel_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_intel_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_intel_review_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_intel_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_intel_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_intel_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_intel_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_intel_audit_logs ENABLE ROW LEVEL SECURITY;

-- 11.1 DEALERSHIPS POLICIES
-- Public can read all active, non-deleted dealerships
CREATE POLICY "Public can view active dealerships"
  ON public.dealer_intel_dealerships FOR SELECT
  USING (is_active = true AND deleted_at IS NULL);

-- Only authenticated admins can insert or update dealerships
CREATE POLICY "Admins can manage dealerships"
  ON public.dealer_intel_dealerships FOR ALL
  TO authenticated
  USING (coalesce((auth.jwt() ->> 'role'), '') = 'admin' OR coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin'), 'false') = 'true')
  WITH CHECK (coalesce((auth.jwt() ->> 'role'), '') = 'admin' OR coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin'), 'false') = 'true');

-- 11.2 TAGS POLICIES
-- Public can read active tags
CREATE POLICY "Public can view active tags"
  ON public.dealer_intel_tags FOR SELECT
  USING (is_active = true);

-- 11.3 REVIEWS POLICIES
-- Public can only view published, non-deleted reviews
CREATE POLICY "Public can view published reviews"
  ON public.dealer_intel_reviews FOR SELECT
  USING (moderation_status = 'published' AND deleted_at IS NULL);

-- Authenticated users can insert their own reviews
CREATE POLICY "Authenticated users can create reviews"
  ON public.dealer_intel_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authors can view their own reviews even if pending review
CREATE POLICY "Authors can view own reviews"
  ON public.dealer_intel_reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Authors can update their own reviews before locking
CREATE POLICY "Authors can update own reviews"
  ON public.dealer_intel_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

-- Authors can soft delete their own reviews
CREATE POLICY "Authors can soft delete own reviews"
  ON public.dealer_intel_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 11.4 REVIEW TAGS JUNCTION POLICIES
CREATE POLICY "Public can view review tags"
  ON public.dealer_intel_review_tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.dealer_intel_reviews r
    WHERE r.id = review_id AND r.moderation_status = 'published' AND r.deleted_at IS NULL
  ));

CREATE POLICY "Review author can attach tags"
  ON public.dealer_intel_review_tags FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.dealer_intel_reviews r
    WHERE r.id = review_id AND r.user_id = auth.uid()
  ));

-- 11.5 EVIDENCE POLICIES (ZERO PUBLIC ACCESS)
-- Public CANNOT view evidence records. Only author can view their evidence records
CREATE POLICY "Authors can view own evidence records"
  ON public.dealer_intel_evidence FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Authors can insert evidence for their own reviews
CREATE POLICY "Authors can insert own evidence records"
  ON public.dealer_intel_evidence FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can view and moderate evidence
CREATE POLICY "Admins can view and moderate evidence"
  ON public.dealer_intel_evidence FOR ALL
  TO authenticated
  USING (coalesce((auth.jwt() ->> 'role'), '') = 'admin' OR coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin'), 'false') = 'true');

-- 11.6 REPORTS POLICIES
CREATE POLICY "Authenticated users can submit reports"
  ON public.dealer_intel_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_user_id);

CREATE POLICY "Admins can view and manage reports"
  ON public.dealer_intel_reports FOR ALL
  TO authenticated
  USING (coalesce((auth.jwt() ->> 'role'), '') = 'admin' OR coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin'), 'false') = 'true');

-- 11.7 CLAIMS POLICIES
CREATE POLICY "Claimants can view own claims"
  ON public.dealer_intel_claims FOR SELECT
  TO authenticated
  USING (auth.uid() = claimant_user_id);

CREATE POLICY "Authenticated users can submit claims"
  ON public.dealer_intel_claims FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = claimant_user_id);

CREATE POLICY "Admins can view and process claims"
  ON public.dealer_intel_claims FOR ALL
  TO authenticated
  USING (coalesce((auth.jwt() ->> 'role'), '') = 'admin' OR coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin'), 'false') = 'true');

-- 11.8 RESPONSES POLICIES
-- Public can view published responses
CREATE POLICY "Public can view published responses"
  ON public.dealer_intel_responses FOR SELECT
  USING (moderation_status = 'published' AND deleted_at IS NULL);

-- Only verified claimants can insert responses for their dealership
CREATE POLICY "Verified dealers can post official responses"
  ON public.dealer_intel_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = responder_user_id AND
    EXISTS (
      SELECT 1 FROM public.dealer_intel_dealerships d
      WHERE d.id = dealership_id AND d.is_claimed = true AND d.claimed_by = auth.uid()
    )
  );

CREATE POLICY "Verified dealers can update own responses"
  ON public.dealer_intel_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = responder_user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = responder_user_id);

-- 11.9 AUDIT LOGS POLICIES
-- Audit logs are strictly append-only by system / admins
CREATE POLICY "Admins can view audit logs"
  ON public.dealer_intel_audit_logs FOR SELECT
  TO authenticated
  USING (coalesce((auth.jwt() ->> 'role'), '') = 'admin' OR coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin'), 'false') = 'true');
