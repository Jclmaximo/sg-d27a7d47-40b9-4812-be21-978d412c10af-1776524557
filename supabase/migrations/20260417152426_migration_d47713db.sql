-- Agregar campo whatsapp_number a la tabla profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

COMMENT ON COLUMN profiles.whatsapp_number IS 'WhatsApp number for contacting the user';