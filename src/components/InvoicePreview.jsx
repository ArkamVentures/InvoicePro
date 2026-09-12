import { money, fmtDate, computeTotals } from "../lib/calculations";

export default function InvoicePreview({ invoice }) {
  const currencySymbol = invoice.currency || "₹";
  const totals = computeTotals(invoice.items, invoice.discRate, invoice.gstRate);
  const showGstRows = totals.gstRate > 0;

  return (
    <div className="stage">
      <div className="sheet" id="sheet">
        <div className="sheet-inner">
          <div className="doc-head">
            <div className="logo-mark">
              <div>
                <div className="co-name">{invoice.coName || "Company Name"}</div>
                <div className="co-tag">{invoice.coTagline || "Tax Invoice & Billing"}</div>
              </div>
            </div>
            <div className="doc-title">
              <div>CUSTOMER ID: <b>{invoice.custId || "—"}</b></div>
              <div>DATE: <b>{fmtDate(invoice.invDate)}</b></div>
              <div>CLIENT: <b>{invoice.clName || "—"}</b></div>
            </div>
          </div>
          <div className="co-meta">{invoice.coAddr}</div>

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
                  <th>Item / Service description</th>
                  <th className="num" style={{ width: 70 }}>Qty</th>
                  <th className="num" style={{ width: 110 }}>Rate</th>
                  <th className="num" style={{ width: 110 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {(invoice.items || []).map((it, i) => {
                  const amt = (Number(it.qty) || 0) * (Number(it.rate) || 0);
                  return (
                    <tr key={i}>
                      <td>
                        <div className="desc-main">
                          {it.desc} <span style={{ fontWeight: 400, color: "var(--steel-light)", fontSize: 12 }}>({it.unit || "nos"})</span>
                        </div>
                      </td>
                      <td className="num">{String(it.qty ?? 0).padStart(2, "0")}</td>
                      <td className="num">{money(it.rate, currencySymbol)}</td>
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
              <div className="block-title">PAYMENT TERMS</div>
              <div className="terms">{invoice.terms}</div>
              <div className="block-title" style={{ marginTop: 16 }}>NOTES</div>
              <div className="notes">{invoice.notes}</div>
            </div>
            <div>
              <div className="block-title">BANK / PAYMENT DETAILS</div>
              <div className="bank">
                <div><b>Bank/Account:</b> <span>{invoice.bankName}</span></div>
                <div><b>A/C No.:</b> <span>{invoice.bankAcc}</span></div>
                <div><b>IFSC / Code:</b> <span>{invoice.bankIfsc}</span></div>
              </div>
            </div>
          </div>

          <div className="signoff">
            <div className="stamp">This is a computer-generated invoice.</div>
            <div className="sig-line">Authorised Signatory</div>
          </div>
        </div>
        <div className="foot-strip">
          <span className="phone">📞 <span>{invoice.coPhone || "Contact"}</span></span>
          <span>{invoice.coName || "InvoicePro"}</span>
          {invoice.sinceYear && <span className="since">EST. <span>{invoice.sinceYear}</span></span>}
        </div>
      </div>
    </div>
  );
}

