ALTER TABLE profiles 
ADD COLUMN mwr_link text NULL;

COMMENT ON COLUMN profiles.mwr_link IS 'MWR Life affiliate link for redirecting users to join (e.g., https://www.mwrlife.com/username/join)';