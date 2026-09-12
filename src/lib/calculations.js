export const UNITS = [
  "nos",
  "sqft",
  "rft",
  "kg",
  "set",
  "hrs",
  "days",
  "mtr",
  "pcs",
  "box",
  "pkt",
  "lot"
];

export const BUSINESS_TYPES = [
  { id: "general", label: "General Business / Services" },
  { id: "aluminium", label: "Aluminium Fabrication & Glass" },
  { id: "retail", label: "Retail & Wholesale Trading" },
  { id: "freelance", label: "Freelance, IT & Consulting" },
  { id: "construction", label: "Construction, Real Estate & Contractors" },
  { id: "automotive", label: "Automotive & Vehicle Service" },
  { id: "healthcare", label: "Healthcare & Medical Services" },
  { id: "hospitality", label: "Hotels, Restaurants & Catering" },
  { id: "education", label: "Education & Coaching Services" },
  { id: "logistics", label: "Logistics, Freight & Transport" },
  { id: "custom", label: "✨ Custom Industry (Type Your Own)" },
];

export function money(n, currencySymbol = "₹") {
  const val = Number.isFinite(n) ? n : 0;
  return (currencySymbol || "₹") + val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
export function computeTotals(items = [], discRate = 0, gstRate = 0) {
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
  return { desc: "New Item / Service", qty: 1, unit: "nos", rate: 0 };
}

export function defaultInvoice(bizType = "general") {
  return {
    bizType: bizType,
    currency: "Rs. ",
    coName: "",
    coTagline: "",
    coAddr: "",
    coPhone: "",
    coEmail: "",
    coGst: "",
    sinceYear: "",
    clName: "",
    clAddr: "",
    clGst: "",
    clPhone: "",
    invNo: "",
    custId: "",
    poNo: "",
    invDate: "",
    dueDate: "",
    gstRate: 0,
    discRate: 0,
    notes: "",
    terms: "",
    bankName: "",
    bankAcc: "",
    bankIfsc: "",
    items: [
      { desc: "", qty: 1, unit: "nos", rate: 0 }
    ],
    // Customizable Field Labels
    lblInvTitle: "TAX INVOICE",
    lblCustId: "CUSTOMER ID",
    lblInvDate: "DATE",
    lblDueDate: "DUE DATE",
    lblPoNo: "PO / REF NO",
    lblClient: "CLIENT",
    lblItemDesc: "Item / Service description",
    lblQty: "Qty",
    lblRate: "Rate",
    lblTotal: "Total",
    lblPayTerms: "PAYMENT TERMS",
    lblNotes: "NOTES",
    lblBankDetails: "BANK / PAYMENT DETAILS",
    lblBankName: "Bank/Account",
    lblBankAcc: "A/C No.",
    lblBankIfsc: "IFSC / Code",
    lblSignoff: "Authorised Signatory",
    lblFooterNotice: "This is a computer-generated invoice."
  };
}

