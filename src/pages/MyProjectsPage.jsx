import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; import api from "../apiClient";
import ProjectIdeationForm from "../components/ProjectIdeationForm";
import MilestoneForm, { MILESTONE_FIELDS } from "../components/MilestoneForm";
import WeeklyForm, { WEEKLY_TASK_FIELDS } from "../components/WeeklyForm";

export default function MyProjectsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showIdeationIntro, setShowIdeationIntro] = useState(false);
  const [showIdeationForm, setShowIdeationForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [milestoneProject, setMilestoneProject] = useState(null);

  const [showMilestoneIntro, setShowMilestoneIntro] = useState(false);

  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [editingMilestoneEntry, setEditingMilestoneEntry] = useState(null);


  const [milestoneEntries, setMilestoneEntries] = useState([]);

  const [milestonesLoading, setMilestonesLoading] = useState(false);

  const [viewMilestonesProject, setViewMilestonesProject] = useState(null);
  const [weeklyProject, setWeeklyProject] = useState(null);

  const [showWeeklyIntro, setShowWeeklyIntro] = useState(false);

  const [showWeeklyForm, setShowWeeklyForm] = useState(false);

  const [editingWeeklyEntry, setEditingWeeklyEntry] = useState(null);


  const [weeklyEntries, setWeeklyEntries] = useState([]);

  const [weeklyLoading, setWeeklyLoading] = useState(false);

  const [viewWeeklyProject, setViewWeeklyProject] = useState(null);



  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);

    const meResult = await api.me();

    if (!meResult.success) {
      alert("برای ورود به نیل پروژه، ابتدا باید در سایت اصلی وارد شوید.");
      setLoading(false);
      return;
    }

    setUser(meResult.user);

    const roles = meResult.user?.roles || [];

    if (
      roles.includes("admin") ||
      roles.includes("teacher") ||
      roles.includes("support")
    ) {
      navigate(`/overview${window.location.search || ""}`);
      return;
    }


    const coursesResult = await api.myProjectCourses();

    if (coursesResult.success) {
      const allCourses = coursesResult.courses || [];

      const params = new URLSearchParams(window.location.search);
      const urlCourseId = params.get("course_id");

      const allowedCourses = urlCourseId
        ? allCourses.filter(
          (course) => String(course.course_id) === String(urlCourseId)
        )
        : allCourses;

      setCourses(allowedCourses);

      if (allowedCourses.length > 0) {
        const selectedId = allowedCourses[0].course_id;
        setSelectedCourseId(selectedId);
        await loadProjects(selectedId);
      } else {
        setSelectedCourseId("");
        setProjects([]);
        alert("برای این دوره دسترسی پروژه پیدا نشد.");
      }
    }



    setLoading(false);
  }

  async function loadProjects(courseId = selectedCourseId) {
    if (!courseId) {
      setProjects([]);
      return;
    }

    const result = await api.projects(courseId);

    if (result.success) {
      setProjects(result.data || []);
    } else {
      setProjects([]);
    }
  }


  function handleCreateNewProject() {
    if (!selectedCourseId) {
      alert("اول یک دوره را انتخاب کن.");
      return;
    }

    setShowIdeationIntro(true);
    setShowIdeationForm(false);
  }

  function handleEditProject(project) {
    setEditingProject(project);
    setShowIdeationIntro(false);
    setShowIdeationForm(true);
  }

  async function handleDeleteProject(projectId) {
    if (!window.confirm("از حذف این پروژه مطمئن هستید؟")) {
      return;
    }

    const result = await api.deleteProject(projectId);

    if (!result.success) {
      alert(result.message || "حذف پروژه با خطا مواجه شد.");
      return;
    }

    alert("پروژه با موفقیت حذف شد.");
    await loadProjects();
  }

  function handleOpenMilestone(project) {
    setMilestoneProject(project);
    setShowMilestoneIntro(true);
    setShowMilestoneForm(false);
  }

  function handleMilestoneIntroContinue() {
    setShowMilestoneIntro(false);
    setShowMilestoneForm(true);
  }

  function handleMilestoneCancel() {
    setMilestoneProject(null);
    setShowMilestoneIntro(false);
    setShowMilestoneForm(false);
  }

  async function handleMilestoneSubmit(answers) {
    if (!milestoneProject) return;

    let result;

    if (editingMilestoneEntry) {
      result = await api.updateMilestone(
        editingMilestoneEntry.id,
        answers,
        editingMilestoneEntry.period_label || "custom_milestone",
        editingMilestoneEntry.period_start || null
      );
    } else {
      result = await api.saveMilestone(
        milestoneProject.id,
        answers,
        "custom_milestone",
        null
      );
    }

    if (!result.success) {
      alert(result.message || "ثبت / ویرایش مایل‌ستون با خطا مواجه شد.");
      return;
    }

    alert(
      editingMilestoneEntry
        ? "مایل‌ستون با موفقیت ویرایش شد."
        : "فرم مایل‌ستون با موفقیت ثبت شد."
    );

    setMilestoneProject(null);
    setEditingMilestoneEntry(null);
    setShowMilestoneIntro(false);
    setShowMilestoneForm(false);

    if (viewMilestonesProject) {
      await handleViewMilestones(viewMilestonesProject);
    }
  }


  async function handleViewMilestones(project) {
    setViewMilestonesProject(project);
    setMilestonesLoading(true);
    setMilestoneEntries([]);

    const result = await api.milestones(project.id);

    if (!result.success) {
      alert(result.message || "دریافت مایل‌ستون‌ها با خطا مواجه شد.");
      setMilestoneEntries([]);
    } else {
      setMilestoneEntries(result.data || []);
    }

    setMilestonesLoading(false);
  }

  function handleCloseMilestoneView() {
    setViewMilestonesProject(null);
    setMilestoneEntries([]);
  }

  function handleEditMilestone(entry) {
    setMilestoneProject(projects.find((p) => p.id === entry.project_id) || viewMilestonesProject);
    setEditingMilestoneEntry(entry);
    setShowMilestoneIntro(false);
    setShowMilestoneForm(true);
  }


  function handleOpenWeekly(project) {
    setWeeklyProject(project);
    setShowWeeklyIntro(true);
    setShowWeeklyForm(false);
  }

  function handleWeeklyIntroContinue() {
    setShowWeeklyIntro(false);
    setShowWeeklyForm(true);
  }

  function handleWeeklyCancel() {
    setWeeklyProject(null);
    setShowWeeklyIntro(false);
    setShowWeeklyForm(false);
  }

  async function handleWeeklySubmit({ tasks, share_targets }) {
    if (!weeklyProject) return;

    const now = new Date();

    let result;

    if (editingWeeklyEntry) {
      result = await api.updateWeekly(
        editingWeeklyEntry.id,
        tasks,
        share_targets,
        editingWeeklyEntry.week_label || "هفته منتهی به " + now.toLocaleDateString("fa-IR"),
        editingWeeklyEntry.week_start || now.toISOString().slice(0, 10)
      );
    } else {
      result = await api.saveWeekly(
        weeklyProject.id,
        tasks,
        share_targets,
        "هفته منتهی به " + now.toLocaleDateString("fa-IR"),
        now.toISOString().slice(0, 10)
      );
    }

    if (!result.success) {
      alert(result.message || "ثبت / ویرایش عملکرد هفتگی با خطا مواجه شد.");
      return;
    }

    alert(editingWeeklyEntry ? "عملکرد هفتگی با موفقیت ویرایش شد." : "عملکرد هفتگی با موفقیت ثبت شد.");

    setWeeklyProject(null);
    setEditingWeeklyEntry(null);
    setShowWeeklyIntro(false);
    setShowWeeklyForm(false);

    if (viewWeeklyProject) {
      await handleViewWeekly(viewWeeklyProject);
    }
  }


  async function handleViewWeekly(project) {
    setViewWeeklyProject(project);
    setWeeklyLoading(true);
    setWeeklyEntries([]);

    const result = await api.weeklyEntries(project.id);

    if (!result.success) {
      alert(result.message || "دریافت عملکردهای هفتگی با خطا مواجه شد.");
      setWeeklyEntries([]);
    } else {
      setWeeklyEntries(result.data || []);
    }

    setWeeklyLoading(false);
  }

  function handleCloseWeeklyView() {
    setViewWeeklyProject(null);
    setWeeklyEntries([]);
  }

  function handleEditWeekly(entry) {
    setWeeklyProject(projects.find((p) => p.id === entry.project_id) || viewWeeklyProject);
    setEditingWeeklyEntry(entry);
    setShowWeeklyIntro(false);
    setShowWeeklyForm(true);
  }


  async function handleToggleWeeklyTaskDone(entryId, taskKey, newDone) {
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

    const result = await api.updateWeeklyTask(entryId, newTasks);

    if (!result.success) {
      alert(result.message || "به‌روزرسانی وضعیت تسک با خطا مواجه شد.");
      return;
    }

    setWeeklyEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? { ...e, tasks: newTasks }
          : e
      )
    );
  }

  async function handleDeleteWeekly(entryId) {
    if (!window.confirm("آیا از حذف این عملکرد هفتگی مطمئن هستید؟")) {
      return;
    }

    const result = await api.deleteWeekly(entryId);

    if (!result.success) {
      alert(result.message || "حذف عملکرد هفتگی با خطا مواجه شد.");
      return;
    }

    setWeeklyEntries((prev) =>
      prev.filter((entry) => entry.id !== entryId)
    );

    alert("عملکرد هفتگی حذف شد.");
  }

  async function handleDeleteMilestone(entryId) {
    if (!window.confirm("آیا از حذف این مایل‌ستون مطمئن هستید؟")) {
      return;
    }

    const result = await api.deleteMilestone(entryId);

    if (!result.success) {
      alert(result.message || "حذف مایل‌ستون با خطا مواجه شد.");
      return;
    }

    setMilestoneEntries((prev) =>
      prev.filter((entry) => entry.id !== entryId)
    );

    alert("مایل‌ستون حذف شد.");
  }










  async function handleIdeationFormSubmit(values) {
    const result = await api.saveProject(selectedCourseId, values, editingProject?.id || null);

    if (!result.success) {
      alert(result.message || "ثبت پروژه با خطا مواجه شد.");
      return;
    }

    alert("پروژه با موفقیت ثبت شد.");

    setShowIdeationForm(false);
    setShowIdeationIntro(false);
    setEditingProject(null);

    await loadProjects();
  }

  function handleIdeationCancel() {
    setShowIdeationIntro(false);
    setShowIdeationForm(false);
  }

  if (loading) {
    return (
      <div style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
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

          {user && (
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: "#111827",
              }}
            >
              خوش آمدی، {user.full_name || user.username} 🌱
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

      <section
        style={{
          marginBottom: "16px",
          padding: "14px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(226,232,240,0.9)",
          boxShadow: "0 8px 20px rgba(148,163,184,0.3)",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          انتخاب دوره
        </label>

        <select
          value={selectedCourseId}
          onChange={async (e) => {
            const courseId = e.target.value;
            setSelectedCourseId(courseId);
            await loadProjects(courseId);
          }}

          style={{
            width: "100%",
            padding: "9px 10px",
            borderRadius: "10px",
            border: "1px solid rgba(148,163,184,0.8)",
            fontSize: "13px",
          }}
        >
          {courses.map((course) => (
            <option key={course.course_id} value={course.course_id}>
              {course.title} - {course.access_role}
            </option>
          ))}
        </select>
      </section>

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
              <li>در نوشتن، خود را محدود نکنید.</li>
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
          <h2 style={{ margin: "0 0 10px", fontSize: "18px", fontWeight: 800, color: "#111827", lineHeight: 1.8 }}>
            کلمه‌ی «مایلستون» (Milestone) در اصل به معنی سنگ‌نشان‌هایی است که در جاده‌ها برای مشخص کردن فاصله‌ها نصب می‌شدند. این نشانه‌ها به مسافران کمک می‌کردند که بدانند چقدر از مسیر را طی کرده‌اند و چقدر تا مقصد باقی مانده است.
          </h2>

          <p style={{ margin: "0 0 10px", fontSize: "14px", color: "#374151", lineHeight: 1.9 }}>
            در پروژه‌ها نیز مایلستون‌ها همین نقش را دارند: نقاط کلیدی و قابل‌اندازه‌گیری در مسیر اجرای پروژه که رسیدن به آن‌ها نشان‌دهنده‌ی پیشرفت واقعی است. ثبت مایلستون‌ها در این فرم به ما کمک می‌کند تا مسیر پروژه را شفاف‌تر ببینیم، عملکرد تیم و خودمان را ارزیابی کنیم، برنامه‌ریزی دقیق‌تری داشته باشیم و  انحراف مسیر را تشخیص بدیم.
          </p>

          <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#4b5563", lineHeight: 1.9 }}>
            <strong>نکته مهم:</strong> این فرم به عنوان نقشه‌ی راه پروژه عمل می‌کند و ما را در رسیدن گام‌به‌گام به اهداف نهایی یاری می‌دهد. شما با پرکردن مایل‌ستون‌ها محدود یا وابسته به تحقق چیزهایی که گفتید نیستید.
          </p>



          <p style={{ margin: "6px 0 10px", fontSize: "12px", color: "#4b5563" }}>
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


      {showMilestoneForm && milestoneProject && (
        <MilestoneForm
          project={milestoneProject}
          initialEntry={editingMilestoneEntry}
          onSubmit={handleMilestoneSubmit}
          onCancel={handleMilestoneCancel}
        />
      )}

      {showWeeklyForm && weeklyProject && (
        <WeeklyForm
          project={weeklyProject}
          initialEntry={editingWeeklyEntry}
          onSubmit={handleWeeklySubmit}
          onCancel={handleWeeklyCancel}
        />
      )}

      {viewMilestonesProject && (
        <MilestoneReadOnlyPanel
          project={viewMilestonesProject}
          entries={milestoneEntries}
          loading={milestonesLoading}
          onClose={handleCloseMilestoneView}
          onDeleteMilestone={handleDeleteMilestone}
          onEditMilestone={handleEditMilestone}
        />
      )}

      {viewWeeklyProject && (
        <WeeklyReadOnlyPanel
          project={viewWeeklyProject}
          entries={weeklyEntries}
          loading={weeklyLoading}
          onClose={handleCloseWeeklyView}
          onToggleTaskDone={handleToggleWeeklyTaskDone}
          onDeleteWeekly={handleDeleteWeekly}
          onEditWeekly={handleEditWeekly}
        />


      )}

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
              margin: "0 0 10px",
              fontSize: "14px",
              color: "#374151",
              lineHeight: 1.8,
            }}
          >
            در این بخش، اقدامات ۱-۳-۵ این هفته را برای پروژه خود مشخص می‌کنید:
            یک اقدام حیاتی، سه اقدام مهم و پنج اقدام معمولی.
          </p>

          <p
            style={{
              margin: "0 0 10px",
              fontSize: "13px",
              color: "#4b5563",
              lineHeight: 1.8,
            }}
          >
            این اقدامات را بر اساس فرم مایل‌ستون و مسیر پروژه انتخاب می‌کنید و تا پایان هفته انجام می‌دهید.
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


      {showIdeationForm && (
        <ProjectIdeationForm
          initialProject={editingProject}
          participantId={user?.id}
          onSubmit={handleIdeationFormSubmit}
          onCancel={handleIdeationCancel}
        />
      )}

      <section>
        {projects.length === 0 && !showIdeationIntro && !showIdeationForm && (
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
            هنوز هیچ پروژه‌ای ثبت نکرده‌ای.
          </div>
        )}

        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              marginTop: "16px",
              padding: "18px",
              borderRadius: "14px",
              background: "#ffffff",
              boxShadow: "0 6px 16px rgba(148,163,184,0.35)",
              border: "1px solid rgba(226,232,240,0.9)",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {project.title || "پروژه بدون عنوان"}
            </h3>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              آخرین به‌روزرسانی:{" "}
              {project.updated_at
                ? new Date(project.updated_at).toLocaleString("fa-IR")
                : "-"}
            </p>

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => handleEditProject(project)}
                style={{
                  padding: "6px 12px",
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
                onClick={() => handleDeleteProject(project.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: "none",
                  background: "#fee2e2",
                  color: "#b91c1c",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                حذف پروژه
              </button>
            </div>



            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                marginTop: "12px",
              }}
            >
              <button
                onClick={() => handleOpenMilestone(project)}
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
                onClick={() => handleViewMilestones(project)}
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
                onClick={() => handleOpenWeekly(project)}
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
                onClick={() => handleViewWeekly(project)}
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
                هفته‌های قبل
              </button>

            </div>


          </div>
        ))}
      </section>
    </div>
  );
}
function MilestoneReadOnlyPanel({ project, entries, loading, onClose, onDeleteMilestone, onEditMilestone }) {
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
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#111827" }}>
            مایل‌ستون‌های ثبت‌شده
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#4b5563" }}>
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

      {loading && <p style={{ fontSize: "13px" }}>در حال بارگذاری مایل‌ستون‌ها...</p>}

      {!loading && entries.length === 0 && (
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
          هنوز هیچ مایل‌ستونی برای این پروژه ثبت نکرده‌ای.
        </p>
      )}

      {!loading &&
        entries.map((entry, index) => {
          const created = entry.created_at
            ? new Date(entry.created_at).toLocaleString("fa-IR")
            : "";

          const rawAnswers = entry.answers || {};

          const answers = { ...rawAnswers };

          delete answers.m1_w4;
          delete answers.m5_w4;
          delete answers.m7_w4;


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
                <strong style={{ fontSize: "13px" }}>ثبت شماره {index + 1}</strong>

                <span style={{ fontSize: "11px", color: "#6b7280" }}>
                  تاریخ ثبت: {created}
                </span>

                <button
                  type="button"
                  onClick={() => onEditMilestone(entry)}
                  style={{
                    border: "none",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  ویرایش
                </button>


                <button
                  type="button"
                  onClick={() => onDeleteMilestone(entry.id)}
                  style={{
                    border: "none",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  حذف
                </button>

              </div>

              {MILESTONE_FIELDS
                .filter((field) => !["m1_w4", "m5_w4", "m7_w4"].includes(field.key))
                .map((field) => {
                  const value = answers[field.key];

                  if (!value || (!value.text && !value.date)) return null;

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

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#111827",
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.8,
                        }}
                      >
                        {value.date && (
                          <>
                            <strong>تاریخ هدف: </strong>
                            {value.date}
                            <br />
                          </>
                        )}

                        {value.text}
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

function WeeklyReadOnlyPanel({ project, entries, loading, onClose, onToggleTaskDone, onDeleteWeekly, onEditWeekly }) {
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#111827" }}>
            عملکرد هفتگی‌های ثبت‌شده
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#4b5563" }}>
            پروژه: <strong>{project.title || "پروژه بدون عنوان"}</strong>
          </p>
        </div>

        <button onClick={onClose} style={{ padding: "6px 12px", borderRadius: "999px", border: "none", background: "#e5e7eb", color: "#374151", fontSize: "12px", cursor: "pointer" }}>
          بستن
        </button>
      </div>

      {loading && <p style={{ fontSize: "13px" }}>در حال بارگذاری عملکرد هفتگی‌ها...</p>}

      {!loading && entries.length === 0 && (
        <p style={{ fontSize: "13px", color: "#6b7280" }}>
          هنوز هیچ عملکرد هفتگی برای این پروژه ثبت نکرده‌ای.
        </p>
      )}

      {!loading &&
        entries.map((entry, index) => {
          const created = entry.created_at
            ? new Date(entry.created_at).toLocaleString("fa-IR")
            : "";

          const tasks = entry.tasks || {};

          const visibleTasks = WEEKLY_TASK_FIELDS
            .map((field) => ({
              field,
              item: tasks[field.key],
            }))
            .filter(({ item }) => item && item.text);

          const doneCount = visibleTasks.filter(({ item }) => item.done).length;
          const totalCount = visibleTasks.length;


          return (
            <div key={entry.id || index} style={{ marginTop: "12px", padding: "12px", borderRadius: "14px", border: "1px solid rgba(226,232,240,0.9)", background: "#f9fafb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <strong style={{ fontSize: "13px" }}>
                  {entry.week_label || `ثبت شماره ${index + 1}`}
                </strong>

                <span style={{ fontSize: "11px", color: "#6b7280" }}>
                  تاریخ ثبت: {created}
                </span>

                <button
                  type="button"
                  onClick={() => onEditWeekly(entry)}
                  style={{
                    border: "none",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  ویرایش
                </button>


                <button
                  type="button"
                  onClick={() => onDeleteWeekly(entry.id)}
                  style={{
                    border: "none",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  حذف
                </button>


                <div style={{ fontSize: "12px", color: "#374151", marginBottom: "8px" }}>
                  تسک‌های تعریف‌شده: {totalCount}
                  <br />
                  تسک‌های انجام‌شده: {doneCount}
                </div>

              </div>

              {WEEKLY_TASK_FIELDS.map((field) => {
                const item = tasks[field.key];

                if (!item || !item.text) return null;

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

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#111827",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.8,
                        textDecoration: item.done ? "line-through" : "none",
                        opacity: item.done ? 0.6 : 1,
                        marginBottom: "6px",
                      }}
                    >
                      {item.text}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        direction: "rtl",
                      }}
                    >
                      <label
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "11px",
                          color: "#374151",
                          cursor: "pointer",
                          background: item.done ? "#dcfce7" : "#f3f4f6",
                          padding: "3px 8px",
                          borderRadius: "999px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!item.done}
                          onChange={(e) =>
                            onToggleTaskDone(entry.id, field.key, e.target.checked)
                          }
                        />
                        انجام شد
                      </label>
                    </div>
                  </div>
                );

              })}

              {entry.share_targets && (
                <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid rgba(209,213,219,0.9)", fontSize: "12px", color: "#111827", whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
                  <strong>افرادی که پروژه به آن‌ها معرفی می‌شود:</strong>
                  <br />
                  {entry.share_targets}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

