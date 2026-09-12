import { UNITS, BUSINESS_TYPES, emptyItem } from "../lib/calculations";

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
  onApplyPreset,
  onSaveTemplate,
  onLoadTemplate,
  saving,
}) {
  const set = (field) => (e) => onField(field, e.target.value);

  return (
    <div className="panel" id="panel">
      <div className="brand"><div className="mark"></div><h1>InvoicePro</h1></div>
      <div className="brand-sub">Universal Business Billing &amp; Template Generator</div>

      <fieldset>
        <legend>Your Company / Business</legend>
        <label>Company / Business Name</label>
        <input value={invoice.coName || ""} onChange={set("coName")} placeholder="e.g. Apex Enterprises" />
        
        <div className="row2">
          <div>
            <label>Business Tagline / Subtitle</label>
            <input value={invoice.coTagline || ""} onChange={set("coTagline")} placeholder="e.g. Consulting & Trading" />
          </div>
          <div>
            <label>Currency Symbol</label>
            <select value={invoice.currency || "Rs. "} onChange={set("currency")}>
              <option value="Rs. ">Rs. (LKR - Sri Lankan Rupee)</option>
              <option value="₹">₹ (INR - Indian Rupee)</option>
              <option value="$">$ (USD - US Dollar)</option>
              <option value="€">€ (EUR - Euro)</option>
              <option value="£">£ (GBP - British Pound)</option>
              <option value="AED ">AED (UAE Dirham)</option>
              <option value="SAR ">SAR (Saudi Riyal)</option>
              <option value="QAR ">QAR (Qatari Riyal)</option>
              <option value="OMR ">OMR (Omani Rial)</option>
              <option value="BHD ">BHD (Bahraini Dinar)</option>
              <option value="KWD ">KWD (Kuwaiti Dinar)</option>
              <option value="SGD ">SGD (Singapore Dollar)</option>
              <option value="MYR ">MYR (Malaysian Ringgit)</option>
              <option value="AUD ">A$ (Australian Dollar)</option>
              <option value="CAD ">C$ (Canadian Dollar)</option>
              <option value="CHF ">CHF (Swiss Franc)</option>
              <option value="¥">¥ (JPY / CNY)</option>
              <option value="৳">৳ (BDT - Bangladeshi Taka)</option>
              <option value="₨">₨ (PKR - Pakistani Rupee)</option>
            </select>
          </div>
        </div>

        <label>Address</label>
        <textarea value={invoice.coAddr || ""} onChange={set("coAddr")} placeholder="Full company address..." />
        <div className="row2">
          <div><label>Phone</label><input value={invoice.coPhone || ""} onChange={set("coPhone")} /></div>
          <div><label>Email</label><input value={invoice.coEmail || ""} onChange={set("coEmail")} /></div>
        </div>
        <div className="row2">
          <div><label>GSTIN / Tax ID</label><input value={invoice.coGst || ""} onChange={set("coGst")} /></div>
          <div><label>Since (Year)</label><input value={invoice.sinceYear || ""} onChange={set("sinceYear")} /></div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Bill To (Client / Customer)</legend>
        <label>Client / Company Name</label>
        <input value={invoice.clName || ""} onChange={set("clName")} placeholder="Client name..." />
        <label>Client Address</label>
        <textarea value={invoice.clAddr || ""} onChange={set("clAddr")} placeholder="Client address..." />
        <div className="row2">
          <div><label>Client GSTIN / Tax ID</label><input value={invoice.clGst || ""} onChange={set("clGst")} /></div>
          <div><label>Client Contact</label><input value={invoice.clPhone || ""} onChange={set("clPhone")} /></div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Invoice Details</legend>
        <div className="row2">
          <div><label>Invoice No.</label><input value={invoice.invNo || ""} onChange={set("invNo")} /></div>
          <div><label>Customer ID / Code</label><input value={invoice.custId || ""} onChange={set("custId")} /></div>
        </div>
        <div><label>PO / Reference No.</label><input value={invoice.poNo || ""} onChange={set("poNo")} /></div>
        <div className="row2">
          <div><label>Invoice Date</label><input type="date" value={invoice.invDate || ""} onChange={set("invDate")} /></div>
          <div><label>Due Date</label><input type="date" value={invoice.dueDate || ""} onChange={set("dueDate")} /></div>
        </div>
        <div className="row2">
          <div><label>GST / Tax Rate (%)</label><input type="number" min="0" step="0.5" value={invoice.gstRate ?? 0} onChange={set("gstRate")} /></div>
          <div><label>Discount (%)</label><input type="number" min="0" step="0.5" value={invoice.discRate ?? 0} onChange={set("discRate")} /></div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Line Items</legend>
        <div className="items-list">
          {(invoice.items || []).map((it, idx) => (
            <div className="item-card" key={idx}>
              <button type="button" className="del" title="Remove" onClick={() => onRemoveItem(idx)}>✕</button>
              <label>Item / Service Description</label>
              <textarea
                style={{ minHeight: 36 }}
                value={it.desc || ""}
                onChange={(e) => onItemField(idx, "desc", e.target.value)}
                placeholder="Product or service details..."
              />
              <div className="item-grid">
                <div>
                  <label>Qty</label>
                  <input
                    type="number"
                    step="0.01"
                    value={it.qty ?? 0}
                    onChange={(e) => onItemField(idx, "qty", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label>Unit</label>
                  <select value={it.unit || "nos"} onChange={(e) => onItemField(idx, "unit", e.target.value)}>
                    {UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Rate ({invoice.currency || "₹"})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={it.rate ?? 0}
                    onChange={(e) => onItemField(idx, "rate", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-add" type="button" onClick={() => onAddItem(emptyItem())}>
          + Add line item
        </button>
        <div className="hint">Amount is calculated automatically as Qty × Rate.</div>
      </fieldset>

      <fieldset>
        <legend>Notes, Terms &amp; Payment Details</legend>
        <label>Invoice Notes</label>
        <textarea value={invoice.notes || ""} onChange={set("notes")} placeholder="Thank you for your business..." />
        <label>Payment Terms</label>
        <textarea value={invoice.terms || ""} onChange={set("terms")} placeholder="Payment due within 15 days..." />
        <label>Bank / Payment Method Name</label>
        <input value={invoice.bankName || ""} onChange={set("bankName")} placeholder="e.g. HDFC Bank / UPI / PayPal" />
        <div className="row2">
          <div><label>Account / Details</label><input value={invoice.bankAcc || ""} onChange={set("bankAcc")} /></div>
          <div><label>IFSC / SWIFT / Code</label><input value={invoice.bankIfsc || ""} onChange={set("bankIfsc")} /></div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Custom Field Labels (Customize Text &amp; Headings)</legend>
        <div className="row2">
          <div><label>Customer ID Label</label><input value={invoice.lblCustId || "CUSTOMER ID"} onChange={set("lblCustId")} /></div>
          <div><label>Invoice Date Label</label><input value={invoice.lblInvDate || "DATE"} onChange={set("lblInvDate")} /></div>
        </div>
        <div className="row2">
          <div><label>Due Date Label</label><input value={invoice.lblDueDate || "DUE DATE"} onChange={set("lblDueDate")} /></div>
          <div><label>PO / Reference Label</label><input value={invoice.lblPoNo || "PO / REF NO"} onChange={set("lblPoNo")} /></div>
        </div>
        <div className="row2">
          <div><label>Client Heading Label</label><input value={invoice.lblClient || "CLIENT"} onChange={set("lblClient")} /></div>
          <div><label>Item Description Header</label><input value={invoice.lblItemDesc || "Item / Service description"} onChange={set("lblItemDesc")} /></div>
        </div>
        <div className="row2">
          <div><label>Qty Column Header</label><input value={invoice.lblQty || "Qty"} onChange={set("lblQty")} /></div>
          <div><label>Rate Column Header</label><input value={invoice.lblRate || "Rate"} onChange={set("lblRate")} /></div>
        </div>
        <div className="row2">
          <div><label>Total Column Header</label><input value={invoice.lblTotal || "Total"} onChange={set("lblTotal")} /></div>
          <div><label>Signoff Text</label><input value={invoice.lblSignoff || "Authorised Signatory"} onChange={set("lblSignoff")} /></div>
        </div>
        <div className="row2">
          <div><label>Payment Terms Title</label><input value={invoice.lblPayTerms || "PAYMENT TERMS"} onChange={set("lblPayTerms")} /></div>
          <div><label>Notes Title</label><input value={invoice.lblNotes || "NOTES"} onChange={set("lblNotes")} /></div>
        </div>
        <div className="row2">
          <div><label>Bank Details Title</label><input value={invoice.lblBankDetails || "BANK / PAYMENT DETAILS"} onChange={set("lblBankDetails")} /></div>
          <div><label>Bank / Account Label</label><input value={invoice.lblBankName || "Bank/Account"} onChange={set("lblBankName")} /></div>
        </div>
        <div className="row2">
          <div><label>Account No. Label</label><input value={invoice.lblBankAcc || "A/C No."} onChange={set("lblBankAcc")} /></div>
          <div><label>IFSC / Code Label</label><input value={invoice.lblBankIfsc || "IFSC / Code"} onChange={set("lblBankIfsc")} /></div>
        </div>
      </fieldset>

      <fieldset>
        <legend>My Custom Templates</legend>
        <div className="template-actions">
          <button className="btn btn-ghost" type="button" onClick={onSaveTemplate}>
            ⭐ Save as Default Template
          </button>
          <button className="btn btn-ghost" type="button" onClick={onLoadTemplate}>
            📂 Load Default Template
          </button>
        </div>
        <div className="hint" style={{ marginTop: 6 }}>
          Save your business details & layout preferences locally so you can reuse your custom template anytime for free!
        </div>
      </fieldset>

    </div>
  );
}

