-- Add mwr_custom_link column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS mwr_custom_link TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.mwr_custom_link IS 'Custom MWR landing page URL (optional) - defaults to https://mwr.hubia.vip/leads-registro?ref=username';