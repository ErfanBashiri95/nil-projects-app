import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apiClient";

export default function ProjectsOverviewPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        setLoading(true);

        const params = new URLSearchParams(window.location.search);
        const courseId = params.get("course_id");

        const result = await api.allProjects(courseId);

        if (result.success) {
            setItems(result.data || []);
        } else {
            alert(result.message || "خطا در دریافت اطلاعات");
            setItems([]);
        }

        setLoading(false);
    }


    if (loading) {
        return <div style={{ padding: "24px" }}>در حال بارگذاری...</div>;
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredItems = items.filter((item) => {
        if (!normalizedSearch) return true;

        const text = [
            item.user_full_name,
            item.user_username,
            item.course_title,
            item.course_id,
            item.project_count,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return text.includes(normalizedSearch);
    });


    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
            <h1 style={{ marginBottom: "18px", fontSize: "24px", fontWeight: 800 }}>
                نمای کلی پروژه‌ها
            </h1>

            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو بر اساس نام شرکت‌کننده، نام کاربری، دوره یا تعداد پروژه..."
                style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid rgba(148,163,184,0.8)",
                    fontSize: "13px",
                    marginBottom: "18px",
                }}
            />


            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "12px",
                }}
            >
                {filteredItems.map((item) => (
                    <div
                        key={`${item.user_id}-${item.course_id}`}
                        style={{
                            padding: "14px",
                            borderRadius: "16px",
                            background: "rgba(255,255,255,0.95)",
                            border: "1px solid rgba(226,232,240,0.9)",
                            boxShadow: "0 8px 18px rgba(148,163,184,0.25)",
                        }}
                    >
                        <h3 style={{ margin: "0 0 8px", fontSize: "15px", fontWeight: 800 }}>
                            {item.user_full_name || item.user_username || "بدون نام"}
                        </h3>

                        <p style={{ margin: "4px 0", fontSize: "12px" }}>
                            <strong>دوره:</strong>{" "}
                            {item.course_title || item.course_id}
                        </p>

                        <p style={{ margin: "4px 0", fontSize: "12px" }}>
                            <strong>تعداد پروژه‌ها:</strong>{" "}
                            {item.project_count}
                        </p>

                        <p style={{ margin: "4px 0", fontSize: "11px", color: "#6b7280" }}>
                            آخرین بروزرسانی:{" "}
                            {item.last_updated
                                ? new Date(item.last_updated).toLocaleString("fa-IR")
                                : "-"}
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    `/participant-projects/${item.user_id}/${item.course_id}`
                                )
                            }
                            style={{
                                marginTop: "10px",
                                width: "100%",
                                padding: "7px 10px",
                                borderRadius: "999px",
                                border: "none",
                                background: "linear-gradient(135deg, #1A5BFF, #6A00D4)",
                                color: "#fff",
                                fontSize: "12px",
                                cursor: "pointer",
                            }}
                        >
                            مشاهده جزئیات
                        </button>

                    </div>
                ))}
            </div>
        </div>
    );
}
