import { useState } from "react";
import AuthLayout from "../Component/AuthLayout";

export default function SignUpPage({ onNext }) {
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({
    name: "", surname: "", email: "", password: "", confirm: "",
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    setError("");
  }

  function switchMode(next) {
    setMode(next);
    setError("");
  }

  async function handleSignUp(e) {
    e.preventDefault();
    if (!form.name.trim())            return setError("Please enter your name.");
    if (!form.surname.trim())         return setError("Please enter your surname.");
    if (!form.email.includes("@"))    return setError("Please enter a valid email.");
    if (form.password.length < 6)     return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onNext({
      mode: "register",
      username: form.email,
      name: form.name.trim(),
      surname: form.surname.trim(),
      color: "",
    });
  }

  async function handleSignIn(e) {
    e.preventDefault();
    if (!loginForm.email.includes("@")) return setError("Please enter a valid email.");
    if (!loginForm.password)            return setError("Please enter your password.");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onNext({ mode: "login", username: loginForm.email, color: "" });
  }

  return (
    <AuthLayout>
      <div className="ss-tabs" role="tablist">
        {["signup", "signin"].map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={mode === tab}
            className={`ss-tab ${mode === tab ? "on" : ""}`}
            onClick={() => switchMode(tab)}
          >
            {tab === "signup" ? "Sign Up" : "Sign In"}
          </button>
        ))}
      </div>

      {mode === "signup" ? (
        <form onSubmit={handleSignUp} className="ss-form">
          <div className="ss-form-row">
            <div>
              <label className="ss-label">Student Name</label>
              <input className="ss-input" placeholder="Please enter name" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className="ss-label">Student Surname</label>
              <input className="ss-input" placeholder="Please enter surname" value={form.surname} onChange={(e) => set("surname", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="ss-label">Student Email</label>
            <input className="ss-input" type="email" placeholder="Please enter email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>

          <div>
            <label className="ss-label">Password</label>
            <input className="ss-input" type="password" placeholder="••••••••" value={form.password} onChange={(e) => set("password", e.target.value)} />
          </div>

          <div>
            <label className="ss-label">Confirm Password</label>
            <input className="ss-input" type="password" placeholder="••••••••" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} />
          </div>

          {error && <p className="ss-form-error">{error}</p>}

          <button type="submit" className="ss-btn ss-btn--primary ss-btn--block" disabled={loading}>
            {loading ? "Creating account…" : "Sign Up"}
          </button>

          <div className="ss-divider">OR</div>

          <p className="ss-switch">
            Already have an account?{" "}
            <button type="button" onClick={() => switchMode("signin")}>Sign In</button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignIn} className="ss-form">
          <div>
            <label className="ss-label">Student Email</label>
            <input
              className="ss-input" type="email" placeholder="Please enter email"
              value={loginForm.email}
              onChange={(e) => { setLoginForm((f) => ({ ...f, email: e.target.value })); setError(""); }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label className="ss-label" style={{ marginBottom: 0 }}>Password</label>
              <button type="button" className="ss-forgot">Forgot?</button>
            </div>
            <input
              className="ss-input" type="password" placeholder="••••••••"
              value={loginForm.password}
              onChange={(e) => { setLoginForm((f) => ({ ...f, password: e.target.value })); setError(""); }}
            />
          </div>

          {error && <p className="ss-form-error">{error}</p>}

          <button type="submit" className="ss-btn ss-btn--primary ss-btn--block" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <div className="ss-divider">OR</div>

          <p className="ss-switch">
            Don't have an account?{" "}
            <button type="button" onClick={() => switchMode("signup")}>Sign Up</button>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
