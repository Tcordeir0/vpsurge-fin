-- Enable realtime for transactions table
ALTER TABLE public.transacoes REPLICA IDENTITY FULL;

-- Add the table to realtime publication  
ALTER PUBLICATION supabase_realtime ADD TABLE public.transacoes;