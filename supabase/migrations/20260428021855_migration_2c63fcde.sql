-- 1. Tabla de plantillas de retos (gestionada por admin)
CREATE TABLE IF NOT EXISTS challenge_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  duration_hours INTEGER DEFAULT 24,
  protocols JSONB NOT NULL, -- Array de {id, label, points}
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de progreso de usuarios (cada usuario tiene su instancia)
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES challenge_templates(id),
  started_at TIMESTAMPTZ NOT NULL,
  protocols_completed JSONB NOT NULL DEFAULT '[]', -- Array de protocol IDs completados
  copy_count INTEGER DEFAULT 0,
  leads_captured INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, completed, expired
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, started_at)
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_challenge_templates_active ON challenge_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_user_challenge_progress_user ON user_challenge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenge_progress_status ON user_challenge_progress(status);

-- 4. RLS Policies
ALTER TABLE challenge_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;

-- Template: Admin puede editar, todos pueden leer las activas
CREATE POLICY "admin_manage_templates" ON challenge_templates 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "users_read_active_templates" ON challenge_templates 
  FOR SELECT USING (is_active = true);

-- Progress: Usuarios solo ven/editan su propio progreso, admin ve todo
CREATE POLICY "users_own_progress" ON user_challenge_progress 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "admin_view_all_progress" ON user_challenge_progress 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 5. Plantilla por defecto (migración de los protocolos actuales)
INSERT INTO challenge_templates (name, description, protocols, is_active)
VALUES (
  'Reto 24 Horas',
  'Protocolo estándar de productividad diaria',
  '[
    {"id": "1", "label": "Contactar 3 prospectos nuevos", "points": 10},
    {"id": "2", "label": "Publicar contenido de valor", "points": 10},
    {"id": "3", "label": "Hacer seguimiento a leads", "points": 10},
    {"id": "4", "label": "Compartir link en 2 plataformas", "points": 10},
    {"id": "5", "label": "Estudiar material de capacitación", "points": 10}
  ]'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- 6. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_challenge_templates_updated_at
  BEFORE UPDATE ON challenge_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_challenge_progress_updated_at
  BEFORE UPDATE ON user_challenge_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();