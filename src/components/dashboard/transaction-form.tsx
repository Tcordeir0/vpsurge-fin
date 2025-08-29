import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Transaction = Database["public"]["Tables"]["transacoes"]["Row"];

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      const { data, error } = await supabase
        .from("transacoes")
        .select("*")
        .order("quando", { ascending: false });
      if (!error && data) setTransactions(data);
      setLoading(false);
    }
    fetchTransactions();
  }, []);

  // Opcional: função para recarregar manualmente
  const reload = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transacoes")
      .select("*")
      .order("quando", { ascending: false });
    if (!error && data) setTransactions(data);
    setLoading(false);
  };

  return { transactions, loading, reload };
}
