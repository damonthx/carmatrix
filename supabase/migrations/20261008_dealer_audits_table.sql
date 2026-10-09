-- ============================================================================
-- CarMatrix Migration: Community Dealership Audits and Fee Reports
-- Migration: 20261008_dealer_audits_table.sql
-- ============================================================================

-- 1. Create dealer_audits table
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

-- 2. Indexes for fast aggregation and dealer lookups
CREATE INDEX IF NOT EXISTS idx_dealer_audits_dealer ON public.dealer_audits(dealership_id);
CREATE INDEX IF NOT EXISTS idx_dealer_audits_user ON public.dealer_audits(user_id);
CREATE INDEX IF NOT EXISTS idx_dealer_audits_created ON public.dealer_audits(created_at DESC);

-- 3. Row-Level Security (RLS)
ALTER TABLE public.dealer_audits ENABLE ROW LEVEL SECURITY;

-- Allow public read of published community audits
CREATE POLICY "Public can view dealer audits" ON public.dealer_audits
  FOR SELECT USING (true);

-- Allow authenticated users or anonymous submitters to insert audits
CREATE POLICY "Anyone can submit dealer audits" ON public.dealer_audits
  FOR INSERT WITH CHECK (true);

-- Allow audit authors to update their own submission
CREATE POLICY "Users can update own audits" ON public.dealer_audits
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Trigger Function: Automatically recalculate dealership transparency_score on new audit
CREATE OR REPLACE FUNCTION public.recalculate_dealership_audit_score()
RETURNS TRIGGER AS $$
DECLARE
  avg_integrity NUMERIC;
  calc_score INTEGER;
  target_dealer_id UUID;
BEGIN
  target_dealer_id := COALESCE(NEW.dealership_id, OLD.dealership_id);

  -- Compute average integrity rating (scale 1 to 5)
  SELECT AVG(integrity_score)
  INTO avg_integrity
  FROM public.dealer_audits
  WHERE dealership_id = target_dealer_id
    AND integrity_score IS NOT NULL;

  -- Convert 1-5 scale into 0-100 transparency_score
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

-- 5. Bind trigger to dealer_audits table
DROP TRIGGER IF EXISTS trg_recalculate_dealer_audit_score ON public.dealer_audits;
CREATE TRIGGER trg_recalculate_dealer_audit_score
  AFTER INSERT OR UPDATE OR DELETE ON public.dealer_audits
  FOR EACH ROW
  EXECUTE FUNCTION public.recalculate_dealership_audit_score();
