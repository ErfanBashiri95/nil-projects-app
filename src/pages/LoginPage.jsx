import { useState } from "react";
import MyProjectsPage from "./MyProjectsPage";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [participant, setParticipant] = useState(null);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const trimmed = username.trim();

    if (!trimmed) {
      setError("لطفاً نام کاربری را وارد کنید");
      return;
    }

    try {
      const response = await fetch(
        `/nil-project/api/participant-login.php?username=${encodeURIComponent(trimmed)}`
      );

      const result = await response.json();

      if (!result.success || !result.participant) {
        setError("نام کاربری یافت نشد");
        return;
      }

      setParticipant(result.participant);
    } catch (err) {
      console.error("Login error:", err);
      setError("خطا در ارتباط با سرور");
    }
  }

  if (participant) {
    return (
      <MyProjectsPage
        participantId={participant.id}
        participantName={participant.full_name}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          padding: "32px 28px",
          background: "rgba(255,255,255,0.22)",
          backdropFilter: "blur(18px)",
          borderRadius: "20px",
          boxShadow: "0 18px 45px rgba(15,23,42,0.25)",
          border: "1px solid rgba(255,255,255,0.4)",
        }}
      >
        <h1
          style={{
            margin: "0 0 8px",
            fontSize: "22px",
            fontWeight: 800,
            color: "#0f172a",
            textAlign: "center",
          }}
        >
          ورود به پنل پروژه‌ها
        </h1>

        <p
          style={{
            margin: "0 0 24px",
            fontSize: "13px",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          لطفاً نام کاربری خود را وارد کنید تا به پروژه‌تان دسترسی داشته باشید.
        </p>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "15px",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            نام کاربری
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(148,163,184,0.8)",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#4C8BF5";
              e.target.style.boxShadow = "0 0 0 1px rgba(76,139,245,0.5)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(148,163,184,0.8)";
              e.target.style.boxShadow = "none";
            }}
          />

          {error && (
            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                fontSize: "12px",
                color: "#b91c1c",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "10px 14px",
              borderRadius: "999px",
              border: "none",
              background: "linear-gradient(135deg, #4C8BF5, #7B3FF2)",
              color: "#f9fafb",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(55,65,81,0.35)",
            }}
          >
            ورود
          </button>
        </form>
      </div>
    </div>
  );
}
