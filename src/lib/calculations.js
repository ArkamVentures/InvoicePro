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
  const base = {
    bizType: bizType,
    currency: "₹",
    coName: "Apex Solutions & Services",
    coTagline: "Professional Enterprise Solutions",
    coAddr: "Suite 402, Business Bay Tower\nMG Road, Bengaluru, Karnataka 560001",
    coPhone: "+91 98765 43210",
    coEmail: "billing@apexsolutions.in",
    coGst: "29ABCDE1234F1Z5",
    sinceYear: "2018",
    clName: "Acme Enterprises Ltd.",
    clAddr: "7th Floor, Innovation Park\nWhitefield, Bengaluru, Karnataka 560066",
    clGst: "29XYZAB5678G1Z2",
    clPhone: "+91 99887 66554",
    invNo: "INV-2026-001",
    custId: "CUST-1042",
    poNo: "PO-89210",
    invDate: todayStr(0),
    dueDate: todayStr(15),
    gstRate: 18,
    discRate: 0,
    notes: "Thank you for your business. Please reach out to billing@apexsolutions.in for any queries.",
    terms: "Payment due within 15 days of invoice date. 50% advance on confirmation where applicable.",
    bankName: "HDFC Bank, MG Road Branch",
    bankAcc: "50200012345678",
    bankIfsc: "HDFC0001234",
    items: [
      { desc: "Web Development & Maintenance", qty: 1, unit: "set", rate: 45000 },
      { desc: "Cloud Infrastructure Setup", qty: 1, unit: "hrs", rate: 15000 },
      { desc: "Annual Technical Support", qty: 12, unit: "nos", rate: 2500 },
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

  if (bizType === "aluminium") {
    return {
      ...base,
      coName: "Precision Aluminium Fabricators",
      coTagline: "Aluminium Fabrication & Glazing",
      coAddr: "Plot 14, Industrial Estate Road\nVadodara, Gujarat 390010",
      coEmail: "billing@precisionalum.in",
      coGst: "24AAECP1234F1Z5",
      sinceYear: "1992",
      clName: "Shreeji Constructions Pvt. Ltd.",
      clAddr: "Site Office, Sarkhej-Gandhinagar Hwy\nAhmedabad, Gujarat 380054",
      clGst: "24AAFCS5678G1Z2",
      notes: "All aluminium sections powder-coated as per approved shade card. Thank you for your business.",
      items: [
        { desc: "4 x 4 45mm Casement window", qty: 3, unit: "nos", rate: 56000 },
        { desc: "6 x 5 45mm Casement window", qty: 3, unit: "nos", rate: 105000 },
        { desc: "100mm 5 x 5.5 Double door", qty: 1, unit: "nos", rate: 130000 },
      ],
    };
  }

  return base;
}

