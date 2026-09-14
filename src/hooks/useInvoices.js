import { useCallback, useState } from "react";
import { supabase } from "../supabaseClient";

/**
 * Wraps Supabase CRUD for the `invoices` table.
 * Table shape (see supabase/schema.sql):
 *   id uuid, user_id uuid, inv_no text, data jsonb, created_at, updated_at
 */
export function useInvoices(userId) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshList = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("invoices")
      .select("id, inv_no, data, updated_at")
      .eq("user_id", userId) // defense-in-depth: scope to current user even if RLS is bypassed
      .order("updated_at", { ascending: false });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setList(data || []);
  }, [userId]);

  const saveInvoice = useCallback(
    async (invoiceId, invoiceData) => {
      if (!userId) throw new Error("Not signed in");
      const displayName = invoiceData.titleName
        ? `${invoiceData.titleName} (${invoiceData.invNo || "No Inv#"})`
        : (invoiceData.invNo || "Untitled");
      const payload = {
        user_id: userId,
        inv_no: displayName,
        data: invoiceData,
        updated_at: new Date().toISOString(),
      };

      if (invoiceId) {
        const { data, error: err } = await supabase
          .from("invoices")
          .update(payload)
          .eq("id", invoiceId)
          .eq("user_id", userId) // defense-in-depth: can't overwrite another user's row
          .select("id")
          .single();
        if (err) throw err;
        return data.id;
      }

      const { data, error: err } = await supabase
        .from("invoices")
        .insert(payload)
        .select("id")
        .single();
      if (err) throw err;
      return data.id;
    },
    [userId]
  );

  const loadInvoice = useCallback(async (invoiceId) => {
    if (!userId) throw new Error("Not signed in");
    const { data, error: err } = await supabase
      .from("invoices")
      .select("id, data")
      .eq("id", invoiceId)
      .eq("user_id", userId) // defense-in-depth: prevent loading another user's invoice by ID
      .single();
    if (err) throw err;
    return data;
  }, [userId]);

  const deleteInvoice = useCallback(async (invoiceId) => {
    if (!userId) throw new Error("Not signed in");
    const { error: err } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoiceId)
      .eq("user_id", userId); // defense-in-depth: prevent deleting another user's row by ID
    if (err) throw err;
  }, [userId]);

  return { list, loading, error, refreshList, saveInvoice, loadInvoice, deleteInvoice };
}
