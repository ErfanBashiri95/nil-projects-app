import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProjectIdeationForm from "../components/ProjectIdeationForm";
import MilestoneForm, { MILESTONE_FIELDS } from "../components/MilestoneForm";
import WeeklyForm, { WEEKLY_TASK_FIELDS } from "../components/WeeklyForm";
import LogoutButton from "../components/LogoutButton";

export default function MyProjectsPage({ participantId, participantName }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // گمانه‌زنی
  const [editingProject, setEditingProject] = useState(null);
  const [showIdeationForm, setShowIdeationForm] = useState(false);
  const [showIdeationIntro, setShowIdeationIntro] = useState(false);

  // مایل‌ستون: ایجاد
  const [milestoneProject, setMilestoneProject] = useState(null);
  const [showMilestoneIntro, setShowMilestoneIntro] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  // مایل‌ستون: مشاهده
  const [viewMilestonesProject, setViewMilestonesProject] = useState(null);
  const [milestoneEntries, setMilestoneEntries] = useState([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);

  // هفتگی: ایجاد
  const [weeklyProject, setWeeklyProject] = useState(null);
  const [showWeeklyIntro, setShowWeeklyIntro] = useState(false);
  const [showWeeklyForm, setShowWeeklyForm] = useState(false);

  // هفتگی: مشاهده
  const [weeklyHistoryProject, setWeeklyHistoryProject] = useState(null);
  const [weeklyEntries, setWeeklyEntries] = useState([]);
  const [weeklyLoading, setWeeklyLoading] = useState(false);

  useEffect(() => {
    if (!participantId) return;
    fetchProjects();
  }, [participantId]);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from("nilproject_projects")
      .select("*")
      .eq("participant_id", participantId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading projects", error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  }

  // ---------- گمانه‌زنی پروژه ----------

  function handleCreateNewProject() {
    setEditingProject(null);
    setShowIdeationForm(false);
    setShowIdeationIntro(true);
  }

  function handleEditProject(project) {
    setEditingProject(project);
    setShowIdeationIntro(false);
    setShowIdeationForm(true);
  }

  async function handleDeleteProject(projectId) {
    if (!window.confirm("از حذف این پروژه مطمئن هستید؟")) return;

    const { error } = await supabase
      .from("nilproject_projects")
      .update({ is_active: false })
      .eq("id", projectId);

    if (error) {
      console.error("Error soft-deleting project", error);
      alert("حذف پروژه با خطا مواجه شد.");
    } else {
      fetchProjects();
    }
  }

  async function handleIdeationFormSubmit(values, projectId) {
    if (projectId) {
      const { error } = await supabase
        .from("nilproject_projects")
        .update(values)
        .eq("id", projectId);

      if (error) {
        console.error("Error updating project", error);
        alert("ویرایش پروژه با خطا مواجه شد.");
        return;
      }
    } else {
      const { error } = await supabase
        .from("nilproject_projects")
        .insert({
          ...values,
          participant_id: participantId,
        });

      if (error) {
        console.error("Error creating project", error);
        alert("ثبت پروژه با خطا مواجه شد.");
        return;
      }
    }

    setShowIdeationForm(false);
    setShowIdeationIntro(false);
    setEditingProject(null);
    fetchProjects();
  }

  function handleIdeationCancel() {
    setShowIdeationForm(false);
    setShowIdeationIntro(false);
    setEditingProject(null);
  }

  // ---------- مایل‌ستون: ثبت ----------

  function handleOpenMilestone(project) {
    setMilestoneProject(project);
    setShowMilestoneForm(false);
    setShowMilestoneIntro(true);
  }

  function handleMilestoneIntroContinue() {
    setShowMilestoneIntro(false);
    setShowMilestoneForm(true);
  }

  function handleMilestoneCancel() {
    setShowMilestoneForm(false);
    setShowMilestoneIntro(false);
    setMilestoneProject(null);
  }

  async function handleMilestoneSubmit(answers) {
    if (!participantId || !milestoneProject) return;

    const { error } = await supabase
      .from("nilproject_milestone_entries")
      .insert({
        participant_id: participantId,
        project_id: milestoneProject.id,
        period_label: "year1_full_plan",
        answers,
      });

    if (error) {
      console.error("Error saving milestone", error);
      alert("ثبت مایل‌ستون با خطا مواجه شد.");
      return;
    }

    alert("فرم مایل‌ستون با موفقیت ثبت شد.");
    setShowMilestoneForm(false);
    setMilestoneProject(null);
  }

  // ---------- مایل‌ستون: مشاهده ----------

  async function handleViewMilestones(project) {
    if (!participantId) return;

    setViewMilestonesProject(project);
    setMilestonesLoading(true);
    setMilestoneEntries([]);

    const { data, error } = await supabase
      .from("nilproject_milestone_entries")
      .select("*")
      .eq("participant_id", participantId)
      .eq("project_id", project.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading milestones", error);
      alert("دریافت مایل‌ستون‌های این پروژه با خطا مواجه شد.");
    } else {
      setMilestoneEntries(data || []);
    }

    setMilestonesLoading(false);
  }

  function handleCloseMilestoneView() {
    setViewMilestonesProject(null);
    setMilestoneEntries([]);
  }

  // ---------- هفتگی: ثبت ----------

  function handleOpenWeekly(project) {
    setWeeklyProject(project);
    setShowWeeklyForm(false);
    setShowWeeklyIntro(true);
  }

  function handleWeeklyIntroContinue() {
    setShowWeeklyIntro(false);
    setShowWeeklyForm(true);
  }

  function handleWeeklyCancel() {
    setShowWeeklyForm(false);
    setShowWeeklyIntro(false);
    setWeeklyProject(null);
  }

  // 🔴 اینجا مهم بود: week_start و share_targets
  async function handleWeeklySubmit({ tasks, share_targets }) {
    if (!participantId || !weeklyProject) return;

    const now = new Date();
    const weekStart = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const weekLabel = `هفته منتهی به ${now.toLocaleDateString("fa-IR")}`;

    const { error } = await supabase
      .from("nilproject_weekly_entries")
      .insert({
        participant_id: participantId,
        project_id: weeklyProject.id,
        week_start: weekStart,
        week_label: weekLabel,
        tasks,
        answers: {}, // اگر در آینده سوالات دیگری اضافه شد
        share_targets, // هم‌نام با ستون دیتابیس
      });

    if (error) {
      console.error("Error saving weekly entry", error);
      alert("ثبت عملکرد هفتگی با خطا مواجه شد.");
      return;
    }

    alert("فرم عملکرد هفتگی با موفقیت ثبت شد.");
    setShowWeeklyForm(false);
    setWeeklyProject(null);
  }

  // ---------- هفتگی: مشاهده/history ----------

  async function handleViewWeeklyHistory(project) {
    if (!participantId) return;

    setWeeklyHistoryProject(project);
    setWeeklyLoading(true);
    setWeeklyEntries([]);

    const { data, error } = await supabase
      .from("nilproject_weekly_entries")
      .select("*")
      .eq("participant_id", participantId)
      .eq("project_id", project.id)
      .order("week_start", { ascending: false });

    if (error) {
      console.error("Error loading weekly entries", error);
      alert("دریافت عملکرد هفتگی‌های این پروژه با خطا مواجه شد.");
    } else {
      setWeeklyEntries(data || []);
    }

    setWeeklyLoading(false);
  }

  function handleCloseWeeklyHistory() {
    setWeeklyHistoryProject(null);
    setWeeklyEntries([]);
  }

  async function handleToggleWeeklyTaskDone(entryId, taskKey, newDone) {
    try {
      // ۱) پیدا کردن ردیف موردنظر در استیت
      const targetEntry = weeklyEntries.find((e) => e.id === entryId);
      if (!targetEntry) return;

      const oldTasks = targetEntry.tasks || {};
      const oldItem = oldTasks[taskKey];
      if (!oldItem) return;

      const newTasks = {
        ...oldTasks,
        [taskKey]: {
          ...oldItem,
          done: newDone,
        },
      };

      // ۲) آپدیت در دیتابیس
      const { data, error } = await supabase
        .from("nilproject_weekly_entries")
        .update({ tasks: newTasks })
        .eq("id", entryId)
        .select("*")
        .single();

      if (error) {
        console.error("Error updating task done:", error);
        alert("به‌روزرسانی وضعیت تسک با خطا مواجه شد.");
        return;
      }

      // ۳) آپدیت استیت لوکال
      setWeeklyEntries((prev) =>
        prev.map((e) => (e.id === entryId ? data : e))
      );
    } catch (err) {
      console.error("Unexpected error in handleToggleWeeklyTaskDone:", err);
      alert("مشکلی در به‌روزرسانی تودولیست رخ داد.");
    }
  }


  // ---------- UI ----------

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      {/* هدر */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
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
            پنل پروژه‌های من
          </h1>
          {participantName && (
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: "#111827",
              }}
            >
              خوش آمدی، {participantName} 🌱
            </p>
          )}
        </div>

        <button
          onClick={handleCreateNewProject}
          style={{
            padding: "8px 18px",
            borderRadius: "999px",
            border: "none",
            background: "linear-gradient(135deg, #1A5BFF, #6A00D4)",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(106, 0, 212, 0.55)",
          }}
        >
          + هم‌آفرینی پروژه جدید
        </button>
      </header>

      {/* کارت مقدمه گمانه‌زنی */}
      {showIdeationIntro && (
        <div
          style={{
            marginBottom: "20px",
            padding: "20px 18px",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 12px 30px rgba(15,23,42,0.25)",
            border: "1px solid rgba(226,232,240,0.9)",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "18px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            شروع هم‌آفرینی پروژه
          </h2>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: "14px",
              color: "#374151",
              lineHeight: 1.7,
            }}
          >
            این پرسشنامه، پیش‌نویس اولیه پروژه‌ی شما می‌باشد.
            لطفاً هر سؤال را کامل پاسخ دهید.
          </p>

          <div
            style={{
              fontSize: "13px",
              color: "#4b5563",
              lineHeight: 1.8,
              marginBottom: "14px",
            }}
          >
            <strong>نکات قابل توجه:</strong>
            <ul style={{ paddingRight: "18px", margin: "8px 0 0" }}>
              <li>می‌توانید چندین پروژه گمانه‌زنی کنید.</li>
              <li>می‌توانید پروژه‌ی خود را چندین بار آپدیت کنید و مجدد فرم را پر کنید.</li>
              <li>در نوشتن،خود را محدود نکنید.</li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              onClick={() => {
                setShowIdeationIntro(false);
                setShowIdeationForm(true);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: "none",
                background: "linear-gradient(135deg, #1A5BFF, #6A00D4)",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ادامه و ورود به پرسشنامه
            </button>
            <button
              type="button"
              onClick={handleIdeationCancel}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: "none",
                background: "#e5e7eb",
                color: "#374151",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              انصراف
            </button>
          </div>
        </div>
      )}

      {/* کارت مقدمه مایل‌ستون */}
      {showMilestoneIntro && milestoneProject && (
        <div
          style={{
            marginBottom: "20px",
            padding: "20px 18px",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 12px 30px rgba(15,23,42,0.25)",
            border: "1px solid rgba(226,232,240,0.9)",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "18px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            کلمه‌ی «مایلستون» (Milestone) در اصل به معنی سنگ‌نشان‌هایی است که در جاده‌ها برای مشخص کردن فاصله‌ها نصب می‌شدند. این نشانه‌ها به مسافران کمک می‌کردند که بدانند چقدر از مسیر را طی کرده‌اند و چقدر تا مقصد باقی مانده است.
          </h2>

          <p
            style={{
              margin: "0 0 10px",
              fontSize: "14px",
              color: "#374151",
              lineHeight: 1.7,
            }}
          >
           در پروژه‌ها نیز مایلستون‌ها همین نقش را دارند: نقاط کلیدی و قابل‌اندازه‌گیری در مسیر اجرای پروژه که رسیدن به آن‌ها نشان‌دهنده‌ی پیشرفت واقعی است. ثبت مایلستون‌ها در این فرم به ما کمک می‌کند تا:

مسیر پروژه را شفاف‌تر ببینیم،

عملکرد تیم و خودمان را ارزیابی کنیم،

برنامه‌ریزی دقیق‌تری داشته باشیم،

و از انحراف مسیر را تشخیص بدیم.

          </p>

          <p
            style={{
              margin: "0 0 8px",
              fontSize: "13px",
              color: "#4b5563",
              lineHeight: 1.7,
            }}
          >
            
          </p>

          <p
            style={{
              margin: "0 0 8px",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            <strong>نکته مهم:</strong>این فرم به عنوان نقشه‌ی راه پروژه عمل می‌کند و ما را در رسیدن گام‌به‌گام به اهداف نهایی یاری می‌دهد.


: شما با پرکردن مایل استون ها محدود یا وابسته به تحقق چیز هایی که گفتید نیستید.<br/>

شما می توانید برای پر کردن فرم هربار از رهیار فراگیری خود کمک بگیرید.

          </p>

          <p
            style={{
              margin: "0 0 8px",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            
          </p>

          <p
            style={{
              margin: "6px 0 10px",
              fontSize: "12px",
              color: "#4b5563",
            }}
          >
            پروژه انتخاب‌شده:{" "}
            <strong>{milestoneProject.title || "پروژه بدون عنوان"}</strong>
          </p>

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              onClick={handleMilestoneIntroContinue}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: "none",
                background: "linear-gradient(135deg, #1A5BFF, #6A00D4)",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ادامه و ورود به فرم مایل‌ستون
            </button>
            <button
              type="button"
              onClick={handleMilestoneCancel}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: "none",
                background: "#e5e7eb",
                color: "#374151",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              انصراف
            </button>
          </div>
        </div>
      )}

      {/* کارت مقدمه عملکرد هفتگی */}
      {showWeeklyIntro && weeklyProject && (
        <div
          style={{
            marginBottom: "20px",
            padding: "20px 18px",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 12px 30px rgba(15,23,42,0.25)",
            border: "1px solid rgba(226,232,240,0.9)",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "18px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            فرم عملکرد هفتگی
          </h2>

          <p
            style={{
              margin: "0 0 8px",
              fontSize: "14px",
              color: "#374151",
              lineHeight: 1.7,
            }}
          >
           
          </p>

          <p
            style={{
              margin: "0 0 8px",
              fontSize: "12px",
              color: "#4b5563",
              lineHeight: 1.7,
            }}
          >
           
          </p>

          <p
            style={{
              margin: "6px 0 10px",
              fontSize: "12px",
              color: "#4b5563",
            }}
          >
            پروژه انتخاب‌شده:{" "}
            <strong>{weeklyProject.title || "پروژه بدون عنوان"}</strong>
          </p>

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              onClick={handleWeeklyIntroContinue}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: "none",
                background: "linear-gradient(135deg, #1A5BFF, #6A00D4)",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              شروع ثبت عملکرد این هفته
            </button>
            <button
              type="button"
              onClick={handleWeeklyCancel}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: "none",
                background: "#e5e7eb",
                color: "#374151",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              انصراف
            </button>
          </div>
        </div>
      )}

      {/* لیست پروژه‌ها */}
      <section>
        {loading && <p>در حال بارگذاری پروژه‌ها...</p>}

        {!loading &&
          projects.length === 0 &&
          !showIdeationIntro &&
          !showIdeationForm && (
            <div
              style={{
                padding: "18px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.9)",
                boxShadow: "0 8px 20px rgba(148,163,184,0.35)",
                fontSize: "14px",
                color: "#4b5563",
              }}
            >
              هنوز هیچ پروژه‌ای ثبت نکرده‌ای. با دکمه «هم‌آفرینی پروژه جدید»
              اولین پروژه‌ات را تعریف کن.
            </div>
          )}

        {!loading &&
          projects.map((p) => (
            <div
              key={p.id}
              style={{
                marginTop: "16px",
                padding: "66px 98px",
                borderRadius: "14px",
                background: "#ffffff",
                boxShadow: "0 6px 16px rgba(148,163,184,0.35)",
                border: "1px solid rgba(226,232,240,0.9)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {p.title || "پروژه بدون عنوان"}
                  </h3>
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
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {/* دکمه‌های مرتبط با پروژه */}
                  <button
                    onClick={() => handleOpenMilestone(p)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      border: "none",
                      background: "#ecfdf5",
                      color: "#15803d",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    ثبت مایل‌ستون جدید
                  </button>

                  <button
                    onClick={() => handleViewMilestones(p)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      border: "none",
                      background: "#ecfdf5",
                      color: "#15803d",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    مشاهده مایل‌ستون‌ها
                  </button>

                  <button
                    onClick={() => handleOpenWeekly(p)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      border: "none",
                      background: "#fefce8",
                      color: "#92400e",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    ثبت عملکرد هفتگی
                  </button>

                  <button
                    onClick={() => handleViewWeeklyHistory(p)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      border: "none",
                      background: "#fefce8",
                      color: "#92400e",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    هفته‌های قبل (عملکرد هفتگی)
                  </button>

                  <button
                    onClick={() => handleEditProject(p)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      border: "none",
                      background: "#e0ecff",
                      color: "#1d4ed8",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    ویرایش پروژه
                  </button>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      border: "none",
                      background: "#fee2e2",
                      color: "#b91c1c",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
      </section>

      {/* فرم گمانه‌زنی */}
      {showIdeationForm && (
        <ProjectIdeationForm
          initialProject={editingProject}
          participantId={participantId}
          onSubmit={handleIdeationFormSubmit}
          onCancel={handleIdeationCancel}
        />
      )}

      {/* فرم مایل‌ستون (ثبت جدید) */}
      {showMilestoneForm && milestoneProject && (
        <MilestoneForm
          project={milestoneProject}
          participantId={participantId}
          onSubmit={handleMilestoneSubmit}
          onCancel={handleMilestoneCancel}
        />
      )}

      {/* نمایش فقط‌خواندنی مایل‌ستون‌ها */}
      {viewMilestonesProject && (
        <MilestoneReadOnlyPanel
          project={viewMilestonesProject}
          entries={milestoneEntries}
          loading={milestonesLoading}
          onClose={handleCloseMilestoneView}
        />
      )}

      {/* فرم عملکرد هفتگی (ثبت جدید) */}
      {showWeeklyForm && weeklyProject && (
        <WeeklyForm
          project={weeklyProject}
          onSubmit={handleWeeklySubmit}
          onCancel={handleWeeklyCancel}
        />
      )}

      {/* پنل هفته‌های قبل (کرگره‌ای) */}
      {weeklyHistoryProject && (
        <WeeklyHistoryPanel
          project={weeklyHistoryProject}
          entries={weeklyEntries}
          loading={weeklyLoading}
          onClose={handleCloseWeeklyHistory}
          onToggleTaskDone={handleToggleWeeklyTaskDone}
        />
      )}

      <LogoutButton onLogout={() => (window.location.href = "/")} />
    </div>
  );
}

// --------------------------
// پنل فقط‌خواندنی مایل‌ستون‌ها
// --------------------------

function MilestoneReadOnlyPanel({ project, entries, loading, onClose }) {
  const containerStyle = {
    marginTop: "24px",
    marginBottom: "32px",
    padding: "18px 16px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.98)",
    boxShadow: "0 10px 28px rgba(15,23,42,0.3)",
    border: "1px solid rgba(226,232,240,0.9)",
    maxHeight: "70vh",
    overflowY: "auto",
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            مایل‌ستون‌های ثبت‌شده
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: "#4b5563",
            }}
          >
            پروژه: <strong>{project.title || "پروژه بدون عنوان"}</strong>
          </p>
        </div>

        <button
          onClick={onClose}
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
          بستن
        </button>
      </div>

      {loading && (
        <p style={{ fontSize: "13px" }}>در حال بارگذاری مایل‌ستون‌ها...</p>
      )}

      {!loading && entries.length === 0 && (
        <p
          style={{
            fontSize: "13px",
            color: "#6b7280",
            marginTop: "4px",
          }}
        >
          هنوز هیچ مایل‌ستونی برای این پروژه ثبت نکرده‌ای.
        </p>
      )}

      {!loading &&
        entries.map((entry, index) => {
          const created = entry.created_at
            ? new Date(entry.created_at).toLocaleString("fa-IR")
            : "";
          const answers = entry.answers || {};

          return (
            <div
              key={entry.id || index}
              style={{
                marginTop: "12px",
                padding: "12px",
                borderRadius: "14px",
                border: "1px solid rgba(226,232,240,0.9)",
                background: "#f9fafb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <div>
                  <strong style={{ fontSize: "13px" }}>
                    ثبت شماره {index + 1}
                  </strong>
                  {entry.period_label && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#6b7280",
                        marginRight: "6px",
                      }}
                    >
                      ({entry.period_label})
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                  }}
                >
                  تاریخ ثبت: {created}
                </span>
              </div>

              {MILESTONE_FIELDS.map((field) => {
                const value = answers[field.key];
                if (!value) return null;

                return (
                  <div
                    key={field.key}
                    style={{
                      marginTop: "8px",
                      paddingTop: "6px",
                      borderTop: "1px dashed rgba(209,213,219,0.9)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#111827",
                        marginBottom: "3px",
                      }}
                    >
                      {field.label}
                    </div>
                    {field.subtitle && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#6b7280",
                          marginBottom: "3px",
                        }}
                      >
                        {field.subtitle}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#111827",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.8,
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
  );
}

// --------------------------
// پنل کرگره‌ای هفته‌های قبل
// --------------------------

function WeeklyHistoryPanel({ project, entries, loading, onClose,onToggleTaskDone }) {
  const containerStyle = {
    marginTop: "24px",
    marginBottom: "32px",
    padding: "18px 16px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.98)",
    boxShadow: "0 10px 28px rgba(15,23,42,0.3)",
    border: "1px solid rgba(226,232,240,0.9)",
    maxHeight: "70vh",
    overflowY: "auto",
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            عملکرد هفتگی‌های ثبت‌شده
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: "#4b5563",
            }}
          >
            پروژه: <strong>{project.title || "پروژه بدون عنوان"}</strong>
          </p>
        </div>

        <button
          onClick={onClose}
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
          بستن
        </button>
      </div>

      {loading && (
        <p style={{ fontSize: "13px" }}>در حال بارگذاری عملکرد هفتگی‌ها...</p>
      )}

      {!loading && entries.length === 0 && (
        <p
          style={{
            fontSize: "13px",
            color: "#6b7280",
            marginTop: "4px",
          }}
        >
          هنوز هیچ فرم عملکرد هفتگی برای این پروژه ثبت نکرده‌ای.
        </p>
      )}

      {!loading && entries.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          {entries.map((entry) => {
            const created = entry.created_at
              ? new Date(entry.created_at).toLocaleString("fa-IR")
              : "";
            const tasks = entry.tasks || {};
            const shareTargets = entry.share_targets || "";

            const totalDefined = WEEKLY_TASK_FIELDS.filter(
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
                  padding: "12px",
                  borderRadius: "14px",
                  border: "1px solid rgba(226,232,240,0.9)",
                  background: "#f9fafb",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "6px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
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
                      color: "#4b5563",
                      textAlign: "left",
                    }}
                  >
                    <div>تسک‌های تعریف‌شده: {totalDefined}</div>
                    <div>تسک‌های انجام‌شده: {doneCount}</div>
                  </div>
                </div>

                {/* تسک‌ها */}
                <div
                  style={{
                    marginTop: "4px",
                    paddingTop: "4px",
                    borderTop: "1px dashed rgba(209,213,219,0.9)",
                    maxHeight: "220px",
                    overflowY: "auto",
                  }}
                >
                  {WEEKLY_TASK_FIELDS.map((field) => {
                    const item = tasks[field.key];
                    if (!item || !item.text || !item.text.trim()) return null;

                    return (
                      <div
                        key={field.key}
                        style={{
                          marginBottom: "6px",
                          paddingBottom: "4px",
                          borderBottom:
                            "1px dashed rgba(209,213,219,0.8)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "6px",
                            marginBottom: "2px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#111827",
                            }}
                          >
                            {field.label}
                          </span>
                          <label
                            style={{
                              fontSize: "11px",
                              color: "#374151",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={!!item.done}
                              onChange={(e)=>onToggleTaskDone(entry.id,field.key,e.target.checked)}
                              
                            />
                            انجام شد
                          </label>
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#111827",
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.7,
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
                      borderTop: "1px solid rgba(209,213,219,0.9)",
                      fontSize: "12px",
                      color: "#111827",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.7,
                    }}
                  >
                    <strong>افرادی که پروژه به آن‌ها معرفی می‌شود:</strong>
                    <br />
                    {shareTargets}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
