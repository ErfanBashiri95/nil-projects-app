import { useMemo, useState } from "react";

// این لیست رسمی همه‌ی سؤال‌هاست؛
export const MILESTONE_FIELDS = [
  {
    key: "vision_beyond_8months",
    label:
      "۰. اگر چشم‌اندازتان بزرگ‌تر از بازهٔ ۸ ماهه است، نتایج مشخص و قابل اندازه‌گیری را همراه با ذکر سال بنویسید.",
    subtitle: "",
  },

  // ماه ۸ – مرداد ۱۴۰۵
  {
    key: "m8_month_end",
    label:
      "۱. بعد از ماه هشتم (هفته چهارم مرداد) نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    subtitle: "مورخ جمعه ۳۰ مرداد ۱۴۰۵",
  },
  {
    key: "m8_w3",
    label: "۲. پایان هفته سوم مرداد را بنویسید.",
    subtitle: "مورخ جمعه ۲۳ مرداد ۱۴۰۵",
  },
  {
    key: "m8_w2",
    label: "۳. پایان هفته دوم مرداد را بنویسید.",
    subtitle: "مورخ جمعه ۱۶ مرداد ۱۴۰۵",
  },
  {
    key: "m8_w1",
    label: "۴. پایان هفته اول مرداد را بنویسید.",
    subtitle: "مورخ جمعه ۹ مرداد ۱۴۰۵",
  },

  // ماه ۷ – تیر ۱۴۰۵
  {
    key: "m7_month_end",
    label:
      "۵. بعد از پایان ماه هفتم (هفته پنجم تیر) نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    subtitle: "مورخ جمعه ۲ مرداد ۱۴۰۵",
  },
  {
    key: "m7_w4",
    label: "۶. پایان هفته چهارم تیر را بنویسید.",
    subtitle: "مورخ چهارشنبه ۲۶ تیر ۱۴۰۵",
  },
  {
    key: "m7_w3",
    label: "۷. پایان هفته سوم تیر را بنویسید.",
    subtitle: "مورخ چهارشنبه ۱۹ تیر ۱۴۰۵",
  },
  {
    key: "m7_w2",
    label: "۸. پایان هفته دوم تیر را بنویسید.",
    subtitle: "مورخ چهارشنبه ۱۲ تیر ۱۴۰۵",
  },
  {
    key: "m7_w1",
    label: "۹. پایان هفته اول تیر را بنویسید.",
    subtitle: "مورخ چهارشنبه ۵ تیر ۱۴۰۵",
  },

  // ماه ۶ – خرداد ۱۴۰۵
  {
    key: "m6_month_end",
    label:
      "۱۰. بعد از پایان ماه ششم (هفته چهارم خرداد) نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    subtitle: "مورخ یکشنبه ۲۹ خرداد ۱۴۰۵",
  },
  {
    key: "m6_w3",
    label: "۱۱. پایان هفته سوم خرداد را بنویسید.",
    subtitle: "مورخ یکشنبه ۲۲ خرداد ۱۴۰۵",
  },
  {
    key: "m6_w2",
    label: "۱۲. پایان هفته دوم خرداد را بنویسید.",
    subtitle: "مورخ یکشنبه ۱۵ خرداد ۱۴۰۵",
  },
  {
    key: "m6_w1",
    label: "۱۳. پایان هفته اول خرداد را بنویسید.",
    subtitle: "مورخ یکشنبه ۸ خرداد ۱۴۰۵",
  },

  // ماه ۵ – اردیبهشت ۱۴۰۵
  {
    key: "m5_month_end",
    label:
      "۱۴. بعد از پایان ماه پنجم (هفته پنجم اردیبهشت) نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    subtitle: "مورخ جمعه ۱ خرداد ۱۴۰۵",
  },
  {
    key: "m5_w4",
    label: "۱۵. پایان هفته چهارم اردیبهشت را بنویسید.",
    subtitle: "مورخ پنجشنبه ۲۵ اردیبهشت ۱۴۰۵",
  },
  {
    key: "m5_w3",
    label: "۱۶. پایان هفته سوم اردیبهشت را بنویسید.",
    subtitle: "مورخ پنجشنبه ۱۸ اردیبهشت ۱۴۰۵",
  },
  {
    key: "m5_w2",
    label: "۱۷. پایان هفته دوم اردیبهشت را بنویسید.",
    subtitle: "مورخ پنجشنبه ۱۱ اردیبهشت ۱۴۰۵",
  },
  {
    key: "m5_w1",
    label: "۱۸. پایان هفته اول اردیبهشت را بنویسید.",
    subtitle: "مورخ پنجشنبه ۴ اردیبهشت ۱۴۰۵",
  },

  // ماه ۴ – فروردین ۱۴۰۵
  {
    key: "m4_month_end",
    label:
      "۱۹. بعد از پایان ماه چهارم نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    subtitle: "مورخ جمعه ۲۸ فروردین ۱۴۰۵",
  },
  {
    key: "m4_w3",
    label: "۲۰. پایان هفته سوم فروردین را بنویسید.",
    subtitle: "مورخ دوشنبه ۲۱ فروردین ۱۴۰۵",
  },
  {
    key: "m4_w2",
    label: "۲۱. پایان هفته دوم فروردین را بنویسید.",
    subtitle: "مورخ دوشنبه ۱۴ فروردین ۱۴۰۵",
  },
  {
    key: "m4_w1",
    label: "۲۲. پایان هفته اول فروردین را بنویسید.",
    subtitle: "مورخ دوشنبه ۷ فروردین ۱۴۰۵",
  },

  // ماه ۳ – اسفند ۱۴۰۴
  {
    key: "m3_month_end",
    label:
      "۲۳. بعد از پایان ماه سوم (هفته چهارم اسفند) نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    subtitle: "مورخ جمعه ۲۹ اسفند ۱۴۰۴",
  },
  {
    key: "m3_w3",
    label: "۲۴. پایان هفته سوم اسفند را بنویسید.",
    subtitle: "مورخ جمعه ۲۲ اسفند ۱۴۰۴",
  },
  {
    key: "m3_w2",
    label: "۲۵. پایان هفته دوم اسفند را بنویسید.",
    subtitle: "مورخ جمعه ۱۵ اسفند ۱۴۰۴",
  },
  {
    key: "m3_w1",
    label: "۲۶. پایان هفته اول اسفند را بنویسید.",
    subtitle: "مورخ جمعه ۸ اسفند ۱۴۰۴",
  },

  // ماه ۲ – بهمن ۱۴۰۴
  {
    key: "m2_month_end",
    label:
      "۲۷. بعد از پایان ماه دوم (هفته چهارم بهمن) نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    subtitle: "مورخ جمعه ۱ اسفند ۱۴۰۴",
  },
  {
    key: "m2_w3",
    label: "۲۸. پایان هفته سوم بهمن را بنویسید.",
    subtitle: "مورخ جمعه ۲۴ بهمن ۱۴۰۴",
  },
  {
    key: "m2_w2",
    label: "۲۹. پایان هفته دوم بهمن را بنویسید.",
    subtitle: "مورخ جمعه ۱۷ بهمن ۱۴۰۴",
  },
  {
    key: "m2_w1",
    label: "۳۰. پایان هفته اول بهمن را بنویسید.",
    subtitle: "مورخ جمعه ۱۰ بهمن ۱۴۰۴",
  },

  // ماه ۱ – دی ۱۴۰۴
  {
    key: "m1_month_end",
    label:
      "۳۱. بعد از پایان ماه اول (هفته پنجم دی) نتایج مشخص و قابل اندازه‌گیری را بنویسید.",
    subtitle: "مورخ جمعه ۳ بهمن ۱۴۰۴",
  },
  {
    key: "m1_w4",
    label: "۳۲. پایان هفته چهارم دی را بنویسید.",
    subtitle: "مورخ جمعه ۲۶ دی ۱۴۰۴",
  },
  {
    key: "m1_w3",
    label: "۳۳. پایان هفته سوم دی را بنویسید.",
    subtitle: "مورخ جمعه ۱۹ دی ۱۴۰۴",
  },
  {
    key: "m1_w2",
    label: "۳۴. پایان هفته دوم دی را بنویسید.",
    subtitle: "مورخ جمعه ۱۲ دی ۱۴۰۴",
  },
  {
    key: "m1_w1",
    label: "۳۵. پایان هفته اول دی را بنویسید.",
    subtitle: "مورخ جمعه ۵ دی ۱۴۰۴",
  },
];

export default function MilestoneForm({ project, participantId, onSubmit, onCancel }) {
  const todayFa = useMemo(() => new Date().toLocaleDateString("fa-IR"), []);

  const [answers, setAnswers] = useState(() => {
    const init = {};
    MILESTONE_FIELDS.forEach((f) => (init[f.key] = ""));
    return init;
  });

  function handleChange(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
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

      {MILESTONE_FIELDS.map((field) => (
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
          {field.subtitle && (
            <p
              style={{
                margin: "0 0 6px",
                fontSize: "12px",
                color: "#6b7280",
                lineHeight: 1.7,
              }}
            >
              {field.subtitle}
            </p>
          )}
          <textarea
            value={answers[field.key]}
            onChange={(e) => handleChange(field.key, e.target.value)}
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
      ))}

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
          ثبت مایل‌ستون
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
