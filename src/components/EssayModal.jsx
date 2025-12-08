import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function EssayModal({ slug, onClose, participantId, projectId }) {
  const [essay, setEssay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readState, setReadState] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchEssay() {
      setLoading(true);
      const { data, error } = await supabase
        .from("nilproject_essays")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) console.error("Error loading essay", error);
      setEssay(data);
      setLoading(false);
    }
    fetchEssay();
  }, [slug]);

  useEffect(() => {
    if (!essay || !participantId) return;
    async function fetchReadState() {
      const { data, error } = await supabase
        .from("nilproject_essay_reads")
        .select("*")
        .eq("participant_id", participantId)
        .eq("essay_id", essay.id)
        .order("last_updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error loading read state", error);
      } else if (data) {
        setReadState(data.is_read);
      }
    }
    fetchReadState();
  }, [essay, participantId]);

  async function handleToggleRead(e) {
    const checked = e.target.checked;
    setReadState(checked);
    if (!essay || !participantId) return;

    setSaving(true);
    const { error } = await supabase.from("nilproject_essay_reads").insert({
      participant_id: participantId,
      project_id: projectId || null,
      essay_id: essay.id,
      is_read: checked,
      marked_read_at: checked ? new Date().toISOString() : null,
      last_updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving essay read state", error);
      alert("ذخیره وضعیت مطالعه با خطا مواجه شد");
    }
    setSaving(false);
  }

  if (!onClose) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.65)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9998,
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          maxHeight: "90vh",
          background: "#f9fafb",
          borderRadius: "18px",
          boxShadow: "0 18px 45px rgba(15,23,42,0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            background:
              "linear-gradient(90deg, rgba(76,139,245,0.12), rgba(123,63,242,0.12))",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {essay ? essay.title : "در حال بارگذاری رساله..."}
          </h3>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#e5e7eb",
              borderRadius: "999px",
              padding: "4px 10px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            ✕ بستن
          </button>
        </div>

        <div style={{ flex: 1, borderBottom: "1px solid #e5e7eb" }}>
          {loading || !essay ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: "#4b5563",
              }}
            >
              در حال بارگذاری...
            </div>
          ) : (
            <iframe
              src={essay.pdf_url}
              title={essay.title}
              style={{ width: "100%", height: "60vh", border: "none" }}
            />
          )}
        </div>

        <div
          style={{
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "13px",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="checkbox"
              checked={readState}
              onChange={handleToggleRead}
              disabled={saving}
            />
            <span>این جزوه را مطالعه کردم</span>
          </label>
        </div>
      </div>
    </div>
  );
}
