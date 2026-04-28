-- Add challenge tracking columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS challenge_start_time timestamp with time zone NULL,
ADD COLUMN IF NOT EXISTS challenge_active boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS challenge_copy_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS challenge_protocols jsonb DEFAULT '[]'::jsonb;

-- Add comment to document the new columns
COMMENT ON COLUMN profiles.challenge_start_time IS 'When the 24h challenge was started';
COMMENT ON COLUMN profiles.challenge_active IS 'Whether the 24h challenge is currently active';
COMMENT ON COLUMN profiles.challenge_copy_count IS 'Number of times the user has copied their funnel link';
COMMENT ON COLUMN profiles.challenge_protocols IS 'State of the daily protocol checklist (array of protocol objects)';