-- Run this SQL in your Supabase dashboard SQL editor to set up the required tables

-- Public palettes table (for Explore page + saved palettes)
CREATE TABLE IF NOT EXISTS public_palettes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Palette',
  colors TEXT[] NOT NULL,
  is_public BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_email TEXT,
  user_name TEXT
);

-- Enable Row Level Security
ALTER TABLE public_palettes ENABLE ROW LEVEL SECURITY;

-- Anyone can read public palettes
CREATE POLICY "Public palettes are viewable by everyone"
  ON public_palettes FOR SELECT
  USING (is_public = true);

-- Authenticated users can read their own palettes (public or private)
CREATE POLICY "Users can read their own palettes"
  ON public_palettes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own palettes
CREATE POLICY "Users can insert their own palettes"
  ON public_palettes FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own palettes
CREATE POLICY "Users can update their own palettes"
  ON public_palettes FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own palettes
CREATE POLICY "Users can delete their own palettes"
  ON public_palettes FOR DELETE
  USING (auth.uid() = user_id);

-- Allow updating likes count for anyone (for the like feature)
CREATE POLICY "Anyone can update likes"
  ON public_palettes FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_public_palettes_is_public ON public_palettes(is_public);
CREATE INDEX IF NOT EXISTS idx_public_palettes_user_id ON public_palettes(user_id);
CREATE INDEX IF NOT EXISTS idx_public_palettes_likes ON public_palettes(likes DESC);

-- Enable Google OAuth in your Supabase dashboard:
-- Authentication > Providers > Google
-- Add your Google OAuth credentials (Client ID & Secret)
-- Set authorized redirect URI: https://cjfasrvjmhkvrmcgrrnw.supabase.co/auth/v1/callback

-- ─────────────────────────────────────────────────────────────────────────────
-- Pro (lifetime) entitlements
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pro_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE pro_users ENABLE ROW LEVEL SECURITY;

-- Users may read their own entitlement so the app can unlock features.
CREATE POLICY "Users read own pro status"
  ON pro_users FOR SELECT
  USING (auth.uid() = user_id);

-- Deliberately NO insert/update/delete policy. Only the service role writes
-- here, and only after a Razorpay signature has been verified server-side,
-- so a client cannot make itself Pro.

-- ─── Save cap: 5 palettes for free accounts, unlimited for Pro ──────────────
-- SECURITY DEFINER is required: a policy on public_palettes that counts rows
-- in public_palettes would recurse through its own RLS. Running the count in a
-- definer function bypasses RLS inside the function and breaks that cycle.
CREATE OR REPLACE FUNCTION can_save_palette(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM pro_users WHERE user_id = uid)
      OR (SELECT count(*) FROM public_palettes WHERE user_id = uid) < 5;
$$;

REVOKE ALL ON FUNCTION can_save_palette(uuid) FROM public;
GRANT EXECUTE ON FUNCTION can_save_palette(uuid) TO anon, authenticated;

-- Replace the insert policy so the cap is enforced by the database, not the UI.
DROP POLICY IF EXISTS "Users can insert their own palettes" ON public_palettes;
CREATE POLICY "Users can insert their own palettes"
  ON public_palettes FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id OR user_id IS NULL)
    AND (user_id IS NULL OR can_save_palette(auth.uid()))
  );

-- SELECT and DELETE policies are intentionally left alone: a user who already
-- has more than 5 saved palettes keeps full access to every one of them and can
-- still delete them. Only adding new ones is capped.
