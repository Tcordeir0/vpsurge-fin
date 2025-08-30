-- First, let's remove the foreign key constraint if it exists
ALTER TABLE public.transacoes DROP CONSTRAINT IF EXISTS transacoes_user_fkey;

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