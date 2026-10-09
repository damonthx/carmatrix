-- ============================================================================
-- CarMatrix Migration: Top-Rated Used Cars Module
-- Migration: 001_create_vehicle_rankings.sql
-- Description: Core schema, indexes, valuation channels, and 100-pt scoring engine
-- ============================================================================

-- 1. Create vehicle_rankings_master Table
CREATE TABLE IF NOT EXISTS public.vehicle_rankings_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year_start INT NOT NULL,
    year_end INT NOT NULL,
    body_type VARCHAR(30) NOT NULL CHECK (body_type IN ('sedan', 'suv', 'truck', 'hatchback', 'wagon', 'coupe', 'minivan', 'hybrid_ev')),
    engine_notes VARCHAR(150) NOT NULL,
    dealer_retail_mid NUMERIC(10, 2) NOT NULL CHECK (dealer_retail_mid > 0),
    private_party_mid NUMERIC(10, 2) NOT NULL CHECK (private_party_mid > 0),
    reliability_rating NUMERIC(3, 2) NOT NULL CHECK (reliability_rating >= 1.0 AND reliability_rating <= 5.0),
    five_year_maintenance_cost NUMERIC(10, 2) NOT NULL CHECK (five_year_maintenance_cost >= 0),
    depreciation_rate_pct NUMERIC(5, 2) NOT NULL CHECK (depreciation_rate_pct >= 0 AND depreciation_rate_pct <= 100),
    key_strengths TEXT[] NOT NULL DEFAULT '{}',
    inspection_alerts TEXT[] NOT NULL DEFAULT '{}',
    is_clean_title_only BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Year range constraint
    CONSTRAINT chk_vehicle_year_range CHECK (year_end >= year_start)
);

-- 2. Indexes for Price Tier & Marketplace Filter Performance
CREATE INDEX IF NOT EXISTS idx_vrm_make_model ON public.vehicle_rankings_master(make, model);
CREATE INDEX IF NOT EXISTS idx_vrm_body_type ON public.vehicle_rankings_master(body_type);
CREATE INDEX IF NOT EXISTS idx_vrm_dealer_price ON public.vehicle_rankings_master(dealer_retail_mid);
CREATE INDEX IF NOT EXISTS idx_vrm_private_price ON public.vehicle_rankings_master(private_party_mid);
CREATE INDEX IF NOT EXISTS idx_vrm_reliability ON public.vehicle_rankings_master(reliability_rating DESC);
CREATE INDEX IF NOT EXISTS idx_vrm_active ON public.vehicle_rankings_master(is_active) WHERE is_active = true;

-- 3. Row-Level Security (RLS) Policies
ALTER TABLE public.vehicle_rankings_master ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'vehicle_rankings_master' AND policyname = 'Public can view active vehicle rankings'
  ) THEN
    CREATE POLICY "Public can view active vehicle rankings" ON public.vehicle_rankings_master
      FOR SELECT USING (is_active = true);
  END IF;
END $$;

-- 4. Composite Scoring Calculation Function (100-Point Algorithmic Engine)
-- Weight distribution:
--   1. Reliability Component: 40% (Scaled 1.0–5.0 to 0–40 pts)
--   2. 5-Year Ownership Component: 35% (Depreciation + Routine Maintenance, scaled 0–35 pts)
--   3. Market Spread Component: 25% (Private vs Dealer discount savings spread, scaled 0–25 pts)
CREATE OR REPLACE FUNCTION public.calculate_carmatrix_composite_score(
    p_reliability NUMERIC,
    p_five_year_maintenance NUMERIC,
    p_depreciation_rate NUMERIC,
    p_dealer_retail NUMERIC,
    p_private_party NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
    v_reliability_score NUMERIC;
    v_ownership_cost_total NUMERIC;
    v_ownership_score NUMERIC;
    v_spread_pct NUMERIC;
    v_spread_score NUMERIC;
    v_final_composite NUMERIC;
BEGIN
    -- 1. Reliability Score (40 Points Max):
    -- 5.0 -> 40 pts, 1.0 -> 8 pts
    v_reliability_score := (LEAST(5.0, GREATEST(1.0, p_reliability)) / 5.0) * 40.0;

    -- 2. 5-Year Ownership Cost Score (35 Points Max):
    -- Calculate effective 5-yr estimated loss: maintenance + 3-yr residual depreciation dollars
    v_ownership_cost_total := p_five_year_maintenance + (p_private_party * (p_depreciation_rate / 100.0));
    
    -- Normalize against a $25,000 baseline ceiling for high cost
    -- Low cost vehicles (<$4,500 total loss) earn full 35 pts, scaling down linearly
    IF v_ownership_cost_total <= 4500 THEN
        v_ownership_score := 35.0;
    ELSIF v_ownership_cost_total >= 20000 THEN
        v_ownership_score := 7.0;
    ELSE
        v_ownership_score := 35.0 - (((v_ownership_cost_total - 4500) / 15500.0) * 28.0);
    END IF;

    -- 3. Market Spread & Value Ratio (25 Points Max):
    -- Savings spread = (dealer_retail - private_party) / dealer_retail
    -- Expected realistic street spread: 12% to 25%
    IF p_dealer_retail > 0 THEN
        v_spread_pct := ((p_dealer_retail - p_private_party) / p_dealer_retail) * 100.0;
    ELSE
        v_spread_pct := 0;
    END IF;

    -- Spread scoring: 25% or greater spread earns full 25 pts; 10% spread earns 10 pts; <5% earns 5 pts
    IF v_spread_pct >= 25.0 THEN
        v_spread_score := 25.0;
    ELSIF v_spread_pct <= 5.0 THEN
        v_spread_score := 5.0;
    ELSE
        v_spread_score := 5.0 + (((v_spread_pct - 5.0) / 20.0) * 20.0);
    END IF;

    v_final_composite := ROUND(v_reliability_score + v_ownership_score + v_spread_score, 1);
    RETURN LEAST(100.0, GREATEST(10.0, v_final_composite));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 5. Materialized / Computed View with Dynamic Cash Price Tier Assignment
CREATE OR REPLACE VIEW public.v_top_rated_used_cars AS
SELECT 
    vrm.id,
    vrm.make,
    vrm.model,
    vrm.year_start,
    vrm.year_end,
    CONCAT(vrm.year_start, '–', vrm.year_end, ' ', vrm.make, ' ', vrm.model) AS display_name,
    vrm.body_type,
    vrm.engine_notes,
    vrm.dealer_retail_mid,
    vrm.private_party_mid,
    ROUND(((vrm.dealer_retail_mid - vrm.private_party_mid) / vrm.dealer_retail_mid) * 100.0, 1) AS private_party_savings_pct,
    (vrm.dealer_retail_mid - vrm.private_party_mid) AS private_party_savings_dollars,
    vrm.reliability_rating,
    vrm.five_year_maintenance_cost,
    vrm.depreciation_rate_pct,
    
    -- Algorithmic Composite Score (0-100)
    public.calculate_carmatrix_composite_score(
        vrm.reliability_rating,
        vrm.five_year_maintenance_cost,
        vrm.depreciation_rate_pct,
        vrm.dealer_retail_mid,
        vrm.private_party_mid
    ) AS carmatrix_score,

    -- Dynamic Street Cash Tier (Determined by street clearing private_party_mid)
    CASE 
        WHEN vrm.private_party_mid < 6000 THEN 'sub_6k'
        WHEN vrm.private_party_mid >= 6000 AND vrm.private_party_mid < 11000 THEN '6k_11k'
        WHEN vrm.private_party_mid >= 11000 AND vrm.private_party_mid < 18000 THEN '11k_18k'
        ELSE '18k_26k'
    END AS cash_price_tier,

    -- Dynamic Dealer Retail Tier
    CASE 
        WHEN vrm.dealer_retail_mid < 7500 THEN 'sub_7.5k'
        WHEN vrm.dealer_retail_mid >= 7500 AND vrm.dealer_retail_mid < 13500 THEN '7.5k_13.5k'
        WHEN vrm.dealer_retail_mid >= 13500 AND vrm.dealer_retail_mid < 22000 THEN '13.5k_22k'
        ELSE '22k_32k'
    END AS dealer_retail_tier,

    vrm.key_strengths,
    vrm.inspection_alerts,
    vrm.is_clean_title_only,
    vrm.is_active,
    vrm.created_at,
    vrm.updated_at
FROM public.vehicle_rankings_master vrm
WHERE vrm.is_active = true;

-- 6. Updated Timestamp Trigger
CREATE OR REPLACE FUNCTION public.handle_vrm_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_vrm_updated_at ON public.vehicle_rankings_master;
CREATE TRIGGER trg_vrm_updated_at
    BEFORE UPDATE ON public.vehicle_rankings_master
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_vrm_updated_at();
