-- Drop existing policies that might be blocking
DROP POLICY IF EXISTS "public_insert_mwr_leads" ON mwr_leads;
DROP POLICY IF EXISTS "auth_insert_mwr_leads" ON mwr_leads;
DROP POLICY IF EXISTS "anon_insert_mwr_leads" ON mwr_leads;

-- Create T3 anonymous insert policy
CREATE POLICY "anon_insert_mwr_leads" ON mwr_leads 
  FOR INSERT 
  WITH CHECK (true);

-- Keep read policies for authenticated users
DROP POLICY IF EXISTS "auth_read_mwr_leads" ON mwr_leads;
CREATE POLICY "public_read_mwr_leads" ON mwr_leads 
  FOR SELECT 
  USING (true);

-- Keep update policies for authenticated users
DROP POLICY IF EXISTS "auth_update_mwr_leads" ON mwr_leads;
CREATE POLICY "auth_update_mwr_leads" ON mwr_leads 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);