import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function MentorDashboard({ mentor }) {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const isSuper = mentor?.canViewAll === true;

  useEffect(() => {
    if (!mentor?.username) return;
    fetchParticipants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentor?.username]);

  async function fetchParticipants() {
    setLoading(true);

    let query = supabase.from("nilproject_participants").select("*");

    if (!isSuper) {
      // رهیار معمولی فقط گروه خودش را می‌بیند
      query = query.eq("mentor_username", mentor.username);
    }

    const { data, error } = await query.order("full_name", {
      ascending: true,
    });

    if (error) {
      console.error("Error loading participants", error);
      alert("خطا در بارگذاری لیست شرکت‌کننده‌ها");
      setLoading(false);
      return;
    }

    setParticipants(data || []);
    setLoading(false);
  }

  function handleLogout() {
    localStorage.removeItem("mentorInfo");
    window.location.href = "/mentor-login";
  }

  function handleOpenParticipant(p) {
    navigate(`/mentor/user/${p.id}`);
  }

  const filtered = participants.filter((p) => {
    const text = `${p.full_name || ""} ${p.username || ""}`.toLowerCase();
    return text.includes(search.trim().toLowerCase());
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      {/* هدر بالا */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            پنل رهیار
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "13px",
              color: "#111827",
            }}
          >
            خوش آمدی، {mentor?.full_name || mentor?.username}{" "}
            {isSuper && " ادمین"}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "11px",
              color: "#111827",
            }}
          >
            نام کاربری رهیار: {mentor?.username}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            padding: "6px 14px",
            borderRadius: "999px",
            border: "none",
            background: "linear-gradient(135deg, #6A00D4, #1A5BFF)",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(106, 0, 212, 0.35)",
          }}
        >
          خروج
        </button>
      </header>

      {/* نوار جست‌وجو و توضیح */}
      <section
        style={{
          marginBottom: "16px",
          padding: "14px 16px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(226,232,240,0.9)",
          boxShadow: "0 8px 20px rgba(148,163,184,0.3)",
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: "13px",
            color: "#111827",
            lineHeight: 1.7,
          }}
        >
          در این صفحه می‌توانید گروه خود را ببینید و با
          کلیک روی نامشان وارد صفحهٔ پروژه‌ها، مایل‌ستون‌ها و عملکرد هفتگی آن‌ها
          شوید.
        </p>

        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            marginTop: "6px",
          }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جست‌وجو بر اساس نام یا نام کاربری..."
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: "999px",
              border: "1px solid rgba(148,163,184,0.9)",
              fontSize: "13px",
            }}
          />
          <button
            type="button"
            onClick={fetchParticipants}
            style={{
              padding: "7px 14px",
              borderRadius: "999px",
              border: "none",
              background: "#e0ecff",
              color: "#1d4ed8",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            به‌روزرسانی
          </button>
        </div>
      </section>

      {/* لیست شرکت‌کننده‌ها */}
      {loading && <p>در حال بارگذاری لیست شرکت‌کننده‌ها...</p>}

      {!loading && filtered.length === 0 && (
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            marginTop: "8px",
          }}
        >
          هیچ شرکت‌کننده‌ای پیدا نشد.
        </p>
      )}

      {!loading && filtered.length > 0 && (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "12px",
          }}
        >
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleOpenParticipant(p)}
              style={{
                textAlign: "right",
                padding: "12px 14px",
                borderRadius: "16px",
                border: "1px solid rgba(226,232,240,0.9)",
                background: "#ffffff",
                boxShadow: "0 6px 18px rgba(148,163,184,0.3)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "4px",
                }}
              >
                {p.full_name || "بدون نام"}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                نام کاربری: <strong>{p.username}</strong>
              </div>
              {p.group_label && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "#4b5563",
                    marginBottom: "2px",
                  }}
                >
                  گروه: {p.group_label}
                </div>
              )}
              <div
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                }}
              >
                رهیار ثبت‌شده: {p.mentor_username || "-"}
              </div>
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
