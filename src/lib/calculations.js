export const UNITS = ["sqft", "rft", "kg", "nos", "set", "hr"];

export function money(n) {
  const val = Number.isFinite(n) ? n : 0;
  return "₹" + val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtDate(str) {
  if (!str) return "—";
  const d = new Date(str + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function todayStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/**
 * Given items + discount/gst rates, compute subtotal, discount, cgst/sgst, and grand total.
 */
export function computeTotals(items, discRate, gstRate) {
  const subtotal = items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0);
  const discPct = Number(discRate) || 0;
  const discAmt = (subtotal * discPct) / 100;
  const taxable = subtotal - discAmt;
  const gst = Number(gstRate) || 0;
  const half = (gst / 2).toFixed(2).replace(/\.00$/, "");
  const cgst = (taxable * gst) / 200;
  const sgst = (taxable * gst) / 200;
  const grand = taxable + cgst + sgst;

  return { subtotal, discPct, discAmt, taxable, gstRate: gst, gstHalf: half, cgst, sgst, grand };
}

export function emptyItem() {
  return { desc: "New fabrication item", qty: 1, unit: "sqft", rate: 0 };
}

export function defaultInvoice() {
  return {
    coName: "Precision Aluminium Fabricators",
    coAddr: "Plot 14, Industrial Estate Road\nVadodara, Gujarat 390010",
    coPhone: "+91 98765 43210",
    coEmail: "billing@precisionalum.in",
    coGst: "24AAECP1234F1Z5",
    sinceYear: "1992",
    clName: "Shreeji Constructions Pvt. Ltd.",
    clAddr: "Site Office, Sarkhej-Gandhinagar Hwy\nAhmedabad, Gujarat 380054",
    clGst: "24AAFCS5678G1Z2",
    clPhone: "+91 99887 66554",
    invNo: "PAF-2026-0142",
    custId: "INV0820",
    poNo: "SH-PO-0087",
    invDate: todayStr(0),
    dueDate: todayStr(15),
    gstRate: 0,
    discRate: 0,
    notes: "Thank you for your business. All aluminium sections powder-coated as per approved shade card.",
    terms: "50% advance on order confirmation, balance on delivery. Payment due within 15 days of invoice date. Interest @2% per month on overdue amounts.",
    bankName: "HDFC Bank, Vadodara Industrial Branch",
    bankAcc: "50200012345678",
    bankIfsc: "HDFC0001234",
    items: [
      { desc: "4 x 4 45mm Casement window", qty: 3, unit: "nos", rate: 56000 },
      { desc: "6 x 5 45mm Casement window", qty: 3, unit: "nos", rate: 105000 },
      { desc: "100mm 5 x 5.5 Double door", qty: 1, unit: "nos", rate: 130000 },
      { desc: "100mm 4 x 8.5 Door", qty: 2, unit: "nos", rate: 90000 },
      { desc: "100mm 15 x 10 sliding", qty: 1, unit: "nos", rate: 470000 },
    ],
  };
}
