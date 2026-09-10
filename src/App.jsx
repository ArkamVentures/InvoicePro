import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { defaultInvoice } from "./lib/calculations";
import { useInvoices } from "./hooks/useInvoices";
import Auth from "./components/Auth";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";
import SavedInvoicesModal from "./components/SavedInvoicesModal";

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = not checked yet, null = signed out
  const [invoice, setInvoice] = useState(defaultInvoice());
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [toast, setToast] = useState(null);

  const userId = session?.user?.id;
  const invoices = useInvoices(userId);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  function flashToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function onField(field, value) {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  }

  function onItemField(idx, field, value) {
    setInvoice((prev) => {
      const items = prev.items.slice();
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, items };
    });
  }

  function onAddItem(item) {
    setInvoice((prev) => ({ ...prev, items: [...prev.items, item] }));
  }

  function onRemoveItem(idx) {
    setInvoice((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  }

  function onNew() {
    setInvoice(defaultInvoice());
    setCurrentId(null);
    flashToast("New invoice");
  }

  async function onSave() {
    setSaving(true);
    try {
      const id = await invoices.saveInvoice(currentId, invoice);
      setCurrentId(id);
      flashToast("Invoice saved");
    } catch (err) {
      console.error(err);
      flashToast(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onOpenLoad() {
    setShowLoad(true);
    await invoices.refreshList();
  }

  async function onLoad(id) {
    try {
      const row = await invoices.loadInvoice(id);
      setInvoice(row.data);
      setCurrentId(row.id);
      setShowLoad(false);
      flashToast("Invoice loaded");
    } catch (err) {
      console.error(err);
      flashToast("Could not load invoice");
    }
  }

  async function onDelete(id) {
    try {
      await invoices.deleteInvoice(id);
      if (id === currentId) setCurrentId(null);
      await invoices.refreshList();
      flashToast("Invoice deleted");
    } catch (err) {
      console.error(err);
      flashToast("Could not delete invoice");
    }
  }

  function onPrint() {
    window.print();
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (session === undefined) {
    return <div className="boot-screen">Loading…</div>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <>
      <div className="app">
        <div className="panel-wrap">
          <div className="session-bar">
            <span className="session-email">{session.user.email}</span>
            <button className="session-signout" onClick={signOut}>Sign out</button>
          </div>
          <InvoiceForm
            invoice={invoice}
            onField={onField}
            onItemField={onItemField}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
            onPrint={onPrint}
            onSave={onSave}
            onOpenLoad={onOpenLoad}
            onNew={onNew}
            saving={saving}
          />
        </div>
        <InvoicePreview invoice={invoice} />
      </div>

      {showLoad && (
        <SavedInvoicesModal
          list={invoices.list}
          loading={invoices.loading}
          onClose={() => setShowLoad(false)}
          onLoad={onLoad}
          onDelete={onDelete}
        />
      )}

      <div className={"toast" + (toast ? " show" : "")}>{toast}</div>
    </>
  );
}
