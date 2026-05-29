export default function handleAuthSuccess(user) {
  navigate('/marketplace')

  
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
        color: "#fff",
        textAlign: "center",
        padding: 24,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');`}</style>

      <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8 }}>
        Welcome to Student Slide
        <span style={{ color: "#a78bfa" }}>!</span>
      </h1>

      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginBottom: 32 }}>
        You're logged in{user?.username ? ` as ${user.username}` : ""} — marketplace coming soon.
      </p>

      <button
        onClick={onLogout}
        style={{
          padding: "12px 32px",
          background: "linear-gradient(135deg, #7c6af7, #a855f7)",
          border: "none",
          borderRadius: 10,
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Log Out
      </button>
    </div>
  );
}