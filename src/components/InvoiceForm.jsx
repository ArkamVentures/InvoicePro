import { UNITS, emptyItem } from "../lib/calculations";

export default function InvoiceForm({
  invoice,
  onField,
  onItemField,
  onAddItem,
  onRemoveItem,
  onPrint,
  onSave,
  onOpenLoad,
  onNew,
  saving,
}) {
  const set = (field) => (e) => onField(field, e.target.value);

  return (
    <div className="panel" id="panel">
      <div className="brand"><div className="mark"></div><h1>InvoicePro</h1></div>
      <div className="brand-sub">Aluminium Fabrication Billing</div>

      <fieldset>
        <legend>Your Company</legend>
        <label>Company Name</label>
        <input value={invoice.coName} onChange={set("coName")} />
        <label>Address</label>
        <textarea value={invoice.coAddr} onChange={set("coAddr")} />
        <div className="row2">
          <div><label>Phone</label><input value={invoice.coPhone} onChange={set("coPhone")} /></div>
          <div><label>Email</label><input value={invoice.coEmail} onChange={set("coEmail")} /></div>
        </div>
        <div className="row2">
          <div><label>GSTIN</label><input value={invoice.coGst} onChange={set("coGst")} /></div>
          <div><label>Since (year)</label><input value={invoice.sinceYear} onChange={set("sinceYear")} /></div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Bill To</legend>
        <label>Client / Site Name</label>
        <input value={invoice.clName} onChange={set("clName")} />
        <label>Client Address</label>
        <textarea value={invoice.clAddr} onChange={set("clAddr")} />
        <div className="row2">
          <div><label>Client GSTIN</label><input value={invoice.clGst} onChange={set("clGst")} /></div>
          <div><label>Contact</label><input value={invoice.clPhone} onChange={set("clPhone")} /></div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Invoice Details</legend>
        <div className="row2">
          <div><label>Invoice No.</label><input value={invoice.invNo} onChange={set("invNo")} /></div>
          <div><label>Customer ID</label><input value={invoice.custId} onChange={set("custId")} /></div>
        </div>
        <div><label>PO / Ref No.</label><input value={invoice.poNo} onChange={set("poNo")} /></div>
        <div className="row2">
          <div><label>Invoice Date</label><input type="date" value={invoice.invDate} onChange={set("invDate")} /></div>
          <div><label>Due Date</label><input type="date" value={invoice.dueDate} onChange={set("dueDate")} /></div>
        </div>
        <div className="row2">
          <div><label>GST Rate (%)</label><input type="number" min="0" step="0.5" value={invoice.gstRate} onChange={set("gstRate")} /></div>
          <div><label>Discount (%)</label><input type="number" min="0" step="0.5" value={invoice.discRate} onChange={set("discRate")} /></div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Line Items</legend>
        <div className="items-list">
          {invoice.items.map((it, idx) => (
            <div className="item-card" key={idx}>
              <button type="button" className="del" title="Remove" onClick={() => onRemoveItem(idx)}>✕</button>
              <label>Description</label>
              <textarea
                style={{ minHeight: 36 }}
                value={it.desc}
                onChange={(e) => onItemField(idx, "desc", e.target.value)}
              />
              <div className="item-grid">
                <div>
                  <label>Qty</label>
                  <input
                    type="number"
                    step="0.01"
                    value={it.qty}
                    onChange={(e) => onItemField(idx, "qty", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label>Unit</label>
                  <select value={it.unit} onChange={(e) => onItemField(idx, "unit", e.target.value)}>
                    {UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Rate (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={it.rate}
                    onChange={(e) => onItemField(idx, "rate", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-add" type="button" onClick={() => onAddItem(emptyItem())}>
          + Add fabrication item
        </button>
        <div className="hint">Rate is per unit (sqft / rft / kg / nos, as chosen per item). Amount is calculated automatically.</div>
      </fieldset>

      <fieldset>
        <legend>Notes, Terms &amp; Bank Details</legend>
        <label>Notes</label>
        <textarea value={invoice.notes} onChange={set("notes")} />
        <label>Payment Terms</label>
        <textarea value={invoice.terms} onChange={set("terms")} />
        <label>Bank Name</label>
        <input value={invoice.bankName} onChange={set("bankName")} />
        <div className="row2">
          <div><label>Account No.</label><input value={invoice.bankAcc} onChange={set("bankAcc")} /></div>
          <div><label>IFSC</label><input value={invoice.bankIfsc} onChange={set("bankIfsc")} /></div>
        </div>
      </fieldset>

      <div className="actions">
        <button className="btn btn-primary" type="button" onClick={onPrint}>Print / Save as PDF</button>
        <button className="btn btn-ghost" type="button" onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save invoice"}
        </button>
        <button className="btn btn-ghost" type="button" onClick={onOpenLoad}>Load saved invoices</button>
        <button className="btn btn-ghost" type="button" onClick={onNew}>New invoice</button>
      </div>
    </div>
  );
}
