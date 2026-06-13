import { useMemo, useState, useEffect } from "react";

export const WEEKLY_TASK_FIELDS = [
  // 1-1 حیاتی
  {
    key: "vital",
    label: "۱-۱ اقدام حیاتی‌ای که برای محقق شدن پروژه‌ام در این هفته انجام خواهم‌داد:",
    category: "حیاتی",
  },
  // 3 اقدام مهم (۲-۱، ۲-۲، ۲-۳)
  {
    key: "important1",
    label: "۲-۱ اقدام مهمی که برای محقق شدن پروژه‌ام در این هفته انجام خواهم‌داد:",
    category: "مهم",
  },
  {
    key: "important2",
    label: "۲-۲ اقدام مهمی که برای محقق شدن پروژه‌ام در این هفته انجام خواهم‌داد:",
    category: "مهم",
  },
  {
    key: "important3",
    label: "۲-۳ اقدام مهمی که برای محقق شدن پروژه‌ام در این هفته انجام خواهم‌داد:",
    category: "مهم",
  },
  // 5 اقدام معمولی (۳-۱ تا ۳-۵)
  {
    key: "normal1",
    label: "۳-۱ اقدام معمولی‌ای که برای محقق شدن پروژه‌ام در این هفته انجام خواهم‌داد:",
    category: "معمولی",
  },
  {
    key: "normal2",
    label: "۳-۲ اقدام معمولی‌ای که برای محقق شدن پروژه‌ام در این هفته انجام خواهم‌داد:",
    category: "معمولی",
  },
  {
    key: "normal3",
    label: "۳-۳ اقدام معمولی‌ای که برای محقق شدن پروژه‌ام در این هفته انجام خواهم‌داد:",
    category: "معمولی",
  },
  {
    key: "normal4",
    label: "۳-۴ اقدام معمولی‌ای که برای محقق شدن پروژه‌ام در این هفته انجام خواهم‌داد:",
    category: "معمولی",
  },
  {
    key: "normal5",
    label: "۳-۵ اقدام معمولی‌ای که برای محقق شدن پروژه‌ام در این هفته انجام خواهم‌داد:",
    category: "معمولی",
  },
];

export default function WeeklyForm({ project, initialEntry = null, onSubmit, onCancel }) {

  const todayFa = useMemo(() => new Date().toLocaleDateString("fa-IR"), []);

  // متن تسک‌ها (بدون تیک در UI، ولی در دیتا همچنان done = false می‌ذاریم)
  const [tasks, setTasks] = useState(() => {
    const init = {};
    WEEKLY_TASK_FIELDS.forEach((f) => {
      init[f.key] = { text: "", done: false };
    });
    return init;
  });

  const [shareTargets, setShareTargets] = useState("");

  useEffect(() => {
    if (!initialEntry) return;

    const loadedTasks = {};
    WEEKLY_TASK_FIELDS.forEach((f) => {
      const current = initialEntry.tasks?.[f.key] || {};
      loadedTasks[f.key] = {
        text: current.text || "",
        done: !!current.done,
      };
    });

    setTasks(loadedTasks);
    setShareTargets(initialEntry.share_targets || "");
  }, [initialEntry]);


  function handleTaskTextChange(key, value) {
    setTasks((prev) => ({
      ...prev,
      [key]: { ...prev[key], text: value },
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // مطمئن می‌شیم برای هر فیلد، ساختار {text, done:false} ذخیره می‌شه
    const preparedTasks = {};
    WEEKLY_TASK_FIELDS.forEach((f) => {
      const current = tasks[f.key] || {};
      preparedTasks[f.key] = {
        text: current.text || "",
        done: !!current.done,
      };
    });

    onSubmit({
      tasks: preparedTasks,
      // اسم کلید رو با دیتابیس هماهنگ می‌کنیم
      share_targets: shareTargets,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "24px",
        marginBottom: "40px",
        padding: "20px 18px",
        borderRadius: "18px",
        background: "#ffffff",
        boxShadow: "0 10px 28px rgba(148,163,184,0.5)",
        border: "1px solid rgba(226,232,240,0.9)",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <h2
        style={{
          margin: "0 0 8px",
          fontSize: "18px",
          fontWeight: 800,
          color: "#111827",
        }}
      >
        فرم عملکرد هفتگی
      </h2>

      {project && (
        <p
          style={{
            margin: "0 0 8px",
            fontSize: "13px",
            color: "#4b5563",
          }}
        >
          پروژه: <strong>{project.title || "پروژه بدون عنوان"}</strong>
        </p>
      )}

      <p
        style={{
          margin: "0 0 8px",
          fontSize: "12px",
          color: "#6b7280",
        }}
      >
        تاریخ پر کردن فرم: <strong>{todayFa}</strong>
      </p>

      {/* توضیحات کلی فرم */}
      <div
        style={{
          marginBottom: "14px",
          padding: "10px 12px",
          borderRadius: "12px",
          background: "#f9fafb",
          border: "1px solid rgba(226,232,240,0.9)",
          fontSize: "12px",
          color: "#4b5563",
          lineHeight: 1.8,
        }}
      >
        <p style={{ margin: "0 0 6px" }}>این فرم شامل دو بخش است:</p>
        <ul style={{ margin: "0 0 6px", paddingRight: "18px" }}>
          <li>اقدامات ۱-۳-۵ (۱ اقدام <strong>حیاتی</strong> ، ۳ اقدام <strong>مهم</strong> ، ۵ اقدام <strong>معمولی</strong>)<br /> که شما بر اساس فرم مایل استون که ابتدای هرماه پر می کنید،این اقدامات (Task ها) را اول هر هفته مشخص می کنید و تا پایان هفته انجام می دهید.</li>
          <li>
            نام افرادی که قرار است در هفتهٔ پیش‌رو،شما امکان‌(های) پروژه‌ی خود را با آن‌ها در
            میان بگذارید و آن‌ها را مجذوب کنید.
          </li>
        </ul>
        <p style={{ margin: "0 0 4px" }}>
          این اقدامات (Task ها) را بر اساس فرم مایل‌ستون ابتدای هر ماه مشخص می‌کنید و
          تا پایان هفته آن‌ها را انجام میدهید.
        </p>
      </div>

      {/* تعریف تسک و پروژه */}
      <div
        style={{
          marginBottom: "16px",
          padding: "10px 12px",
          borderRadius: "12px",
          background: "#eff6ff",
          border: "1px solid rgba(191,219,254,0.9)",
          fontSize: "12px",
          color: "#1f2937",
          lineHeight: 1.8,
        }}
      >
        <p style={{ margin: "0 0 4px", fontWeight: 700 }}>
          <strong> یادآوری تفاوت «تسک» و «پروژه»</strong>:
        </p>
        <p style={{ margin: "0 0 4px" }}>
          <strong>تسک (Task):</strong> فعالیت مشخص، محدود و قابل انجام که معمولاً
          بخشی از یک پروژه یا فرآیند بزرگ‌تر است.تسک ها معمولا:<br /> -دارای هدف مشخص هستند.<br />-مدت زمان کوتاه تری نسبت به پروژه دارند.<br />-به یک یا چند نفر محول می شوند.<br />-قابل اندازه گیری یا پیگیری هستند.<br />-ممکن است مستقل یا وابسته به تسک های دیگر باشند.
        </p>
        <p style={{ margin: "0 0 4px" }}>
          مثال تسک: نوشتن یک ایمیل، طراحی چهار اسلاید پاورپوینت تا ساعت ۲۲،
          ترجمه یک پاراگراف.
        </p>
        <p style={{ margin: "4px 0 4px" }}>
          <strong>پروژه (Project):</strong> تلاش موقتی و چندمرحله‌ای برای رسیدن به یک
          نتیجه خاص، محصول یا خدمت انجام می شود؛ پروژه ها:<br />-معمولا شامل چندین تسک هستند. <br />-زمانبندی ،منابع،بودجه و خروجی مشخص دارند. <br />-نیاز به برنامه ریزی و مدیریت دارند. <br />-ممکن است چند نفر یا تیم های مختلف در آن مشارکت کنند.
        </p>
        <p style={{ margin: "0" }}>
          مثال پروژه: طراحی و راه‌اندازی یک وب‌سایت، برگزاری یک کارگاه آموزشی،
          توسعه یک اپلیکیشن موبایل.
        </p>
      </div>

      {/* بخش ۱: اقدامات ۱-۳-۵ */}
      <h3
        style={{
          margin: "0 0 8px",
          fontSize: "14px",
          fontWeight: 800,
          color: "#111827",
        }}
      >
        بخش اول: اقدامات ۱-۳-۵ این هفته
      </h3>

      <p
        style={{
          margin: "0 0 10px",
          fontSize: "12px",
          color: "#4b5563",
          lineHeight: 1.7,
        }}
      >
        لطفاً برای این هفته، یک اقدام حیاتی، سه اقدام مهم و پنج اقدام معمولی
        تعریف کنید. هرکدام را به صورت تسک مشخص، قابل انجام و قابل اندازه‌گیری
        بنویسید.
      </p>

      {WEEKLY_TASK_FIELDS.map((field) => {
        const value = tasks[field.key] || { text: "" };
        return (
          <div
            key={field.key}
            style={{
              marginBottom: "10px",
              padding: "8px 10px",
              borderRadius: "12px",
              border: "1px solid rgba(226,232,240,0.9)",
              background: "#f9fafb",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#111827",
                  flex: 1,
                }}
              >
                {field.label}
              </label>
              <span
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  whiteSpace: "nowrap",
                }}
              >
                نوع: {field.category}
              </span>
            </div>

            <textarea
              value={value.text}
              onChange={(e) => handleTaskTextChange(field.key, e.target.value)}
              placeholder="به تسک بودن نوشته های خود حواس دهید."
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "8px",
                border: "1px solid rgba(148,163,184,0.8)",
                fontSize: "12px",
                minHeight: "50px",
                resize: "vertical",
                marginBottom: "4px",
              }}
            />
          </div>
        );
      })}

      {/* بخش دوم: معرفی پروژه به افراد */}
      <h3
        style={{
          margin: "10px 0 6px",
          fontSize: "14px",
          fontWeight: 800,
          color: "#111827",
        }}
      >
        بخش دوم: معرفی پروژه به دیگران
      </h3>

      <p
        style={{
          margin: "0 0 6px",
          fontSize: "12px",
          color: "#4b5563",
          lineHeight: 1.7,
        }}
      >
        پروژه خود را به افراد زیر در این هفته معرفی خواهم کرد
      </p>

      <textarea
        value={shareTargets}
        onChange={(e) => setShareTargets(e.target.value)}
        placeholder="نام و نام خانوادگی افراد"
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: "10px",
          border: "1px solid rgba(148,163,184,0.8)",
          fontSize: "12px",
          minHeight: "80px",
          resize: "vertical",
          marginBottom: "10px",
        }}
      />

      {/* دکمه‌ها */}
      <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            borderRadius: "999px",
            border: "none",
            background: "linear-gradient(135deg, #1A5BFF, #6A00D4)",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {initialEntry ? "ذخیره ویرایش عملکرد هفتگی" : "ثبت عملکرد این هفته"}

        </button>
        <button
          type="button"
          onClick={onCancel}
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
    </form>
  );
}
