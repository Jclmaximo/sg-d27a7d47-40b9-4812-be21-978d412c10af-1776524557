CREATE TABLE IF NOT EXISTS mwr_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  nivel_mwr TEXT NOT NULL CHECK (nivel_mwr IN ('nuevo', 'activo', 'lider')),
  estado TEXT DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'interesado', 'cerrado', 'perdido')),
  notas TEXT,
  referrer_username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mwr_leads_email ON mwr_leads(email);
CREATE INDEX IF NOT EXISTS idx_mwr_leads_estado ON mwr_leads(estado);
CREATE INDEX IF NOT EXISTS idx_mwr_leads_created_at ON mwr_leads(created_at DESC);

ALTER TABLE mwr_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_mwr_leads" ON mwr_leads 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "auth_read_mwr_leads" ON mwr_leads 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_mwr_leads" ON mwr_leads 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);