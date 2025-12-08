import { useState, useEffect } from "react";
import EssayModal from "./EssayModal";

export default function ProjectIdeationForm({
  initialProject,
  participantId,
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState({
    title: "",
    q2_possibilities: "",
    q4_vision_story: "",
    q5_future_experience: "",
    q6_measurable_outcomes: "",
    q7_target_audience: "",
    q8_post_success_vision: "",
    q9_role_statement: "",
  });

  const [openEssaySlug, setOpenEssaySlug] = useState(null);

  useEffect(() => {
    if (initialProject) {
      setValues({
        title: initialProject.title || "",
        q2_possibilities: initialProject.q2_possibilities || "",
        q4_vision_story: initialProject.q4_vision_story || "",
        q5_future_experience: initialProject.q5_future_experience || "",
        q6_measurable_outcomes: initialProject.q6_measurable_outcomes || "",
        q7_target_audience: initialProject.q7_target_audience || "",
        q8_post_success_vision: initialProject.q8_post_success_vision || "",
        q9_role_statement: initialProject.q9_role_statement || "",
      });
    }
  }, [initialProject]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!values.title.trim()) {
      alert("لطفاً برای پروژه یک نام انتخاب کن.");
      return;
    }
    onSubmit(values, initialProject?.id || null);
  }

  const labelStyle = {
    display: "block",
    marginBottom: "4px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#111827",
  };

  const subtitleStyle = {
    margin: "0 0 6px",
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.7,
  };

  const textareaStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.8)",
    fontSize: "13px",
    minHeight: "80px",
    resize: "vertical",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.8)",
    fontSize: "14px",
  };

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
      }}
    >
      <h2
        style={{
          margin: "0 0 16px",
          fontSize: "18px",
          fontWeight: 800,
          color: "#111827",
        }}
      >
        {initialProject ? "ویرایش پروژه" : "پرسشنامه هم‌آفرینی پروژه"}
      </h2>

      {/* ۱. امکانی که قرار است این پروژه محقق کند چیست؟ */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>۱. امکانی که قرار است این پروژه محقق کند چیست؟</label>
        <p style={subtitleStyle}>
          هرچه در این بخش پاسخ‌های شما انتزاعی‌تر باشد، کیفیت‌هایی که برای شما مهم است
          روشن‌تر خواهد شد؛(امکان هایی مثل احترام، روراستی، امید، معنا، اثربخشی، خدمت، دعوت و... .)<br />
          یا ارزش‌هایی که برای شما مهم‌اند؛ وقتی به آن‌ها فکر می‌کنید کیف می‌کنید
          و در وجودتان جشنی برپا می‌شود. (موتور متحرک پروژه)
        </p>
        <textarea
          name="q2_possibilities"
          value={values.q2_possibilities}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      {/* ۲. اسم پروژه */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>۲. اسم پروژه؟</label>
        <p style={subtitleStyle}>دوست داری پروژه‌ی شما را چه صدا کنند؟</p>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* ۳. چشم‌انداز یا پیامد معنوی پروژه */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>
          ۳. چشم‌انداز یا پیامد معنوی پروژه‌ی خود را روایت کنید.
        </label>
        <p style={subtitleStyle}>
          چشم‌انداز یعنی تصویر ذهنی روشن و پرشور از آینده‌ای که تصور می‌کنید. چشم‌انداز
          می‌تواند این ویژگی‌ها را داشته باشد: واضح و شفاف، پرشور و به‌یادماندنی، کوتاه و
          مفید، با پیامی بزرگ و حتی کمی اغراق‌آمیز، نشان‌دهنده‌ی بهترین خروجی پروژه و
          متناسب با ظرفیت‌ها و واقع‌بینانه است.
        </p>

        <div style={{ fontSize: "12px", marginBottom: "6px", color: "#6b7280" }}>
          قبل از نوشتن، می‌توانید این رساله ها را مطالعه کنید:
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
          <button
            type="button"
            onClick={() => setOpenEssaySlug("vision")}
            style={{
              padding: "4px 10px",
              borderRadius: "999px",
              border: "none",
              background: "#e0ecff",
              color: "#1d4ed8",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            جزوه چشم‌انداز
          </button>
          <button
            type="button"
            onClick={() => setOpenEssaySlug("values_mission")}
            style={{
              padding: "4px 10px",
              borderRadius: "999px",
              border: "none",
              background: "#e0ecff",
              color: "#1d4ed8",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            جزوه ارزش‌ها و مأموریت زندگی
          </button>
          <button
            type="button"
            onClick={() => setOpenEssaySlug("purpose")}
            style={{
              padding: "4px 10px",
              borderRadius: "999px",
              border: "none",
              background: "#e0ecff",
              color: "#1d4ed8",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            جزوه رسالت
          </button>
        </div>

        <textarea
          name="q4_vision_story"
          value={values.q4_vision_story}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      {/* ۴. دقیقا می‌خواهید چه اتفاقی بیفته؟ */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>۴. دقیقاً می‌خواهید چه اتفاقی بیفته؟</label>
        <p style={subtitleStyle}>
          شکل آن آینده‌ای را بنویس که دوست داری با محقق شدن پروژه‌ات، خودت یا افراد همراه در پروژه ات
          آن را تجربه کنند. (در دنیای آن آینده قدم بزن، وصف کن)<br />
           "مثبت قابل انجام"
        </p>
        <textarea
          name="q5_future_experience"
          value={values.q5_future_experience}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      {/* ۵. چه نتایجی می‌خوای داشته باشه؟ */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>۵. چه نتایجی می‌خواهید داشته باشه؟</label>
        <p style={subtitleStyle}>
          حالا که سرت را برمی‌گردانی، چه چیزهایی (اقداماتی) لازم است محقق شود تا آن آینده
          به تحقق برسد؟ لطفاً نتایج را شفاف و قابل اندازه‌گیری بنویس و از کمیت‌ها و واحدهایی
          مثل طول(متر،سانتی متر،کیلومتر)، زمان(ثانیه،دقیقه،ساعت،روز،ماه،سال)، وزن/جرم(گرم،کیلوگرم)، دما(درجه سلسیوس)، سرعت(کیلومتر بر ساعت،متر بر ثانیه)، حجم(لیتر،میلی لیتر،متر مکعب)، مساحت(متر مربع،سانتی متر مربع)،  تعداد(نفر)، تعداد کلاس یا جلسه آموزشی(جلسه،دوره،کلاس) ، واحدهای مالی
          (تومان، ریال، دلار و...)و... استفاده کن.
        </p>
        <textarea
          name="q6_measurable_outcomes"
          value={values.q6_measurable_outcomes}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      {/* ۶. مخاطب هدف پروژه کیه؟ */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>۶. مخاطب هدف پروژه کیه؟</label>
        <p style={subtitleStyle}>
          تک‌تک افرادی که در پروژه‌ات نقش دارند یا تحت‌الشعاع قرار می‌گیرند، مخاطب هدف تو هستند؛
          خودت هم شامل می‌شوی. هرچه دقیق‌تر و موشکافانه‌تر مخاطب هدفت را مشخص کنی، دسترسی‌ات
          بهتر می‌شود. می‌توانی به شغل، سن، جنسیت، موقعیت جغرافیایی، نگرش مذهبی، تعداد و سن
          فرزندان، میزان درآمد و اولویت‌های بودجه‌بندی و... فکر کنی.
        </p>
        <div style={{ fontSize: "12px", marginBottom: "6px", color: "#6b7280" }}>
          قبل از نوشتن، می‌توانید این رساله را مطالعه کنید:
        </div>
        <div style={{ marginBottom: "8px" }}>
          <button
            type="button"
            onClick={() => setOpenEssaySlug("target_market")}
            style={{
              padding: "4px 10px",
              borderRadius: "999px",
              border: "none",
              background: "#e0ecff",
              color: "#1d4ed8",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            جزوه بازار هدف
          </button>
        </div>
        <textarea
          name="q7_target_audience"
          value={values.q7_target_audience}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      {/* ۷. چشم‌انداز تو برای بعد از محقق شدن این پروژه چیه؟ */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>
          ۷. چشم‌انداز تو برای بعد از محقق شدن <strong>{values.title}</strong> چیه؟
        </label>
        <p style={subtitleStyle}>
          اگر به نتایجی که مشخص کردی:<strong>{values.q6_measurable_outcomes}</strong> رسیدی،<br /> حالا در آینده چه می‌بینی و اقدام بعدی‌ات چه
          می‌تونه باشه؟
        </p>
        <textarea
          name="q8_post_success_vision"
          value={values.q8_post_success_vision}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      {/* ۸. تو برای این پروژه چه کسی هستی؟ */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>۸. تو برای این پروژه چه کسی هستی؟</label>
        <p style={subtitleStyle}>
          مثال: «من برای این پروژه ... هستم.» لطفاً مثل این الگو بنویسید و با یک جمله
          نقش و حضور خودت را در این پروژه تعریف کنید.
        </p>
        <textarea
          name="q9_role_statement"
          value={values.q9_role_statement}
          onChange={handleChange}
          style={{ ...textareaStyle, minHeight: "60px" }}
        />
      </div>

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
          ذخیره پروژه
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

      {openEssaySlug && (
        <EssayModal
          slug={openEssaySlug}
          participantId={participantId}
          projectId={initialProject?.id || null}
          onClose={() => setOpenEssaySlug(null)}
        />
      )}
    </form>
  );
}
