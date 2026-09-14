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

