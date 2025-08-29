-- Criar tabela para usuários autorizados
CREATE TABLE public.usuarios_autorizados (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  nome text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  ativo boolean NOT NULL DEFAULT true
);

-- Habilitar RLS
ALTER TABLE public.usuarios_autorizados ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura apenas para usuários autenticados
CREATE POLICY "Usuários podem ver apenas próprio perfil"
ON public.usuarios_autorizados
FOR SELECT
USING (auth.uid() IS NOT NULL AND email = auth.email());

-- Inserir o usuário autorizado
INSERT INTO public.usuarios_autorizados (email, nome) 
VALUES ('talysmatheus12@gmail.com', 'Talys Matheus');