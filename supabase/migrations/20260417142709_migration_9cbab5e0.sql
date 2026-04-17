-- Agregar campo role a profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'ambassador' CHECK (role IN ('admin', 'ambassador'));

-- Crear índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Comentar la columna
COMMENT ON COLUMN profiles.role IS 'User role: admin (super admin) or ambassador (regular user)';