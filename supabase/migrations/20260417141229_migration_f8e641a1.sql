-- Agregar campo username a profiles (único, lowercase, slug-friendly)
ALTER TABLE profiles
ADD COLUMN username TEXT UNIQUE,
ADD COLUMN ambassador_active BOOLEAN DEFAULT false;

-- Crear índice para búsquedas rápidas por username
CREATE INDEX idx_profiles_username ON profiles(username) WHERE username IS NOT NULL;

-- Comentario de documentación
COMMENT ON COLUMN profiles.username IS 'Unique username for ambassador URL (ambassador/username)';
COMMENT ON COLUMN profiles.ambassador_active IS 'Whether user is an active ambassador with funnel access';