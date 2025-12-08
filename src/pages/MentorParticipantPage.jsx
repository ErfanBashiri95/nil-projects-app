import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { MILESTONE_FIELDS } from "../components/MilestoneForm";
import { WEEKLY_TASK_FIELDS } from "../components/WeeklyForm";

export default function MentorParticipantPage({ mentor, participantId }) {
  const [participant, setParticipant] = useState(null);
  const [projects, setProjects] = useState([]);
  const [milestonesByProject, setMilestonesByProject] = useState({});
  const [weeklyByProject, setWeeklyByProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  const isSuper = mentor?.canViewAll === true;

  useEffect(() => {
    if (!participantId) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantId]);

  async function loadAll() {
    setLoading(true);

    // 1) خود شرکت‌کننده
    const { data: pData, error: pErr } = await supabase
      .from("nilproject_participants")
      .select("*")
      .eq("id", participantId)
      .maybeSingle();

    if (pErr) {
      console.error("Error loading participant", pErr);
      alert("خطا در دریافت اطلاعات شرکت‌کننده.");
      setLoading(false);
      return;
    }
    if (!pData) {
      alert("شرکت‌کننده‌ای با این شناسه پیدا نشد.");
      setLoading(false);
      return;
    }

    // 2) در صورت رهیار معمولی، چک کنیم این شرکت‌کننده واقعاً زیرمجموعه‌اش است
    if (!isSuper && pData.mentor_username !== mentor.username) {
      alert("شما مجاز به مشاهده اطلاعات این شرکت‌کننده نیستید.");
      setLoading(false);
      return;
    }

    setParticipant(pData);

    // 3) پروژه‌های این شرکت‌کننده
    const { data: projData, error: projErr } = await supabase
      .from("nilproject_projects")
      .select("*")
      .eq("participant_id", participantId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (projErr) {
      console.error("Error loading projects", projErr);
      alert("خطا در دریافت پروژه‌های این شرکت‌کننده.");
      setLoading(false);
      return;
    }

    setProjects(projData || []);

    const projectIds = (projData || []).map((p) => p.id);
    if (projectIds.length === 0) {
      setMilestonesByProject({});
      setWeeklyByProject({});
      setLoading(false);
      return;
    }

    // 4) مایل‌ستون‌ها
    const { data: msData, error: msErr } = await supabase
      .from("nilproject_milestone_entries")
      .select("*")
      .eq("participant_id", participantId)
      .in("project_id", projectIds)
      .order("created_at", { ascending: false });

    if (msErr) {
      console.error("Error loading milestones", msErr);
      alert("خطا در دریافت مایل‌ستون‌ها.");
      setLoading(false);
      return;
    }

    const msByProj = {};
    (msData || []).forEach((m) => {
      if (!msByProj[m.project_id]) msByProj[m.project_id] = [];
      msByProj[m.project_id].push(m);
    });
    setMilestonesByProject(msByProj);

    // 5) عملکردهای هفتگی
    const { data: wData, error: wErr } = await supabase
      .from("nilproject_weekly_entries")
      .select("*")
      .eq("participant_id", participantId)
      .in("project_id", projectIds)
      .order("week_start", { ascending: false });

    if (wErr) {
      console.error("Error loading weekly entries", wErr);
      alert("خطا در دریافت عملکرد هفتگی.");
      setLoading(false);
      return;
    }

    const wByProj = {};
    (wData || []).forEach((w) => {
      if (!wByProj[w.project_id]) wByProj[w.project_id] = [];
      wByProj[w.project_id].push(w);
    });
    setWeeklyByProject(wByProj);

    setLoading(false);
  }

  function toggleProject(id) {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  }

  function goBack() {
    window.history.back();
  }

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      {/* هدر بالا */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            پروفایل 
          </h1>
          {participant && (
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: "#111827",
              }}
            >
              {participant.full_name} 
            </p>
          )}
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: "#111827",
            }}
          >
            رهیار مشاهده‌کننده: {mentor.username}{" "}
            {isSuper && " ادمین"}
          </p>
        </div>

        <button
          type="button"
          onClick={goBack}
          style={{
            padding: "6px 12px",
            borderRadius: "999px",
            border: "none",
            background: "#e5e7eb",
            color: "#374151",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          بازگشت
        </button>
      </div>

      {loading && <p>در حال بارگذاری...</p>}

      {!loading && projects.length === 0 && (
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            marginTop: "8px",
          }}
        >
          این شرکت‌کننده هنوز هیچ پروژه‌ای ثبت نکرده است.
        </p>
      )}

      {/* لیست پروژه‌ها برای این یادگیرنده */}
      {!loading &&
        projects.map((p) => {
          const msList = milestonesByProject[p.id] || [];
          const wList = weeklyByProject[p.id] || [];

          const expanded = expandedProjectId === p.id;

          // 🔹 اینجا تلاش می‌کنیم گمانه‌زنی را از ستون‌های مختلف احتمالی بخوانیم.
          // اگر اسم ستون‌های تو فرق می‌کند، فقط این valueها را مطابق جدول خودت عوض کن.
          const ideationItems = [
            {
              label: "۱. امکانی که قرار است این پروژه محقق کند چیست؟",
              value: p.q2_possibilities,
            },
            {
              label: "۲. نام پروژه (دوست دارید پروژه شما را چه صدا کنند؟)",
              value: p.title,
            },
            {
              label: "۳. چشم‌انداز یا پیامد معنوی پروژه‌ی خود را روایت کنید.",
              value: p.q4_vision_story,
            },
            {
              label:
                "۴. دقیقا می‌خواهی چه اتفاقی بیفتد؟ (شکل آن آینده‌ای که دوست داری تجربه کنی)",
              value: p.q5_future_experience,
            },
            {
              label: "۵. چه نتایجی می‌خواهی داشته باشد؟ (نتایج مشخص و قابل اندازه‌گیری)",
              value: p.q6_measurable_outcomes,
            },
            {
              label: "۶. مخاطب هدف پروژه کیست؟",
              value: p.q7_target_audience,
            },
            {
              label: "۷. چشم‌انداز تو برای بعد از محقق شدن چیست؟",
              value: p.q8_post_success_vision,
            },
            {
              label: "۸. تو برای این پروژه چه کسی هستی؟",
              value: p.q9_role_statement,
            },
          ].filter((item) => item.value && String(item.value).trim() !== "");
          

          return (
            <div
              key={p.id}
              style={{
                marginTop: "16px",
                padding: "16px 18px",
                borderRadius: "16px",
                background: "#ffffff",
                border: "1px solid rgba(226,232,240,0.9)",
                boxShadow: "0 8px 20px rgba(148,163,184,0.25)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {p.title || "پروژه بدون عنوان"}
                  </h2>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    آخرین به‌روزرسانی:{" "}
                    {p.updated_at
                      ? new Date(p.updated_at).toLocaleString("fa-IR")
                      : p.created_at
                      ? new Date(p.created_at).toLocaleString("fa-IR")
                      : "-"}
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "11px",
                      color: "#9ca3af",
                    }}
                  >
                    تعداد مایل‌ستون‌ها: {msList.length} | فرم‌های هفتگی:{" "}
                    {wList.length}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleProject(p.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "999px",
                    border: "none",
                    background: expanded ? "#e0ecff" : "#1d4ed8",
                    color: expanded ? "#1d4ed8" : "#ffffff",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {expanded ? "بستن جزئیات" : "مشاهده جزئیات پروژه"}
                </button>
              </div>

              {expanded && (
                <div
                  style={{
                    marginTop: "12px",
                    borderTop: "1px dashed rgba(209,213,219,0.9)",
                    paddingTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {/* 🔵 بخش بالایی: گمانه‌زنی پروژه */}
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: "14px",
                      background:
                        "linear-gradient(135deg, rgba(219,234,254,0.95), rgba(221,239,253,0.95))",
                      border: "1px solid rgba(191,219,254,0.9)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 800,
                        color: "#1f2937",
                        marginBottom: "6px",
                      }}
                    >
                      گمانه‌زنی پروژه
                    </div>

                    {ideationItems.length === 0 && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          margin: 0,
                        }}
                      >
                        اطلاعات گمانه‌زنی این پروژه در حال حاضر برای نمایش در
                        این بخش ثبت نشده یا نام ستون‌ها در جدول پروژه متفاوت
                        است.
                      </p>
                    )}

                    {ideationItems.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          marginTop: idx === 0 ? "2px" : "8px",
                          paddingTop: idx === 0 ? "0" : "6px",
                          borderTop:
                            idx === 0
                              ? "none"
                              : "1px dashed rgba(209,213,219,0.9)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#111827",
                            marginBottom: "2px",
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#111827",
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.8,
                          }}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 🟢 پایین: دو ستون مایل‌ستون + عملکرد هفتگی */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.2fr 1fr",
                      gap: "12px",
                    }}
                  >
                    {/* مایل‌ستون‌ها */}
                    <div
                      style={{
                        padding: "10px",
                        borderRadius: "12px",
                        background: "#f9fafb",
                        border: "1px solid rgba(226,232,240,0.9)",
                        maxHeight: "260px",
                        overflowY: "auto",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#111827",
                          marginBottom: "6px",
                        }}
                      >
                        مایل‌ستون‌ها
                      </div>
                      {msList.length === 0 && (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            margin: 0,
                          }}
                        >
                          هنوز مایل‌ستونی برای این پروژه ثبت نشده است.
                        </p>
                      )}

                      {msList.map((entry, idx) => {
                        const created = entry.created_at
                          ? new Date(entry.created_at).toLocaleString("fa-IR")
                          : "";
                        const answers = entry.answers || {};

                        return (
                          <div
                            key={entry.id || idx}
                            style={{
                              marginTop: "8px",
                              padding: "8px",
                              borderRadius: "10px",
                              border: "1px solid rgba(209,213,219,0.9)",
                              background: "#ffffff",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "4px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  color: "#111827",
                                }}
                              >
                                ثبت {idx + 1}{" "}
                                {entry.period_label
                                  ? `(${entry.period_label})`
                                  : ""}
                              </span>
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "#6b7280",
                                }}
                              >
                                {created}
                              </span>
                            </div>

                            {MILESTONE_FIELDS.map((field) => {
                              const value = answers[field.key];
                              if (!value) return null;
                              return (
                                <div
                                  key={field.key}
                                  style={{
                                    marginTop: "4px",
                                    borderTop:
                                      "1px dashed rgba(229,231,235,0.9)",
                                    paddingTop: "3px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      fontWeight: 600,
                                      color: "#111827",
                                    }}
                                  >
                                    {field.label}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: "#111827",
                                      whiteSpace: "pre-wrap",
                                      lineHeight: 1.7,
                                    }}
                                  >
                                    {value}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>

                    {/* عملکرد هفتگی‌ها */}
                    <div
                      style={{
                        padding: "10px",
                        borderRadius: "12px",
                        background: "#fefce8",
                        border: "1px solid rgba(254,240,138,0.9)",
                        maxHeight: "260px",
                        overflowY: "auto",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#92400e",
                          marginBottom: "6px",
                        }}
                      >
                        فرم‌های عملکرد هفتگی
                      </div>
                      {wList.length === 0 && (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            margin: 0,
                          }}
                        >
                          هنوز فرم عملکرد هفتگی برای این پروژه ثبت نشده است.
                        </p>
                      )}

                      {wList.map((entry) => {
                        const created = entry.created_at
                          ? new Date(entry.created_at).toLocaleString("fa-IR")
                          : "";
                        const tasks = entry.tasks || {};
                        const shareTargets = entry.share_targets || "";

                        const definedCount = WEEKLY_TASK_FIELDS.filter(
                          (f) =>
                            tasks[f.key] &&
                            tasks[f.key].text &&
                            tasks[f.key].text.trim()
                        ).length;

                        const doneCount = WEEKLY_TASK_FIELDS.filter(
                          (f) => tasks[f.key] && tasks[f.key].done
                        ).length;

                        return (
                          <div
                            key={entry.id}
                            style={{
                              marginTop: "8px",
                              padding: "8px",
                              borderRadius: "10px",
                              border: "1px solid rgba(253,224,71,0.9)",
                              background: "#fffbeb",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: "6px",
                                marginBottom: "4px",
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "#111827",
                                  }}
                                >
                                  {entry.week_label || "فرم هفتگی"}
                                </div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#6b7280",
                                  }}
                                >
                                  تاریخ ثبت: {created}
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#6b7280",
                                  textAlign: "left",
                                }}
                              >
                                <div>تسک‌های تعریف‌شده: {definedCount}</div>
                                <div>انجام‌شده: {doneCount}</div>
                              </div>
                            </div>

                            <div
                              style={{
                                maxHeight: "120px",
                                overflowY: "auto",
                                borderTop:
                                  "1px dashed rgba(209,213,219,0.9)",
                                paddingTop: "4px",
                              }}
                            >
                              {WEEKLY_TASK_FIELDS.map((field) => {
                                const item = tasks[field.key];
                                if (
                                  !item ||
                                  !item.text ||
                                  !item.text.trim()
                                )
                                  return null;

                                return (
                                  <div
                                    key={field.key}
                                    style={{
                                      marginBottom: "4px",
                                      paddingBottom: "3px",
                                      borderBottom:
                                        "1px dashed rgba(209,213,219,0.6)",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "11px",
                                          fontWeight: 600,
                                          color: "#111827",
                                        }}
                                      >
                                        {field.label}
                                      </span>
                                      <label
                                        style={{
                                          fontSize: "10px",
                                          color: "#374151",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "3px",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={!!item.done}
                                          readOnly
                                        />
                                        انجام شد
                                      </label>
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "11px",
                                        color: "#111827",
                                        whiteSpace: "pre-wrap",
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {item.text}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {shareTargets && (
                              <div
                                style={{
                                  marginTop: "4px",
                                  paddingTop: "4px",
                                  borderTop:
                                    "1px solid rgba(254,240,138,0.9)",
                                  fontSize: "11px",
                                  color: "#111827",
                                  whiteSpace: "pre-wrap",
                                  lineHeight: 1.6,
                                }}
                              >
                                <strong>افرادی که پروژه معرفی شده:</strong>
                                <br />
                                {shareTargets}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
