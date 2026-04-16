-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  status TEXT DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'contactado', 'interesado', 'convertido', 'descartado')),
  source TEXT DEFAULT 'funnel',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lead_notes table
CREATE TABLE IF NOT EXISTS lead_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create message_templates table
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
CREATE POLICY "auth_users_select_leads" ON leads FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_users_insert_leads" ON leads FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_users_update_leads" ON leads FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_users_delete_leads" ON leads FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for lead_notes
CREATE POLICY "auth_users_select_notes" ON lead_notes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_users_insert_notes" ON lead_notes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_users_update_notes" ON lead_notes FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_users_delete_notes" ON lead_notes FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for message_templates
CREATE POLICY "auth_users_select_templates" ON message_templates FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_users_insert_templates" ON message_templates FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Insert default message templates
INSERT INTO message_templates (name, template) VALUES
('Primer contacto', 'Hola {name}, soy de Travel Advantage. Vi que te interesa conocer más sobre nuestro club de viajes exclusivo. ¿Tienes unos minutos para platicar?'),
('Seguimiento 1', 'Hola {name}, te escribo para darle seguimiento a tu interés en Travel Advantage. ¿Ya tuviste oportunidad de revisar la información que te compartí?'),
('Seguimiento 2', '{name}, tenemos una promoción especial este mes para nuevos miembros. ¿Te gustaría conocer los detalles?'),
('Recordatorio', 'Hola {name}, solo quería recordarte que estamos aquí para ayudarte a empezar con Travel Advantage cuando estés listo/a. ¿Hay algo que te gustaría saber?'),
('Cierre', '{name}, muchos de nuestros miembros empezaron como tú, con dudas. Hoy están ahorrando miles en sus viajes. ¿Qué te detiene para empezar?');

-- Create function to update leads timestamp
CREATE OR REPLACE FUNCTION update_lead_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for leads
CREATE TRIGGER update_leads_timestamp
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_lead_timestamp();