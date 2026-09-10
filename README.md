# InvoicePro — React + Vite + Supabase

The original standalone HTML invoice generator, rebuilt as a React app with:
- **Vite** for dev/build tooling
- **Supabase Auth** (email + password) gating access to the app
- **Supabase Postgres** storing each user's invoices (replacing `localStorage`)
- The same visual design, layout, and GST/discount calculation logic as the original

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the SQL Editor, run the contents of `supabase/schema.sql`. This creates the
   `invoices` table and row-level security policies so each user can only see
   their own invoices.
3. In **Authentication > Providers**, make sure **Email** is enabled. By default
   Supabase requires email confirmation on sign-up — you can turn this off under
   **Authentication > Settings** while developing, if you want instant sign-in
   after sign-up.
4. In **Project Settings > API**, copy the **Project URL** and **anon public key**.

## 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Install and run

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## 4. Build for production

```bash
npm run build
npm run preview   # to sanity-check the production build locally
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.),
with the same two `VITE_SUPABASE_*` environment variables set in the host's dashboard.

## How it's wired together

- `src/supabaseClient.js` — single Supabase client instance, reads env vars.
- `src/components/Auth.jsx` — sign in / sign up screen using
  `supabase.auth.signInWithPassword` / `supabase.auth.signUp`.
- `src/App.jsx` — listens to `supabase.auth.onAuthStateChange` to decide whether
  to show the Auth screen or the invoice app, and owns the current invoice state.
- `src/hooks/useInvoices.js` — CRUD wrapper around the `invoices` table
  (list / save / load / delete), scoped to the signed-in user via RLS.
- `src/components/InvoiceForm.jsx` — the left control panel (company, client,
  invoice details, line items, notes/terms/bank).
- `src/components/InvoicePreview.jsx` — the right-hand styled invoice sheet,
  recalculated live from form state (subtotal, discount, CGST/SGST, grand total).
- `src/components/SavedInvoicesModal.jsx` — replaces the old `prompt()`-based
  "Load saved invoices" flow with a proper list backed by Supabase.
- `supabase/schema.sql` — the `invoices` table (`id`, `user_id`, `inv_no`,
  `data jsonb`, timestamps) plus RLS policies restricting rows to their owner.

Each invoice's full form state (company info, client info, line items, terms,
etc.) is stored as a single `jsonb` blob in the `data` column — simple to evolve
without migrations as you add fields.

## Notes

- "Save invoice" inserts a new row the first time, then updates that same row
  on subsequent saves for the same session. Click **New invoice** to start a
  fresh one (next save will insert a new row).
- Printing (`window.print()`) hides the side panel and prints just the invoice
  sheet, same as the original.
