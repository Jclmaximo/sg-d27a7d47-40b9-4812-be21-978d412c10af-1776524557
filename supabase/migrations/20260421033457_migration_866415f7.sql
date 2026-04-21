-- Eliminar la política restrictiva que requiere autenticación
DROP POLICY IF EXISTS auth_users_insert_leads ON leads;

-- Verificar que quedó solo la política pública
SELECT policyname, cmd, with_check 
FROM pg_policies 
WHERE tablename = 'leads' AND cmd = 'INSERT';