import { useEffect, useRef, useState } from "react";
import { supabase, supabaseConfigured } from "./supabaseClient";
import { defaultInvoice } from "./lib/calculations";
import { useInvoices } from "./hooks/useInvoices";
import Auth from "./components/Auth";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";
import SavedInvoicesModal from "./components/SavedInvoicesModal";

const TEMPLATE_STORAGE_KEY = "invoicepro_custom_template";
const DRAFT_STORAGE_KEY = "invoicepro_active_draft";

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = not checked yet, null = signed out
  const [activeTab, setActiveTab] = useState("edit"); // mobile view tab: 'edit' or 'preview'
  const [leftWidth, setLeftWidth] = useState(() => {
    const saved = localStorage.getItem("invoicepro_panel_width");
    return saved ? Math.max(300, Math.min(700, Number(saved))) : 420;
  });
  const [isResizing, setIsResizing] = useState(false);

  const [invoice, setInvoice] = useState(() => {
    const activeDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (activeDraft) {
      try {
        const parsed = JSON.parse(activeDraft);
        if (parsed && parsed.coName !== "Apex Solutions & Services") {
          return parsed;
        }
      } catch (e) {}
    }
    const savedTemplate = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (savedTemplate) {
      try {
        const parsedT = JSON.parse(savedTemplate);
        if (parsedT && parsedT.coName !== "Apex Solutions & Services") {
          return parsedT;
        }
      } catch (e) {}
    }
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    return defaultInvoice("general");
  });
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [toast, setToast] = useState(null);

  const [isGuest, setIsGuest] = useState(false);

  const userId = session?.user?.id;
  const invoices = useInvoices(userId);

  // Auto-save every keypress / field edit locally instantly
  const storageWarnedRef = useRef(false);
  useEffect(() => {
    if (!invoice) return;
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(invoice));
      storageWarnedRef.current = false; // reset if storage clears up
    } catch (e) {
      // localStorage quota exceeded — warn once, don't crash
      if (!storageWarnedRef.current) {
        storageWarnedRef.current = true;
        flashToast("⚠️ Storage full — auto-save paused. Clear browser data to resume.");
      }
    }
  }, [invoice]);


  useEffect(() => {
    // Skip Supabase auth entirely when env vars are missing — run in offline/guest mode
    if (!supabaseConfigured || !supabase) {
      setSession(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      const newWidth = Math.max(300, Math.min(850, e.clientX));
      setLeftWidth(newWidth);
      localStorage.setItem("invoicepro_panel_width", newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  function flashToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function onField(field, value) {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  }

  function onItemField(idx, field, value) {
    setInvoice((prev) => {
      const items = (prev.items || []).slice();
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, items };
    });
  }

  function onAddItem(item) {
    setInvoice((prev) => ({ ...prev, items: [...(prev.items || []), item] }));
  }

  function onRemoveItem(idx) {
    setInvoice((prev) => ({ ...prev, items: (prev.items || []).filter((_, i) => i !== idx) }));
  }

  function onApplyPreset(bizType) {
    setInvoice(defaultInvoice(bizType));
    setCurrentId(null);
    flashToast(`Loaded ${bizType} preset!`);
  }

  function onSaveTemplate() {
    try {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(invoice));
      flashToast("Saved as default template!");
    } catch (e) {
      flashToast("Failed to save template");
    }
  }

  function onLoadTemplate() {
    const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (!saved) {
      flashToast("No saved custom template found");
      return;
    }
    try {
      setInvoice(JSON.parse(saved));
      setCurrentId(null);
      flashToast("Loaded custom template!");
    } catch (e) {
      flashToast("Could not load template");
    }
  }

  function onNew() {
    setInvoice(defaultInvoice(invoice.bizType || "general"));
    setCurrentId(null);
    flashToast("New blank invoice");
  }

  async function onSave() {
    if (isGuest || !userId) {
      onSaveTemplate();
      return;
    }
    setSaving(true);
    try {
      const id = await invoices.saveInvoice(currentId, invoice);
      setCurrentId(id);
      flashToast("Invoice saved to cloud");
    } catch (err) {
      console.error(err);
      flashToast(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onOpenLoad() {
    if (isGuest || !userId) {
      onLoadTemplate();
      return;
    }
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
    setIsGuest(false);
    if (supabase) await supabase.auth.signOut();
    else setSession(null);
  }

  // When Supabase is not configured and we haven't entered guest mode yet,
  // auto-enter guest mode so the app is fully usable offline.
  if (!supabaseConfigured && !isGuest && session === null) {
    // Silently auto-enter guest mode — no blank screen, no crash
    setTimeout(() => setIsGuest(true), 0);
    return <div className="boot-screen">Loading…</div>;
  }

  if (session === undefined) {
    return <div className="boot-screen">Loading…</div>;
  }

  if (!session && !isGuest) {
    return <Auth onGuestMode={() => setIsGuest(true)} />;
  }

  return (
    <>
      <div className="mobile-tab-bar">
        <button
          className={`mobile-tab-btn ${activeTab === "edit" ? "active" : ""}`}
          onClick={() => setActiveTab("edit")}
        >
          📝 Edit Invoice Form
        </button>
        <button
          className={`mobile-tab-btn ${activeTab === "preview" ? "active" : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          👁️ Live Invoice Preview
        </button>
      </div>

      <div
        className={`app ${isResizing ? "resizing" : ""} mobile-tab-${activeTab}`}
        style={{ gridTemplateColumns: `${leftWidth}px 8px 1fr` }}
      >
        <div className="panel-wrap">
          <div className="session-bar">
            <span className="session-email">{session ? session.user.email : "Guest Mode (Free offline builder)"}</span>
            <button className="session-signout" onClick={signOut}>
              {session ? "Sign out" : "Sign in / Exit guest"}
            </button>
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
            onApplyPreset={onApplyPreset}
            onSaveTemplate={onSaveTemplate}
            onLoadTemplate={onLoadTemplate}
            saving={saving}
          />
        </div>

        <div
          className="resizer-handle"
          onMouseDown={handleMouseDown}
          title="Drag to resize panels"
        >
          <div className="resizer-bar" />
        </div>

        <InvoicePreview
          invoice={invoice}
          onField={onField}
          onItemField={onItemField}
          onPrint={onPrint}
          onSave={onSave}
          onOpenLoad={onOpenLoad}
          onNew={onNew}
          saving={saving}
        />
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

