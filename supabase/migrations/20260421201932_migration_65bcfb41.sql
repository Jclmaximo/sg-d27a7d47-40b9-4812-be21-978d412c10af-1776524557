-- Add user_id column to mwr_leads table
ALTER TABLE mwr_leads 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_mwr_leads_user_id ON mwr_leads(user_id);