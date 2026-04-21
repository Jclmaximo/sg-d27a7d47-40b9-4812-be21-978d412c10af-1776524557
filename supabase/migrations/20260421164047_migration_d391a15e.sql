-- Drop existing restrictive policy
DROP POLICY IF EXISTS "insert_leads" ON leads;

-- Create T3 anonymous insert policy for leads
-- Allows anyone (authenticated or not) to create leads
CREATE POLICY "anon_insert_leads" ON leads 
  FOR INSERT 
  WITH CHECK (true);

-- Also ensure public read for leads (so ambassadors can see their leads)
DROP POLICY IF EXISTS "select_leads" ON leads;
CREATE POLICY "public_read_leads" ON leads 
  FOR SELECT 
  USING (true);