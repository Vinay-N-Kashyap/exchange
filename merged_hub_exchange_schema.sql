-- ============================================================
-- PinIT Hub ↔ PinIT Exchange — Merged Database Schema Extension
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/tasaixjwlothmqgvaenv/sql)
-- ============================================================

-- 1. Extend Profiles Table for Seller Verification & Identity
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pinit_id TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS exchange_id TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'verified';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS biometric_verified BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS seller_plan TEXT DEFAULT 'pro';

-- 2. Extend Vault Registry for DNA Signatures & Exchange Link
ALTER TABLE public.vault_registry ADD COLUMN IF NOT EXISTS asset_id TEXT;
ALTER TABLE public.vault_registry ADD COLUMN IF NOT EXISTS dna_signature TEXT;
ALTER TABLE public.vault_registry ADD COLUMN IF NOT EXISTS human_percent INT DEFAULT 95;
ALTER TABLE public.vault_registry ADD COLUMN IF NOT EXISTS ai_percent INT DEFAULT 5;
ALTER TABLE public.vault_registry ADD COLUMN IF NOT EXISTS badge_tier TEXT DEFAULT 'Gold';
ALTER TABLE public.vault_registry ADD COLUMN IF NOT EXISTS protection_level TEXT DEFAULT 'high';
ALTER TABLE public.vault_registry ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- 3. Extend Content Items (Listings) for Exchange Provenance Fields
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS listing_id TEXT;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS asset_id UUID REFERENCES public.assets(id) ON DELETE SET NULL;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS vertical TEXT DEFAULT 'images';
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS tags TEXT;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS price_personal NUMERIC DEFAULT 49;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS price_commercial NUMERIC DEFAULT 149;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS price_exclusive NUMERIC DEFAULT 899;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS price_enterprise NUMERIC DEFAULT 2499;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS badge_tier TEXT DEFAULT 'Gold';
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS human_percent INT DEFAULT 95;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS ai_percent INT DEFAULT 5;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS dna_hash TEXT;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS ai_training_opt_out BOOLEAN DEFAULT true;
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- 4. Extend Purchased Licenses Table for Immutable Order Seals
ALTER TABLE public.purchased_licenses ADD COLUMN IF NOT EXISTS seal_id TEXT UNIQUE;
ALTER TABLE public.purchased_licenses ADD COLUMN IF NOT EXISTS order_id TEXT;
ALTER TABLE public.purchased_licenses ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.purchased_licenses ADD COLUMN IF NOT EXISTS seller_exchange_id TEXT;
ALTER TABLE public.purchased_licenses ADD COLUMN IF NOT EXISTS buyer_name TEXT;
ALTER TABLE public.purchased_licenses ADD COLUMN IF NOT EXISTS buyer_email TEXT;
ALTER TABLE public.purchased_licenses ADD COLUMN IF NOT EXISTS buyer_org TEXT;
ALTER TABLE public.purchased_licenses ADD COLUMN IF NOT EXISTS platform_fee NUMERIC DEFAULT 0;
ALTER TABLE public.purchased_licenses ADD COLUMN IF NOT EXISTS creator_net NUMERIC DEFAULT 0;
ALTER TABLE public.purchased_licenses ADD COLUMN IF NOT EXISTS dna_hash_summary TEXT;
ALTER TABLE public.purchased_licenses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sealed';

-- 5. Create Storage Buckets if missing
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public-previews', 'public-previews', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('vault-masters', 'vault-masters', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public Read Access for Previews" ON storage.objects;
CREATE POLICY "Public Read Access for Previews" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'public-previews');

DROP POLICY IF EXISTS "Public Upload Access for Previews" ON storage.objects;
CREATE POLICY "Public Upload Access for Previews" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'public-previews');

-- 6. Enable RLS and Grant Full Access Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchased_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Profiles Access" ON public.profiles;
CREATE POLICY "Public Profiles Access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Vault Access" ON public.vault_registry;
CREATE POLICY "Public Vault Access" ON public.vault_registry FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Content Access" ON public.content_items;
CREATE POLICY "Public Content Access" ON public.content_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Licenses Access" ON public.purchased_licenses;
CREATE POLICY "Public Licenses Access" ON public.purchased_licenses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Requirements Access" ON public.requirements;
CREATE POLICY "Public Requirements Access" ON public.requirements FOR ALL USING (true) WITH CHECK (true);
