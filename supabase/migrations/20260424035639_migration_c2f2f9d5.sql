-- Crear tabla de productividad
CREATE TABLE user_productivity (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  contacted_prospects integer DEFAULT 0,
  contacted_prospects_count integer DEFAULT 0,
  did_followup boolean DEFAULT false,
  presented_business boolean DEFAULT false,
  posted_content boolean DEFAULT false,
  attended_training boolean DEFAULT false,
  total_points integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_user_productivity_user_id ON user_productivity(user_id);
CREATE INDEX idx_user_productivity_date ON user_productivity(date DESC);
CREATE INDEX idx_user_productivity_user_date ON user_productivity(user_id, date DESC);

-- RLS Policies
ALTER TABLE user_productivity ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver su propia productividad
CREATE POLICY "Users can view their own productivity"
ON user_productivity FOR SELECT
USING (auth.uid() = user_id);

-- Usuarios pueden insertar su propia productividad
CREATE POLICY "Users can insert their own productivity"
ON user_productivity FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden actualizar su propia productividad
CREATE POLICY "Users can update their own productivity"
ON user_productivity FOR UPDATE
USING (auth.uid() = user_id);

-- Admins pueden ver toda la productividad del equipo
CREATE POLICY "Admins can view all productivity"
ON user_productivity FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Función para calcular puntos automáticamente
CREATE OR REPLACE FUNCTION calculate_productivity_points()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_points := 0;
  
  -- Contacté prospectos: 3 puntos si marcado
  IF NEW.contacted_prospects THEN
    NEW.total_points := NEW.total_points + 3;
  END IF;
  
  -- Hice seguimiento: 2 puntos
  IF NEW.did_followup THEN
    NEW.total_points := NEW.total_points + 2;
  END IF;
  
  -- Presenté el negocio: 5 puntos
  IF NEW.presented_business THEN
    NEW.total_points := NEW.total_points + 5;
  END IF;
  
  -- Publiqué contenido: 3 puntos
  IF NEW.posted_content THEN
    NEW.total_points := NEW.total_points + 3;
  END IF;
  
  -- Me conecté a entrenamiento: 2 puntos
  IF NEW.attended_training THEN
    NEW.total_points := NEW.total_points + 2;
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular puntos automáticamente
CREATE TRIGGER calculate_points_trigger
BEFORE INSERT OR UPDATE ON user_productivity
FOR EACH ROW
EXECUTE FUNCTION calculate_productivity_points();

-- Comentarios para documentación
COMMENT ON TABLE user_productivity IS 'Daily productivity tracking for users';
COMMENT ON COLUMN user_productivity.contacted_prospects IS 'Boolean flag if user contacted prospects';
COMMENT ON COLUMN user_productivity.contacted_prospects_count IS 'Number of prospects contacted';
COMMENT ON COLUMN user_productivity.total_points IS 'Auto-calculated based on activities completed';