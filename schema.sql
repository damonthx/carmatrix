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

