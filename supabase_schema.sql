-- ============================================================
-- PinIT Exchange & PinIT Hub — Supabase Database & Storage Schema
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)
-- ============================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.users (
  pinit_id TEXT PRIMARY KEY,
  exchange_id TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'creator',
  kyc_status TEXT DEFAULT 'verified',
  biometric_verified INTEGER DEFAULT 1,
  seller_plan TEXT DEFAULT 'pro',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.hub_assets (
  asset_id TEXT PRIMARY KEY,
  pinit_id TEXT NOT NULL REFERENCES public.users(pinit_id),
  title TEXT NOT NULL,
  file_type TEXT NOT NULL,
  vertical TEXT NOT NULL,
  preview_url TEXT,
  vault_encrypted INTEGER DEFAULT 1,
  dna_record_id TEXT NOT NULL,
  human_percent INTEGER NOT NULL,
  ai_percent INTEGER NOT NULL,
  badge_tier TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.listings (
  listing_id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL REFERENCES public.hub_assets(asset_id),
  pinit_id TEXT NOT NULL REFERENCES public.users(pinit_id),
  title TEXT NOT NULL,
  description TEXT,
  vertical TEXT NOT NULL,
  tags TEXT,
  price_personal NUMERIC DEFAULT 49,
  price_commercial NUMERIC DEFAULT 149,
  price_exclusive NUMERIC DEFAULT 899,
  price_enterprise NUMERIC DEFAULT 2499,
  ai_training_opt_out INTEGER DEFAULT 1,
  status TEXT DEFAULT 'live',
  badge_tier TEXT NOT NULL,
  human_percent INTEGER NOT NULL,
  ai_percent INTEGER NOT NULL,
  dna_hash TEXT NOT NULL,
  views INTEGER DEFAULT 142,
  saves INTEGER DEFAULT 18,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.orders_sealed (
  seal_id TEXT PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  listing_id TEXT NOT NULL REFERENCES public.listings(listing_id),
  asset_id TEXT NOT NULL REFERENCES public.hub_assets(asset_id),
  seller_pinit_id TEXT NOT NULL REFERENCES public.users(pinit_id),
  seller_exchange_id TEXT NOT NULL,
  buyer_pinit_id TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_org TEXT,
  license_tier TEXT NOT NULL,
  price_paid NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL,
  creator_net NUMERIC NOT NULL,
  dna_hash_summary TEXT NOT NULL,
  license_terms_version TEXT DEFAULT 'v2.1-provenance',
  status TEXT DEFAULT 'sealed',
  sealed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.requirements (
  req_id TEXT PRIMARY KEY,
  buyer_name TEXT NOT NULL,
  buyer_org TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  vertical TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  deadline TEXT NOT NULL,
  proposals_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.tracking_jobs (
  job_id TEXT PRIMARY KEY,
  seal_id TEXT NOT NULL REFERENCES public.orders_sealed(seal_id),
  asset_id TEXT NOT NULL REFERENCES public.hub_assets(asset_id),
  seller_pinit_id TEXT NOT NULL REFERENCES public.users(pinit_id),
  status TEXT DEFAULT 'active_monitoring',
  matches_found INTEGER DEFAULT 0,
  last_checked TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Storage Buckets (Supabase Storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public-previews', 'public-previews', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('vault-masters', 'vault-masters', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Read Access for Previews" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'public-previews');

CREATE POLICY "Public Upload Access for Previews" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'public-previews');

-- 3. Initial Seed Data
INSERT INTO public.users (pinit_id, exchange_id, name, email, role, kyc_status, biometric_verified, seller_plan, bio)
VALUES ('PINIT-90481234', 'PX-772091', 'Elena Rostova', 'elena.rostova@pinit.io', 'creator', 'verified', 1, 'enterprise_pro', 'Award-winning architectural photographer and digital artist creating high-provenance visual assets.')
ON CONFLICT (pinit_id) DO NOTHING;

INSERT INTO public.users (pinit_id, exchange_id, name, email, role, kyc_status, biometric_verified, seller_plan, bio)
VALUES ('PINIT-33109284', 'PX-441802', 'Marcus Vance', 'marcus.vance@studio.io', 'creator', 'verified', 1, 'pro', 'Cinematographer & 3D Environment Designer specializing in verified virtual production.')
ON CONFLICT (pinit_id) DO NOTHING;

INSERT INTO public.hub_assets (asset_id, pinit_id, title, file_type, vertical, preview_url, vault_encrypted, dna_record_id, human_percent, ai_percent, badge_tier)
VALUES 
  ('HA-9001', 'PINIT-90481234', 'Cybernetic Neo-Tokyo Architecture', 'image', 'images', 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80', 1, 'DNA-9001-A', 95, 5, 'Gold'),
  ('HA-9002', 'PINIT-90481234', 'Nordic Fjord Drone Survey 8K', 'video', 'video', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', 1, 'DNA-9002-B', 98, 2, 'Gold'),
  ('HA-9003', 'PINIT-90481234', 'Quantum Computing Core UI Component System', 'ui_ux', 'ui_ux', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', 1, 'DNA-9003-C', 75, 25, 'Silver')
ON CONFLICT (asset_id) DO NOTHING;

INSERT INTO public.listings (listing_id, asset_id, pinit_id, title, description, vertical, tags, price_personal, price_commercial, price_exclusive, price_enterprise, ai_training_opt_out, status, badge_tier, human_percent, ai_percent, dna_hash, views, saves)
VALUES 
  ('L-101', 'HA-9001', 'PINIT-90481234', 'Cybernetic Neo-Tokyo Architecture', 'Hyper-detailed futuristic cityscape photographed under blue twilight.', 'images', 'cyberpunk,architecture,tokyo', 79, 249, 1299, 3499, 1, 'live', 'Gold', 95, 5, '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d', 342, 45),
  ('L-102', 'HA-9002', 'PINIT-90481234', 'Nordic Fjord Drone Survey 8K', 'Raw 8K RED aerial drone footage.', 'video', 'drone,fjord,nature,8k', 129, 399, 1899, 4999, 1, 'live', 'Gold', 98, 2, '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d', 289, 38)
ON CONFLICT (listing_id) DO NOTHING;
