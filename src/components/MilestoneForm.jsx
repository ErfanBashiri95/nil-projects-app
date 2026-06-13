import { useMemo, useState, useEffect } from "react";

export const MILESTONE_FIELDS = [
  {
    key: "vision_beyond_8months",
    label:
      "۰. اگر چشم‌اندازتان بزرگ‌تر از بازهٔ ۸ ماهه است، نتایج مشخص و قابل اندازه‌گیری را همراه با ذکر تاریخ بنویسید.",
    hasDate: true,
  },
  {
    key: "m8_month_end",
    label:
      "۱. بعد از پایان ماه هشتم از شروع پروژه، نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    hasDate: true,
  },
  {
    key: "m8_w3",
    label: "۲. پایان هفته سوم ماه هشتم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m8_w2",
    label: "۳. پایان هفته دوم ماه هشتم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m8_w1",
    label: "۴. پایان هفته اول ماه هشتم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m7_month_end",
    label:
      "۵. بعد از پایان ماه هفتم از شروع پروژه، نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    hasDate: true,
  },
  {
    key: "m7_w3",
    label: "۶. پایان هفته سوم ماه هفتم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m7_w2",
    label: "۷. پایان هفته دوم ماه هفتم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m7_w1",
    label: "۸. پایان هفته اول ماه هفتم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m6_month_end",
    label:
      "۹. بعد از پایان ماه ششم از شروع پروژه، نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    hasDate: true,
  },
  {
    key: "m6_w3",
    label: "۱۰. پایان هفته سوم ماه ششم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m6_w2",
    label: "۱۱. پایان هفته دوم ماه ششم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m6_w1",
    label: "۱۲. پایان هفته اول ماه ششم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m5_month_end",
    label:
      "۱۳. بعد از پایان ماه پنجم از شروع پروژه، نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    hasDate: true,
  },
  {
    key: "m5_w3",
    label: "۱۴. پایان هفته سوم ماه پنجم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m5_w2",
    label: "۱۵. پایان هفته دوم ماه پنجم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m5_w1",
    label: "۱۶. پایان هفته اول ماه پنجم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m4_month_end",
    label:
      "۱۷. بعد از پایان ماه چهارم از شروع پروژه، نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    hasDate: true,
  },
  {
    key: "m4_w3",
    label: "۱۸. پایان هفته سوم ماه چهارم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m4_w2",
    label: "۱۹. پایان هفته دوم ماه چهارم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m4_w1",
    label: "۲۰. پایان هفته اول ماه چهارم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m3_month_end",
    label:
      "۲۱. بعد از پایان ماه سوم از شروع پروژه، نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    hasDate: true,
  },
  {
    key: "m3_w3",
    label: "۲۲. پایان هفته سوم ماه سوم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m3_w2",
    label: "۲۳. پایان هفته دوم ماه سوم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m3_w1",
    label: "۲۴. پایان هفته اول ماه سوم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m2_month_end",
    label:
      "۲۵. بعد از پایان ماه دوم از شروع پروژه، نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    hasDate: true,
  },
  {
    key: "m2_w3",
    label: "۲۶. پایان هفته سوم ماه دوم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m2_w2",
    label: "۲۷. پایان هفته دوم ماه دوم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m2_w1",
    label: "۲۸. پایان هفته اول ماه دوم را بنویسید.",
    hasDate: true,
  },
  {
    key: "m1_month_end",
    label:
      "۲۹. بعد از پایان ماه اول از شروع پروژه، نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    hasDate: true,
  },
  {
    key: "m1_w3",
    label: "۳۰. پایان هفته سوم ماه اول را بنویسید.",
    hasDate: true,
  },
  {
    key: "m1_w2",
    label: "۳۱. پایان هفته دوم ماه اول را بنویسید.",
    hasDate: true,
  },
  {
    key: "m1_w1",
    label: "۳۲. پایان هفته اول ماه اول را بنویسید.",
    hasDate: true,
  },
];


export default function MilestoneForm({ project, initialEntry = null, onSubmit, onCancel }) {

  const todayFa = useMemo(() => new Date().toLocaleDateString("fa-IR"), []);

  const [answers, setAnswers] = useState(() => {
    const init = {};
    MILESTONE_FIELDS.forEach((f) => {
      init[f.key] = {
        date: "",
        text: "",
      };
    });
    return init;
  });

  useEffect(() => {
    if (!initialEntry) return;

    const loadedAnswers = {};
    MILESTONE_FIELDS.forEach((f) => {
      const current = initialEntry.answers?.[f.key] || {};
      loadedAnswers[f.key] = {
        date: current.date || "",
        text: current.text || "",
      };
    });

    setAnswers(loadedAnswers);
  }, [initialEntry]);


  function handleTextChange(key, value) {
    setAnswers((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        text: value,
      },
    }));
  }

  function handleDateChange(key, value) {
    setAnswers((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        date: value,
      },
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(answers);
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
        فرم مایل‌ستون پروژه
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
          margin: "0 0 12px",
          fontSize: "12px",
          color: "#6b7280",
        }}
      >
        تاریخ پر کردن فرم: <strong>{todayFa}</strong>
      </p>

      <p
        style={{
          margin: "0 0 14px",
          fontSize: "12px",
          color: "#4b5563",
          lineHeight: 1.8,
          padding: "10px 12px",
          borderRadius: "12px",
          background: "#f9fafb",
          border: "1px solid rgba(226,232,240,0.9)",
        }}
      >
        در این نسخه، تاریخ‌ها از قبل تعیین نشده‌اند. لطفاً برای هر مایل‌ستون،
        تاریخ هدف را خودتان به صورت شمسی وارد کنید؛ مثال: ۱۴۰۵/۰۲/۱۰
      </p>

      {MILESTONE_FIELDS.map((field) => {
        const value = answers[field.key] || { date: "", text: "" };

        return (
          <div key={field.key} style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {field.label}
            </label>

            <input
              type="text"
              value={value.date}
              onChange={(e) => handleDateChange(field.key, e.target.value)}
              placeholder="تاریخ هدف به شمسی؛ مثلا ۱۴۰۵/۰۲/۱۰"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.8)",
                fontSize: "13px",
                marginBottom: "6px",
              }}
            />

            <textarea
              value={value.text}
              onChange={(e) => handleTextChange(field.key, e.target.value)}
              placeholder="نتیجه مشخص و قابل اندازه‌گیری را بنویسید."
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.8)",
                fontSize: "13px",
                minHeight: "70px",
                resize: "vertical",
              }}
            />
          </div>
        );
      })}

      <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
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
          {initialEntry ? "ذخیره ویرایش مایل‌ستون" : "ثبت مایل‌ستون"}

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
