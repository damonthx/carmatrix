-- ============================================================
-- CarMatrix Code — Vehicle Inventory Schema Setup
--
-- Run this ONCE against your Supabase project via:
--   Supabase Dashboard -> SQL Editor -> New query -> paste this -> Run
-- ============================================================

-- 1. Create the inventory table if it does not exist
CREATE TABLE IF NOT EXISTS public.inventory (
  vin TEXT PRIMARY KEY,
  dealer_id TEXT,
  make TEXT,
  model TEXT,
  trim TEXT,
  drive_type TEXT,
  transmission TEXT,
  year INTEGER,
  stock_number TEXT,
  interior_type TEXT,
  interior_color TEXT,
  exterior_color TEXT,
  cylinders TEXT,
  cost NUMERIC,
  wholesale NUMERIC,
  retail_price NUMERIC,
  internet_price NUMERIC,
  mileage INTEGER,
  purchase_date TIMESTAMPTZ,
  video_url TEXT,
  options TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  last_modified_date TIMESTAMPTZ,
  body_type TEXT,
  engine TEXT,
  mpg_city INTEGER,
  mpg_highway INTEGER,
  new_used TEXT,
  msrp NUMERIC,
  image_last_modified_date TIMESTAMPTZ,
  comments TEXT,
  certified_pre_owned BOOLEAN DEFAULT false,
  vehicle_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Safely add any columns if they do not exist (useful for incremental updates / backward compatibility)
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS dealer_id TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS make TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS model TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS trim TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS drive_type TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS transmission TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS stock_number TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS interior_type TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS interior_color TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS exterior_color TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS cylinders TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS cost NUMERIC;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS wholesale NUMERIC;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS retail_price NUMERIC;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS internet_price NUMERIC;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS mileage INTEGER;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS purchase_date TIMESTAMPTZ;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS options TEXT[] DEFAULT '{}';
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS last_modified_date TIMESTAMPTZ;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS body_type TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS engine TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS mpg_city INTEGER;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS mpg_highway INTEGER;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS new_used TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS msrp NUMERIC;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS image_last_modified_date TIMESTAMPTZ;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS comments TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS certified_pre_owned BOOLEAN DEFAULT false;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS vehicle_link TEXT;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 3. Create indexes to speed up standard marketplace search operations
CREATE INDEX IF NOT EXISTS inventory_make_model_idx ON public.inventory(make, model);
CREATE INDEX IF NOT EXISTS inventory_year_idx ON public.inventory(year);
CREATE INDEX IF NOT EXISTS inventory_retail_price_idx ON public.inventory(retail_price);
CREATE INDEX IF NOT EXISTS inventory_internet_price_idx ON public.inventory(internet_price);

-- 4. Create the dealer_inquiries table for partnership requests
CREATE TABLE IF NOT EXISTS public.dealer_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  dealership_name TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.dealer_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can submit an inquiry)
CREATE POLICY "Allow anonymous insert" ON public.dealer_inquiries
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users (e.g. admins) full control
CREATE POLICY "Allow authenticated read and write" ON public.dealer_inquiries
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Dealership Entities and Relational Inventory Schema
CREATE TABLE IF NOT EXISTS public.dealerships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT DEFAULT 'TX',
    zip TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT,
    website TEXT,
    transparency_score INTEGER DEFAULT 85,
    pricing_accuracy_rating NUMERIC(3, 2) DEFAULT 4.8,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist on dealerships table
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'TX';
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS zip TEXT;
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS transparency_score INTEGER DEFAULT 85;
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS pricing_accuracy_rating NUMERIC(3, 2) DEFAULT 4.8;
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE public.dealerships ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Enable RLS and public read access on dealerships
ALTER TABLE public.dealerships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view dealerships" ON public.dealerships
  FOR SELECT USING (true);

-- 6. Vehicles table with Foreign Key linking to dealerships
CREATE TABLE IF NOT EXISTS public.vehicles (
    vin TEXT PRIMARY KEY,
    dealership_id UUID REFERENCES public.dealerships(id) ON DELETE CASCADE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    trim TEXT,
    year INTEGER NOT NULL,
    stock_number TEXT,
    retail_price NUMERIC,
    internet_price NUMERIC,
    mileage INTEGER,
    body_type TEXT,
    transmission TEXT,
    drive_type TEXT,
    engine TEXT,
    exterior_color TEXT,
    interior_color TEXT,
    images TEXT[] DEFAULT '{}',
    options TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foreign key linking vehicles to dealerships
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS dealership_id UUID REFERENCES public.dealerships(id) ON DELETE CASCADE;

-- Foreign key linking inventory to dealerships
ALTER TABLE public.inventory
ADD COLUMN IF NOT EXISTS dealership_id UUID REFERENCES public.dealerships(id) ON DELETE CASCADE;

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_dealerships_slug ON public.dealerships(slug);
CREATE INDEX IF NOT EXISTS idx_vehicles_dealership_id ON public.vehicles(dealership_id);
CREATE INDEX IF NOT EXISTS idx_inventory_dealership_id ON public.inventory(dealership_id);

-- 7. Community Dealership Audits and Fee Reports
CREATE TABLE IF NOT EXISTS public.dealer_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealership_id UUID NOT NULL REFERENCES public.dealerships(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    transaction_type TEXT NOT NULL, -- 'bought', 'walked_out', 'inquired'
    advertised_price_matched BOOLEAN NOT NULL,
    hidden_fee_amount NUMERIC(10, 2) DEFAULT 0,
    reported_tactics TEXT[], -- e.g. ['forced_add_ons', 'finance_markup', 'bait_and_switch']
    integrity_score INTEGER CHECK (integrity_score BETWEEN 1 AND 5),
    sales_pressure_rating INTEGER CHECK (sales_pressure_rating BETWEEN 1 AND 5),
    review_title TEXT,
    review_body TEXT,
    proof_document_url TEXT,
    is_verified_audit BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dealer_audits_dealer ON public.dealer_audits(dealership_id);
CREATE INDEX IF NOT EXISTS idx_dealer_audits_user ON public.dealer_audits(user_id);
CREATE INDEX IF NOT EXISTS idx_dealer_audits_created ON public.dealer_audits(created_at DESC);

-- Enable RLS on dealer_audits
ALTER TABLE public.dealer_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view dealer audits" ON public.dealer_audits
  FOR SELECT USING (true);

CREATE POLICY "Anyone can submit dealer audits" ON public.dealer_audits
  FOR INSERT WITH CHECK (true);

-- Computed score recalculation trigger
CREATE OR REPLACE FUNCTION public.recalculate_dealership_audit_score()
RETURNS TRIGGER AS $$
DECLARE
  avg_integrity NUMERIC;
  calc_score INTEGER;
  target_dealer_id UUID;
BEGIN
  target_dealer_id := COALESCE(NEW.dealership_id, OLD.dealership_id);

  SELECT AVG(integrity_score)
  INTO avg_integrity
  FROM public.dealer_audits
  WHERE dealership_id = target_dealer_id
    AND integrity_score IS NOT NULL;

  IF avg_integrity IS NOT NULL THEN
    calc_score := ROUND((avg_integrity / 5.0) * 100);
    
    UPDATE public.dealerships
    SET 
      transparency_score = calc_score,
      pricing_accuracy_rating = ROUND(avg_integrity, 2)
    WHERE id = target_dealer_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_recalculate_dealer_audit_score ON public.dealer_audits;
CREATE TRIGGER trg_recalculate_dealer_audit_score
  AFTER INSERT OR UPDATE OR DELETE ON public.dealer_audits
  FOR EACH ROW
  EXECUTE FUNCTION public.recalculate_dealership_audit_score();

-- 8. Vehicle Rankings Master & Used Car Scoring Engine
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
    CONSTRAINT chk_vehicle_year_range CHECK (year_end >= year_start)
);

CREATE INDEX IF NOT EXISTS idx_vrm_make_model ON public.vehicle_rankings_master(make, model);
CREATE INDEX IF NOT EXISTS idx_vrm_body_type ON public.vehicle_rankings_master(body_type);
CREATE INDEX IF NOT EXISTS idx_vrm_dealer_price ON public.vehicle_rankings_master(dealer_retail_mid);
CREATE INDEX IF NOT EXISTS idx_vrm_private_price ON public.vehicle_rankings_master(private_party_mid);
CREATE INDEX IF NOT EXISTS idx_vrm_reliability ON public.vehicle_rankings_master(reliability_rating DESC);

ALTER TABLE public.vehicle_rankings_master ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active vehicle rankings" ON public.vehicle_rankings_master
  FOR SELECT USING (is_active = true);

-- Composite Scoring Engine (Reliability 40%, Ownership 35%, Market Spread 25%)
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
    v_reliability_score := (LEAST(5.0, GREATEST(1.0, p_reliability)) / 5.0) * 40.0;
    v_ownership_cost_total := p_five_year_maintenance + (p_private_party * (p_depreciation_rate / 100.0));
    
    IF v_ownership_cost_total <= 4500 THEN
        v_ownership_score := 35.0;
    ELSIF v_ownership_cost_total >= 20000 THEN
        v_ownership_score := 7.0;
    ELSE
        v_ownership_score := 35.0 - (((v_ownership_cost_total - 4500) / 15500.0) * 28.0);
    END IF;

    IF p_dealer_retail > 0 THEN
        v_spread_pct := ((p_dealer_retail - p_private_party) / p_dealer_retail) * 100.0;
    ELSE
        v_spread_pct := 0;
    END IF;

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
    public.calculate_carmatrix_composite_score(
        vrm.reliability_rating,
        vrm.five_year_maintenance_cost,
        vrm.depreciation_rate_pct,
        vrm.dealer_retail_mid,
        vrm.private_party_mid
    ) AS carmatrix_score,
    CASE 
        WHEN vrm.private_party_mid < 6000 THEN 'sub_6k'
        WHEN vrm.private_party_mid >= 6000 AND vrm.private_party_mid < 11000 THEN '6k_11k'
        WHEN vrm.private_party_mid >= 11000 AND vrm.private_party_mid < 18000 THEN '11k_18k'
        ELSE '18k_26k'
    END AS cash_price_tier,
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


