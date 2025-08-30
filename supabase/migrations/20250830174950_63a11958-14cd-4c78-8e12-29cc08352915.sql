-- Fix transactions by populating user column for existing records where it's NULL
-- This will use a default admin user ID for existing records
UPDATE public.transacoes 
SET "user" = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid 
WHERE "user" IS NULL;

-- Update RLS policy to allow admin access and proper user filtering
DROP POLICY IF EXISTS "Usuários podem ver suas próprias transações" ON public.transacoes;
CREATE POLICY "Usuários podem ver suas próprias transações" 
ON public.transacoes 
FOR SELECT 
USING (
  auth.uid() = "user" OR 
  auth.email() = 'talysmatheus12@gmail.com'
);

-- Add UPDATE policy that was missing
CREATE POLICY "Usuários podem atualizar suas próprias transações" 
ON public.transacoes 
FOR UPDATE 
USING (auth.uid() = "user")
WITH CHECK (auth.uid() = "user");