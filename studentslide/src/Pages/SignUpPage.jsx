import { useState, useEffect, useRef } from "react";

const COLORS = ["#7c6af7", "#a855f7", "#ec4899", "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6"];

function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const blobs = [
      { x: 0.15, y: 0.3, r: 320, color: "#4c1d95", speed: 0.0008 },
      { x: 0.85, y: 0.7, r: 280, color: "#7c1d4f", speed: 0.001 },
      { x: 0.5, y: 0.85, r: 250, color: "#1e1b4b", speed: 0.0012 },
      { x: 0.7, y: 0.2, r: 200, color: "#312e81", speed: 0.0009 },
    ];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function draw() {
      t += 1;
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blobs.forEach((b, i) => {
        const ox = Math.sin(t * b.speed + i * 1.2) * 80;
        const oy = Math.cos(t * b.speed * 0.8 + i * 0.9) * 60;
        const cx = b.x * canvas.width + ox;
        const cy = b.y * canvas.height + oy;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r);
        grad.addColorStop(0, b.color + "cc");
        grad.addColorStop(1, b.color + "00");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    />
  );
}


export default function SignUpPage({ onNext }) {
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    setError("");
  }

  async function handleSignUp(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.surname.trim()) return setError("Please enter your surname.");
    if (!form.email.includes("@")) return setError("Please enter a valid email.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);

    
    onNext({ mode: "register", username: form.email, color: "" });
  }

  async function handleSignIn(e) {
    e.preventDefault();
    if (!loginForm.email.includes("@")) return setError("Please enter a valid email.");
    if (!loginForm.password) return setError("Please enter your password.");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    
    onNext({ mode: "login", username: loginForm.email, color: "" });
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.07)",
    border: "1.5px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: "12px 14px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
        position: "relative",
        zIndex: 1,
        padding: "24px 16px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap');
        input::placeholder { color: rgba(255,255,255,0.35); }
        input:focus { border-color: rgba(160,130,255,0.6) !important; background: rgba(255,255,255,0.1) !important; }
        .ss-btn { transition: all 0.2s; }
        .ss-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .ss-btn:active { transform: scale(0.98); }
        .ss-tab { transition: all 0.2s; cursor: pointer; }
        .ss-tab:hover { color: #fff; }
      `}</style>

      <AnimatedBackground />

      <div>
        <img src="./assets/StudentSlide_Logo_Full.png" alt="Student Slide" />
      </div>

      <div
        style={{
          background: "rgba(20, 18, 32, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "32px 36px",
          width: "100%",
          maxWidth: 480,
          position: "relative",
          zIndex: 2,
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, margin: "0 0 2px" }}>
            Welcome to
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -0.5,
            }}
          >
            Student Slide
            <span style={{ color: "#a78bfa" }}>!</span>
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 10,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {["signup", "signin"].map((tab) => (
            <button
              key={tab}
              className="ss-tab"
              onClick={() => { setMode(tab); setError(""); }}
              style={{
                flex: 1,
                padding: "8px 0",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                background: mode === tab ? "rgba(124,106,247,0.85)" : "transparent",
                color: mode === tab ? "#fff" : "rgba(255,255,255,0.45)",
                boxShadow: mode === tab ? "0 2px 8px rgba(124,106,247,0.4)" : "none",
              }}
            >
              {tab === "signup" ? "Sign Up" : "Sign In"}
            </button>
          ))}
        </div>

        {mode === "signup" ? (
          <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, marginBottom: 6, letterSpacing: 0.3 }}>
                  Student Name
                </label>
                <input
                  style={inputStyle}
                  placeholder="Please enter name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, marginBottom: 6, letterSpacing: 0.3 }}>
                  Student Surname
                </label>
                <input
                  style={inputStyle}
                  placeholder="Please enter surname"
                  value={form.surname}
                  onChange={(e) => set("surname", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, marginBottom: 6, letterSpacing: 0.3 }}>
                Student Email
              </label>
              <input
                style={inputStyle}
                type="email"
                placeholder="Please enter email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, marginBottom: 6, letterSpacing: 0.3 }}>
                Password
              </label>
              <input
                style={inputStyle}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, marginBottom: 6, letterSpacing: 0.3 }}>
                Confirm Password
              </label>
              <input
                style={inputStyle}
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
              />
            </div>

            {error && (
              <p style={{ margin: 0, color: "#f87171", fontSize: 13, textAlign: "center" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="ss-btn"
              disabled={loading}
              style={{
                marginTop: 4,
                padding: "13px 0",
                background: "linear-gradient(135deg, #7c6af7, #a855f7)",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontSize: 15,
                fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontFamily: "inherit",
                letterSpacing: 0.3,
              }}
            >
              {loading ? "Creating account…" : "Sign Up"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
            </div>

            <p style={{ textAlign: "center", margin: 0, color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
              Already have an account?{" "}
              <span onClick={() => setMode("signin")} style={{ color: "#a78bfa", fontWeight: 700, cursor: "pointer" }}>
                Sign In
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, marginBottom: 6, letterSpacing: 0.3 }}>
                Student Email
              </label>
              <input
                style={inputStyle}
                type="email"
                placeholder="Please enter email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, marginBottom: 6, letterSpacing: 0.3 }}>
                Password
              </label>
              <input
                style={inputStyle}
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>

            <div style={{ textAlign: "right", marginTop: -6 }}>
              <span style={{ color: "#a78bfa", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                Forgot password?
              </span>
            </div>

            {error && (
              <p style={{ margin: 0, color: "#f87171", fontSize: 13, textAlign: "center" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="ss-btn"
              disabled={loading}
              style={{
                marginTop: 4,
                padding: "13px 0",
                background: "linear-gradient(135deg, #7c6af7, #a855f7)",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontSize: 15,
                fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontFamily: "inherit",
                letterSpacing: 0.3,
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
            </div>

            <p style={{ textAlign: "center", margin: 0, color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
              Don't have an account?{" "}
              <span onClick={() => setMode("signup")} style={{ color: "#a78bfa", fontWeight: 700, cursor: "pointer" }}>
                Sign Up
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
