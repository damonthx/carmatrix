-- ============================================================================
-- CarMatrix Migration: Relational Schema Linking Dealership Entities & Inventory
-- Migration: 20261008_link_dealerships_and_vehicles.sql
-- ============================================================================

-- 1. Ensure primary 'dealerships' table exists with all required transparency attributes
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

-- Ensure columns exist on public.dealerships if created in a previous lightweight migration
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

-- Enable RLS and public read policies for dealerships
ALTER TABLE public.dealerships ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'dealerships' AND policyname = 'Public can view active dealerships'
  ) THEN
    CREATE POLICY "Public can view active dealerships" ON public.dealerships
      FOR SELECT USING (true);
  END IF;
END $$;

-- 2. Ensure vehicles table exists (supporting both 'vehicles' and 'inventory' naming conventions)
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

-- Also support existing 'inventory' table schema linking to dealerships
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'inventory') THEN
    ALTER TABLE public.inventory 
    ADD COLUMN IF NOT EXISTS dealership_id UUID REFERENCES public.dealerships(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Optimization Indexes for Relational Inventory Lookups
CREATE INDEX IF NOT EXISTS idx_dealerships_slug ON public.dealerships(slug);
CREATE INDEX IF NOT EXISTS idx_vehicles_dealership_id ON public.vehicles(dealership_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON public.vehicles(make, model);

-- Enable RLS on vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'vehicles' AND policyname = 'Public can view active vehicles'
  ) THEN
    CREATE POLICY "Public can view active vehicles" ON public.vehicles
      FOR SELECT USING (true);
  END IF;
END $$;
