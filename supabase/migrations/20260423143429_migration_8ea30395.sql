-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Usuarios pueden ver avatares" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden subir avatares" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus avatares" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus avatares" ON storage.objects;

-- Create permissive policies for authenticated users
CREATE POLICY "Usuarios pueden ver avatares"
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles');

CREATE POLICY "Usuarios pueden subir avatares"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profiles' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Usuarios pueden actualizar sus avatares"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profiles' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Usuarios pueden eliminar sus avatares"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profiles' 
  AND auth.role() = 'authenticated'
);