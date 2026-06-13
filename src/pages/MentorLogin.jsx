import { useState } from "react";

export default function MentorLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const trimmed = username.trim().toLowerCase();

    if (!trimmed) {
      setErrorMsg("لطفاً نام‌کاربری رهیار را وارد کنید.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/nil-project/api/mentor-login.php?username=${encodeURIComponent(trimmed)}`
      );

      const result = await response.json();

      if (!result.success || !result.mentor) {
        setErrorMsg("این نام‌کاربری در لیست رهیارها یافت نشد.");
        setLoading(false);
        return;
      }

      const data = result.mentor;

      onLogin({
        username: data.username,
        role: data.role || "mentor",
        canViewAll:
          data.can_view_all === true ||
          data.can_view_all === 1 ||
          data.can_view_all === "1" ||
          data.can_view_all === "true",
        mentorId: data.id,
        full_name: data.full_name,
      });

    } catch (err) {
      console.error("Mentor login error:", err);
      setErrorMsg("مشکل در ارتباط با سرور.");
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        background: "linear-gradient(135deg, #1A5BFF, #6A00D4 60%, #00C2A8)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "360px",
          padding: "28px 24px",
          borderRadius: "18px",
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 12px 34px rgba(0,0,0,0.15)",
          border: "1px solid rgba(226,232,240,0.9)",
        }}
      >
        <h2
          style={{
            margin: "0 0 18px",
            fontSize: "20px",
            fontWeight: "800",
            textAlign: "center",
            color: "#111827",
          }}
        >
          ورود رهیار فراگیری
        </h2>

        <label
          style={{
            display: "block",
            fontSize: "13px",
            marginBottom: "6px",
            color: "#374151",
          }}
        >
          نام‌کاربری رهیار
        </label>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder=""
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: "14px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.6)",
            marginBottom: "12px",
          }}
        />

        {errorMsg && (
          <p
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "6px 8px",
              borderRadius: "8px",
              fontSize: "12px",
              marginBottom: "12px",
            }}
          >
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #1A5BFF, #6A00D4)",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {loading ? "در حال بررسی..." : "ورود به پنل رهیار"}
        </button>
      </form>
    </div>
  );
}
