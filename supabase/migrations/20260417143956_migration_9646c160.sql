-- 1. Crear trigger para auto-crear profiles cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, ambassador_active)
  VALUES (NEW.id, NEW.email, 'ambassador', false)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Eliminar trigger anterior si existe y crear uno nuevo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created 
  AFTER INSERT ON auth.users 
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();