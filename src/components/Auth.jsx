import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth({ onGuestMode }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Account created. Check your inbox to confirm your email, then sign in.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="brand"><div className="mark"></div><h1>InvoicePro</h1></div>
        <div className="brand-sub">Universal Business Billing &amp; Invoicing</div>

        <h2 className="auth-title">{mode === "signin" ? "Sign in" : "Create an account"}</h2>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMsg && <div className="auth-error">{errorMsg}</div>}
          {message && <div className="auth-message">{message}</div>}

          <button className="btn btn-primary" type="submit" disabled={busy} style={{ marginTop: 18 }}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button
          type="button"
          className="btn btn-ghost"
          style={{ marginTop: 14, width: "100%" }}
          onClick={onGuestMode}
        >
          ⚡ Continue as Guest (No Login Required)
        </button>

        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setErrorMsg(null);
            setMessage(null);
          }}
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

