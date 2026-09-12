import { money, fmtDate, computeTotals } from "../lib/calculations";

export default function InvoicePreview({
  invoice,
  onField,
  onItemField,
  onPrint,
  onSave,
  onOpenLoad,
  onNew,
  saving
}) {
  const currencySymbol = invoice.currency || "₹";
  const totals = computeTotals(invoice.items, invoice.discRate, invoice.gstRate);
  const showGstRows = totals.gstRate > 0;

  const handleEdit = (field) => (e) => {
    if (onField) {
      onField(field, e.currentTarget.innerText);
    }
  };

  return (
    <div className="stage">
      <div className="stage-inner">
        <div className="sheet" id="sheet">
          <div className="sheet-inner">
            <div className="doc-head">
              <div className="logo-mark">
                <div>
                  <div
                    className="co-name"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleEdit("coName")}
                    placeholder="Company Name"
                  >
                    {invoice.coName || "Company Name"}
                  </div>
                  <div
                    className="co-tag"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleEdit("coTagline")}
                    placeholder="Tax Invoice & Billing"
                  >
                    {invoice.coTagline || "Tax Invoice & Billing"}
                  </div>
                </div>
              </div>
              <div className="doc-title">
                {(invoice.lblCustId !== "" || invoice.custId !== "") && (
                  <div>
                    <span contentEditable suppressContentEditableWarning onBlur={handleEdit("lblCustId")}>
                      {invoice.lblCustId ?? "CUSTOMER ID"}
                    </span>
                    {(invoice.lblCustId !== "" || invoice.custId !== "") && ": "}
                    <b contentEditable suppressContentEditableWarning onBlur={handleEdit("custId")}>
                      {invoice.custId || "—"}
                    </b>
                  </div>
                )}
                {(invoice.lblInvDate !== "" || invoice.invDate !== "") && (
                  <div>
                    <span contentEditable suppressContentEditableWarning onBlur={handleEdit("lblInvDate")}>
                      {invoice.lblInvDate ?? "DATE"}
                    </span>
                    {(invoice.lblInvDate !== "" || invoice.invDate !== "") && ": "}
                    <b>{fmtDate(invoice.invDate)}</b>
                  </div>
                )}
                {(invoice.lblDueDate !== "" || invoice.dueDate !== "") && (
                  <div>
                    <span contentEditable suppressContentEditableWarning onBlur={handleEdit("lblDueDate")}>
                      {invoice.lblDueDate ?? "DUE DATE"}
                    </span>
                    {(invoice.lblDueDate !== "" || invoice.dueDate !== "") && ": "}
                    <b>{invoice.dueDate ? fmtDate(invoice.dueDate) : "—"}</b>
                  </div>
                )}
                {(invoice.lblPoNo || invoice.poNo) && (
                  <div>
                    <span contentEditable suppressContentEditableWarning onBlur={handleEdit("lblPoNo")}>
                      {invoice.lblPoNo ?? "PO / REF NO"}
                    </span>:{" "}
                    <b contentEditable suppressContentEditableWarning onBlur={handleEdit("poNo")}>
                      {invoice.poNo || "—"}
                    </b>
                  </div>
                )}
                {(invoice.lblClient !== "" || invoice.clName !== "") && (
                  <div>
                    <span contentEditable suppressContentEditableWarning onBlur={handleEdit("lblClient")}>
                      {invoice.lblClient ?? "CLIENT"}
                    </span>
                    {(invoice.lblClient !== "" || invoice.clName !== "") && ": "}
                    <b contentEditable suppressContentEditableWarning onBlur={handleEdit("clName")}>
                      {invoice.clName || "—"}
                    </b>
                  </div>
                )}
              </div>
            </div>

            <div
              className="co-meta"
              contentEditable
              suppressContentEditableWarning
              onBlur={handleEdit("coAddr")}
              placeholder="Company Address..."
            >
              {invoice.coAddr || "Company Address..."}
            </div>

            <div className="items-wrap">
              <svg className="items-watermark" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="10" width="26" height="280" rx="4" fill="#2f8a63" opacity="0.12" />
                <rect x="56" y="40" width="18" height="250" rx="4" fill="#2f8a63" opacity="0.08" />
                <rect x="84" y="70" width="30" height="220" rx="5" fill="#2f8a63" opacity="0.14" />
                <rect x="124" y="20" width="16" height="270" rx="4" fill="#2f8a63" opacity="0.08" />
                <rect x="150" y="90" width="22" height="200" rx="4" fill="#2f8a63" opacity="0.10" />
              </svg>
              <table className="items">
                <thead>
                  <tr>
                    <th contentEditable suppressContentEditableWarning onBlur={handleEdit("lblItemDesc")}>
                      {invoice.lblItemDesc || "Item / Service description"}
                    </th>
                    <th className="num" style={{ width: 60 }} contentEditable suppressContentEditableWarning onBlur={handleEdit("lblQty")}>
                      {invoice.lblQty || "Qty"}
                    </th>
                    <th className="num" style={{ width: 140 }} contentEditable suppressContentEditableWarning onBlur={handleEdit("lblRate")}>
                      {invoice.lblRate || "Rate"}
                    </th>
                    <th className="num" style={{ width: 140 }} contentEditable suppressContentEditableWarning onBlur={handleEdit("lblTotal")}>
                      {invoice.lblTotal || "Total"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(invoice.items || []).map((it, i) => {
                    const amt = (Number(it.qty) || 0) * (Number(it.rate) || 0);
                    return (
                      <tr key={i}>
                        <td>
                          <div className="desc-main">
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => onItemField && onItemField(i, "desc", e.currentTarget.innerText)}
                            >
                              {it.desc || "Item description..."}
                            </span>
                          </div>
                        </td>
                        <td
                          className="num"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => onItemField && onItemField(i, "qty", parseFloat(e.currentTarget.innerText) || 0)}
                        >
                          {String(it.qty ?? 0).padStart(2, "0")}
                        </td>
                        <td
                          className="num"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const val = parseFloat(e.currentTarget.innerText.replace(/[^0-9.]/g, "")) || 0;
                            if (onItemField) onItemField(i, "rate", val);
                          }}
                        >
                          {money(it.rate, currencySymbol)}
                        </td>
                        <td className="num">{money(amt, currencySymbol)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="totals">
                <table>
                  <tbody>
                    {totals.discPct > 0 && (
                      <tr>
                        <td className="tk">Discount ({totals.discPct}%)</td>
                        <td className="tv">-{money(totals.discAmt, currencySymbol)}</td>
                      </tr>
                    )}
                    {showGstRows && (
                      <>
                        <tr>
                          <td className="tk">CGST ({totals.gstHalf}%)</td>
                          <td className="tv">{money(totals.cgst, currencySymbol)}</td>
                        </tr>
                        <tr>
                          <td className="tk">SGST ({totals.gstHalf}%)</td>
                          <td className="tv">{money(totals.sgst, currencySymbol)}</td>
                        </tr>
                      </>
                    )}
                    <tr className="grand">
                      <td>Grand total</td>
                      <td className="tv">{money(totals.grand, currencySymbol)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lower">
              <div>
                <div
                  className="block-title"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleEdit("lblPayTerms")}
                >
                  {invoice.lblPayTerms || "PAYMENT TERMS"}
                </div>
                <div
                  className="terms"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleEdit("terms")}
                >
                  {invoice.terms || "Type payment terms..."}
                </div>
                <div
                  className="block-title"
                  style={{ marginTop: 16 }}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleEdit("lblNotes")}
                >
                  {invoice.lblNotes || "NOTES"}
                </div>
                <div
                  className="notes"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleEdit("notes")}
                >
                  {invoice.notes || "Type invoice notes..."}
                </div>
              </div>
              <div>
                <div
                  className="block-title"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleEdit("lblBankDetails")}
                >
                  {invoice.lblBankDetails || "BANK / PAYMENT DETAILS"}
                </div>
                <div className="bank">
                  <div>
                    <b contentEditable suppressContentEditableWarning onBlur={handleEdit("lblBankName")}>
                      {invoice.lblBankName || "Bank/Account"}
                    </b>:{" "}
                    <span contentEditable suppressContentEditableWarning onBlur={handleEdit("bankName")}>
                      {invoice.bankName || "—"}
                    </span>
                  </div>
                  <div>
                    <b contentEditable suppressContentEditableWarning onBlur={handleEdit("lblBankAcc")}>
                      {invoice.lblBankAcc || "A/C No."}
                    </b>:{" "}
                    <span contentEditable suppressContentEditableWarning onBlur={handleEdit("bankAcc")}>
                      {invoice.bankAcc || "—"}
                    </span>
                  </div>
                  <div>
                    <b contentEditable suppressContentEditableWarning onBlur={handleEdit("lblBankIfsc")}>
                      {invoice.lblBankIfsc || "IFSC / Code"}
                    </b>:{" "}
                    <span contentEditable suppressContentEditableWarning onBlur={handleEdit("bankIfsc")}>
                      {invoice.bankIfsc || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="signoff">
              <div
                className="stamp"
                contentEditable
                suppressContentEditableWarning
                onBlur={handleEdit("lblFooterNotice")}
              >
                {invoice.lblFooterNotice || "This is a computer-generated invoice."}
              </div>
              <div
                className="sig-line"
                contentEditable
                suppressContentEditableWarning
                onBlur={handleEdit("lblSignoff")}
              >
                {invoice.lblSignoff || "Authorised Signatory"}
              </div>
            </div>
          </div>
          <div className="foot-strip">
            <span className="phone">📞 <span contentEditable suppressContentEditableWarning onBlur={handleEdit("coPhone")}>{invoice.coPhone || "Contact"}</span></span>
            <span contentEditable suppressContentEditableWarning onBlur={handleEdit("coName")}>{invoice.coName || "InvoicePro"}</span>
            {invoice.sinceYear && <span className="since">EST. <span contentEditable suppressContentEditableWarning onBlur={handleEdit("sinceYear")}>{invoice.sinceYear}</span></span>}
          </div>
        </div>

        <div className="preview-toolbar" style={{ marginTop: 24 }}>
          <button className="btn btn-primary" type="button" onClick={onPrint}>Print / Export PDF</button>
          <button className="btn btn-ghost" type="button" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save to Cloud"}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onOpenLoad}>Load saved invoices</button>
          <button className="btn btn-ghost" type="button" onClick={onNew}>New blank invoice</button>
        </div>
      </div>
    </div>
  );
}

