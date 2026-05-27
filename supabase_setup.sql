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
