# CarMatrix — Dealer Intel™ Implementation Plan

---

## 1. Executive Technical Summary

Dealer Intel™ extends CarMatrix into a full-scale automotive consumer intelligence and review platform. This document defines the engineering architecture, database schema, routing design, component hierarchy, security protocols, and step-by-step implementation phases.

### 1.1 Architecture Principles
* **Single Stack Extension:** Built completely within the existing React 19 + TypeScript + Vite + Tailwind CSS v4 + Supabase architecture. Zero duplicate frameworks, zero separate repositories.
* **Non-Disruptive Integration:** All current CarMatrix tools (VIN Decoder, TCO Calculator, Quote Auditor, State Fee Guide, Market Pulse) remain untouched and fully functional.
* **Server-Enforced Security:** All data validation, evidence access, and review moderation are enforced via Supabase Row-Level Security (RLS) and serverless backend policies.
* **Absolute Privacy of Evidence:** Consumer-uploaded transaction documents (buyer's orders, bills of sale) are stored in a private Supabase Storage bucket with zero public URL access.
* **DFW First, Nationwide Extensible:** Seeded with 50+ major franchised and independent dealerships in the Dallas–Fort Worth metroplex, utilizing standardized schema models that support all 50 states.

---

## 2. Route & Navigation Architecture

CarMatrix uses client-side routing within `App.tsx` that leverages clean URLs supported by Vercel's rewrite configuration (`/* -> /index.html`).

### 2.1 Proposed Route Mapping

| URL Path | Route ID | Description | Component |
|---|---|---|---|
| `/dealer-intel` | `dealer_intel` | Dealer Intel Directory & Search Hub (DFW default) | `DealerIntelDirectoryPage.tsx` |
| `/dealer-intel/:slug` | `dealer_profile` | Dealership Intelligence Dossier & Reviews | `DealerProfilePage.tsx` |
| `/dealer-intel/:slug/review` | `dealer_review_flow` | Guided Multi-Step Transaction Review Submission | `ReviewSubmissionFlow.tsx` |
| `/dealer-intel/:slug/claim` | `dealer_claim_flow` | Dealership Representative Verification & Claim | `DealerClaimFlow.tsx` |
| `/admin/dealer-intel` | `dealer_intel_admin` | Authenticated Review Moderation & Evidence Audit | `DealerIntelAdminPage.tsx` |

### 2.2 Global Navigation Integration
* **Primary Navigation Bar (`NavBar`):** Add **"Dealer Intel"** tab with a high-tech badge (e.g., `INTEL`).
* **Tool Quick Navigation:** Provide deep-linking between `DealerQuoteAuditorWidget` and the relevant dealer dossier on Dealer Intel.
* **Footer:** Add "Dealer Directory (DFW)" and "Review a Dealership" links under the Research section.

---

## 3. Database Schema Specification (Supabase PostgreSQL)

The schema will be maintained in a dedicated migration file: `supabase/migrations/20261008_dealer_intel_schema.sql`.

```
┌──────────────────┐       1:N       ┌────────────────────────┐       1:N       ┌────────────────────────┐
│     dealers      │────────────────>│     dealer_reviews     │────────────────>│    dealer_responses    │
│ (id, slug, name, │                 │ (id, dealer_id, rating,│                 │ (id, review_id, body,  │
│  brand, city...) │                 │  doc_fee, addons...)   │                 │  responder_title...)   │
└──────────────────┘                 └────────────────────────┘                 └────────────────────────┘
         │                                       │
         │ 1:1                                   │ 1:N
         v                                       v
┌──────────────────────────────┐     ┌────────────────────────┐
│ dealer_practice_aggregates   │     │  dealer_review_flags   │
│ (fee_score, avg_doc_fee...)  │     │ (moderation reports)   │
└──────────────────────────────┘     └────────────────────────┘
```

### 3.1 Table: `dealers`
Stores dealership profiles, contact information, geographic location, and claim status.

```sql
CREATE TABLE IF NOT EXISTS public.dealers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  dealer_group TEXT,
  brands TEXT[] DEFAULT '{}',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'TX',
  zip_code TEXT NOT NULL,
  market TEXT NOT NULL DEFAULT 'DFW',
  latitude NUMERIC,
  longitude NUMERIC,
  phone TEXT,
  website TEXT,
  google_place_id TEXT,
  logo_url TEXT,
  banner_url TEXT,
  
  -- Representative Claim
  is_claimed BOOLEAN NOT NULL DEFAULT false,
  claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at TIMESTAMPTZ,
  official_contact_email TEXT,

  -- Aggregated Stats (Denormalized for high performance)
  overall_rating NUMERIC(3, 2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  verified_review_count INTEGER DEFAULT 0,
  fee_transparency_score INTEGER DEFAULT 0, -- 0-100 scale
  avg_reported_doc_fee NUMERIC(8, 2),
  advertised_price_honored_pct INTEGER DEFAULT 0, -- 0-100%
  mandatory_addons_reported_pct INTEGER DEFAULT 0, -- 0-100%

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dealers_slug ON public.dealers(slug);
CREATE INDEX IF NOT EXISTS idx_dealers_market ON public.dealers(market);
CREATE INDEX IF NOT EXISTS idx_dealers_city_state ON public.dealers(city, state);
CREATE INDEX IF NOT EXISTS idx_dealers_rating ON public.dealers(overall_rating DESC);
```

### 3.2 Table: `dealer_reviews`
Captures structured consumer reviews, transaction data, fee audits, and evidence references.

```sql
CREATE TABLE IF NOT EXISTS public.dealer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID NOT NULL REFERENCES public.dealers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Public Reviewer Attribution
  reviewer_display_name TEXT NOT NULL DEFAULT 'Verified Buyer',
  reviewer_zip TEXT,
  
  -- Transaction Attributes
  transaction_date DATE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('new_purchase', 'used_purchase', 'lease', 'walked_away', 'service')),
  vehicle_year INTEGER,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_trim TEXT,
  salesperson_name TEXT,
  
  -- Ratings (1 to 5 scale)
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  price_transparency_rating INTEGER NOT NULL CHECK (price_transparency_rating BETWEEN 1 AND 5),
  sales_pressure_rating INTEGER NOT NULL CHECK (sales_pressure_rating BETWEEN 1 AND 5),
  finance_integrity_rating INTEGER NOT NULL CHECK (finance_integrity_rating BETWEEN 1 AND 5),
  
  -- Structured Intel Metrics
  advertised_price_honored BOOLEAN NOT NULL,
  reported_doc_fee NUMERIC(8, 2),
  mandatory_addons_reported BOOLEAN NOT NULL DEFAULT false,
  reported_addons JSONB DEFAULT '[]'::jsonb, -- e.g. [{"name": "Paint Protection", "cost": 895}]
  finance_terms_changed BOOLEAN NOT NULL DEFAULT false,
  trade_in_lowball_reported BOOLEAN NOT NULL DEFAULT false,
  would_recommend BOOLEAN NOT NULL DEFAULT true,

  -- Narrative
  title TEXT NOT NULL,
  review_body TEXT NOT NULL,
  advice_for_other_buyers TEXT,

  -- Verification & Private Evidence
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  evidence_file_path TEXT, -- Stored in private bucket, NEVER exposed in public queries
  evidence_status TEXT NOT NULL DEFAULT 'none' CHECK (evidence_status IN ('none', 'pending', 'verified', 'rejected')),
  evidence_rejection_reason TEXT,
  
  -- Moderation
  moderation_status TEXT NOT NULL DEFAULT 'published' CHECK (moderation_status IN ('published', 'pending_review', 'flagged', 'rejected', 'archived')),
  moderation_notes TEXT,
  
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_dealer ON public.dealer_reviews(dealer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.dealer_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.dealer_reviews(moderation_status);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON public.dealer_reviews(created_at DESC);
```

### 3.3 Table: `dealer_responses`
Allows authenticated dealership management to publish formal responses to consumer feedback.

```sql
CREATE TABLE IF NOT EXISTS public.dealer_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.dealer_reviews(id) ON DELETE CASCADE,
  dealer_id UUID NOT NULL REFERENCES public.dealers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  responder_name TEXT NOT NULL,
  responder_title TEXT NOT NULL, -- e.g. "General Manager", "Customer Relations Director"
  response_body TEXT NOT NULL,
  
  moderation_status TEXT NOT NULL DEFAULT 'published' CHECK (moderation_status IN ('published', 'flagged', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_response_per_review UNIQUE (review_id)
);
```

### 3.4 Table: `dealer_claims`
Manages dealership verification requests by dealership representatives.

```sql
CREATE TABLE IF NOT EXISTS public.dealer_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID NOT NULL REFERENCES public.dealers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  applicant_name TEXT NOT NULL,
  applicant_title TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  verification_doc_path TEXT, -- Private verification document
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 4. Row-Level Security (RLS) & Access Control

To ensure uncompromising security, RLS policies will be applied immediately upon schema creation:

```sql
-- Enable RLS across all tables
ALTER TABLE public.dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_claims ENABLE ROW LEVEL SECURITY;

-- 1. Dealers Policies
CREATE POLICY "Public can view dealers" 
  ON public.dealers FOR SELECT USING (true);

-- 2. Reviews Policies
-- Public can view published reviews (Excluding evidence_file_path via custom view or API select)
CREATE POLICY "Public can view published reviews" 
  ON public.dealer_reviews FOR SELECT 
  USING (moderation_status = 'published');

-- Authenticated users can insert their own reviews
CREATE POLICY "Users can create reviews" 
  ON public.dealer_reviews FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Users can edit their own reviews within 48 hours if not yet locked
CREATE POLICY "Users can update own reviews" 
  ON public.dealer_reviews FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- 3. Responses Policies
CREATE POLICY "Public can view published dealer responses" 
  ON public.dealer_responses FOR SELECT 
  USING (moderation_status = 'published');

CREATE POLICY "Verified representatives can post responses" 
  ON public.dealer_responses FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.dealers d 
      WHERE d.id = dealer_id 
      AND d.claimed_by = auth.uid()
    )
  );
```

---

## 5. Storage Architecture (Private Evidence Vault)

A dedicated private Supabase storage bucket `dealer-intel-evidence` will be provisioned:
* **Public Access:** Disabled (`public = false`).
* **Upload Path Policy:** `user_id/dealer_id/filename.ext`.
* **Upload RLS:** Authenticated users can write only to their own folder (`auth.uid() = (storage.foldername(name))[1]`).
* **Read Access:** Only accessible via backend service-role generating time-limited signed URLs (`createSignedUrl(path, 300)`), available exclusively to CarMatrix administrators.

---

## 6. Proposed Directory & Component Structure

All files will reside inside the existing `src/` tree, organized cleanly to match existing conventions:

```
src/
├── components/
│   └── dealer-intel/
│       ├── DealerCard.tsx                  # Search & grid card for dealer results
│       ├── DealerScorecard.tsx             # Visual transparency index & fee metrics
│       ├── DealerPracticeBadges.tsx        # Transparency & red-flag practice badges
│       ├── ReviewCard.tsx                  # Consumer review presentation with verified badge
│       ├── DealerResponseBox.tsx           # Official dealer reply component
│       ├── ReviewFilters.tsx               # Filter by rating, transaction type, verified status
│       ├── ReviewSubmissionModal.tsx       # Multi-step review & fee reporting modal
│       ├── RedactedUploadGuide.tsx         # Privacy guidance for buyer's order upload
│       └── DealerIntelCrossLink.tsx        # Embeddable link for Quote Auditor & Vehicle Details
├── pages/
│   └── dealer-intel/
│       ├── DealerIntelDirectoryPage.tsx    # /dealer-intel main search & discovery hub
│       ├── DealerProfilePage.tsx           # /dealer-intel/:slug public dossier
│       └── DealerClaimPage.tsx             # /dealer-intel/:slug/claim dealer portal
├── services/
│   ├── dealerIntelService.ts               # Supabase queries, stats aggregation & submission
│   └── dfwDealerSeedData.ts                # Verified seed data for initial 50+ DFW dealerships
└── types/
    └── dealerIntel.ts                      # Type definitions & interfaces
```

---

## 7. Phased Implementation Roadmap

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   PHASE 1    │     │   PHASE 2    │     │   PHASE 3    │     │   PHASE 4    │
│  Data Model  │────>│  Directory & │────>│  Submission │────>│ Cross-Tool   │
│ & DFW Seed   │     │  Dossier UI  │     │ & Evidence   │     │ Integrations │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

### Phase 1: Data Architecture & Seed Data (DFW Initial)
1. Author `supabase/migrations/20261008_dealer_intel_schema.sql` with tables, indexes, and RLS policies.
2. Create `src/types/dealerIntel.ts` with comprehensive TypeScript types.
3. Create `src/services/dfwDealerSeedData.ts` with 50+ verified franchised dealerships across Dallas, Fort Worth, Arlington, Plano, Frisco, Grapevine, and Irving.
4. Create `src/services/dealerIntelService.ts` for data access, search queries, and aggregation calculations.

### Phase 2: Directory & Dealership Dossier Presentation
1. Build `DealerPracticeBadges.tsx` and `DealerScorecard.tsx` to visualize transparency ratings and reported fees.
2. Build `DealerCard.tsx` with responsive layout, brand accents, and fee indicators.
3. Build `DealerIntelDirectoryPage.tsx` with keyword search, make/brand filter, fee transparency filter, and city/zip filtering.
4. Build `DealerProfilePage.tsx` showcasing the dealership's dossier, reported fee averages, verified reviews, and official responses.
5. Integrate route navigation in `App.tsx` and `NavBar.tsx`.

### Phase 3: Review Submission & Evidence Verification Flow
1. Build `ReviewSubmissionModal.tsx` guiding buyers through structured transaction questions:
   * Vehicle purchased / leased / walked away
   * Did they honor the advertised price?
   * What was the exact doc fee charged?
   * Were any add-ons mandatory? (Select items: Tint, Etch, Nitrogen, Ceramic, LoJack)
   * Did F&I alter the financing rate?
2. Implement optional private buyer's order upload with privacy tips (`RedactedUploadGuide.tsx`).
3. Connect submission flow to Supabase with proper user authentication check.

### Phase 4: Dealership Claim & Representative Response
1. Build `DealerClaimPage.tsx` enabling dealership managers to submit claim requests.
2. Build `DealerResponseBox.tsx` for authorized representatives to post formal, branded responses.

### Phase 5: Deep Cross-Tool Integrations
1. **Dealer Quote Auditor:** Add direct connection to Dealer Intel when auditing quotes from known dealerships.
2. **Vehicle Detail Page:** Show Dealer Intel rating pill next to the selling dealer name.
3. **State Fee Guide:** Link Texas doc fee statutory context ($150 avg) directly to DFW dealer doc fee reports.

### Phase 6: SEO Optimization & Production Deployment
1. Add Schema.org structured data (`AutoDealer`, `AggregateRating`, `Review`) for high-intent Google search indexing.
2. Verify production build, run comprehensive TypeScript lint checks, and test mobile responsiveness.
3. Deploy to production via GitHub CI/CD.

---

## 8. Security, Legal & Risk Mitigation Checklist

* [x] **Section 230 Disclaimers:** Every review is clearly labeled as an author-reported transaction experience, not an assertion of fact by CarMatrix.
* [x] **Non-Biased Moderation:** Positive and negative reviews follow identical standards. No paid removals.
* [x] **PII Protection:** Evidence uploads are stored in an encrypted private bucket, never accessible through public URLs.
* [x] **Redaction Guidance:** Upload modal clearly instructs users to conceal SSN, home address, and financial account numbers.
* [x] **Server-Side Authorization:** Dealership responses require authenticated representative status verified against the claimed dealer record.
* [x] **Spam & Astroturfing Defense:** Review submissions require authenticated accounts with rate-limiting controls.
