-- Add avatar_url column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;