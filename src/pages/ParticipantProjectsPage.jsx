import { useEffect, useState } from "react";
import api from "../apiClient";
import { useParams, useNavigate } from "react-router-dom";

export default function ParticipantProjectsPage() {
    const { userId, courseId } = useParams();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openSections, setOpenSections] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        loadProjects();
    }, []);

    async function loadProjects() {
        setLoading(true);

        const result = await api.participantProjects(userId, courseId);

        if (result.success) {
            setProjects(result.data || []);
        } else {
            alert(result.message || "دریافت پروژه‌های شرکت‌کننده با خطا مواجه شد.");
            setProjects([]);
        }

        setLoading(false);
    }

    function toggleSection(key) {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    }




    if (loading) {
        return <div style={{ padding: "24px" }}>در حال بارگذاری پروژه‌های شرکت‌کننده...</div>;
    }

    const participantName =
        projects[0]?.user_full_name || projects[0]?.user_username || "شرکت‌کننده";

    const courseTitle =
        projects[0]?.course_title || projects[0]?.course_id || courseId;

    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                    gap: "12px",
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize: "24px",
                        fontWeight: 800,
                        color: "#111827",
                    }}
                >
                    جزئیات پروژه‌های شرکت‌کننده
                </h1>

                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: "8px 16px",
                        border: "none",
                        borderRadius: "999px",
                        background:
                            "linear-gradient(135deg,#1A5BFF,#6A00D4)",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    بازگشت
                </button>
            </div>


            <p style={{ margin: "0 0 6px", fontSize: "14px", color: "#374151" }}>
                <strong>شرکت‌کننده:</strong> {participantName}
            </p>

            <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#374151" }}>
                <strong>دوره:</strong> {courseTitle}
            </p>

            {projects.length === 0 && (
                <div style={emptyStyle}>هیچ پروژه فعالی برای این شرکت‌کننده ثبت نشده است.</div>
            )}

            {projects.map((project, index) => (
                <div key={project.id} style={projectCardStyle}>
                    <h2 style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: 800, color: "#111827" }}>
                        پروژه {index + 1}: {project.title || "پروژه بدون عنوان"}
                    </h2>

                    <button
                        type="button"
                        onClick={() => {
                            const token = localStorage.getItem("nil_token");

                            window.open(
                                `https://nilpapd.com/nil-project-v2/api/project-report-preview.php?id=${project.id}&token=${encodeURIComponent(token || "")}`,
                                "_blank"
                            );
                        }}
                        style={{
                            marginBottom: "14px",
                            padding: "7px 14px",
                            borderRadius: "999px",
                            border: "none",
                            background: "linear-gradient(135deg, #1A5BFF, #12B886)",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        مشاهده گزارش پروژه
                    </button>


                    <AccordionSection
                        title="اطلاعات پروژه"
                        isOpen={!!openSections[`project-${project.id}-info`]}
                        onToggle={() => toggleSection(`project-${project.id}-info`)}
                    >
                        <ProjectSnapshot snapshot={project.form_snapshot} />
                    </AccordionSection>

                    <AccordionSection
                        title="عملکردهای هفتگی"
                        isOpen={!!openSections[`project-${project.id}-weekly`]}
                        onToggle={() => toggleSection(`project-${project.id}-weekly`)}
                    >
                        {!project.weekly_entries || project.weekly_entries.length === 0 ? (
                            <div style={emptySmallStyle}>هنوز عملکرد هفتگی ثبت نشده است.</div>
                        ) : (
                            project.weekly_entries.map((entry, i) => (
                                <WeeklyEntry key={entry.id || i} entry={entry} index={i} />


                            ))
                        )}
                    </AccordionSection>

                    <AccordionSection
                        title="مایل‌ستون‌ها"
                        isOpen={!!openSections[`project-${project.id}-milestones`]}
                        onToggle={() => toggleSection(`project-${project.id}-milestones`)}
                    >
                        {!project.milestones || project.milestones.length === 0 ? (
                            <div style={emptySmallStyle}>هنوز مایل‌ستون ثبت نشده است.</div>
                        ) : (
                            project.milestones.map((entry, i) => (
                                <MilestoneEntry key={entry.id || i} entry={entry} index={i} />
                            ))
                        )}
                    </AccordionSection>

                    <p style={{ margin: "12px 0 0", fontSize: "12px", color: "#6b7280" }}>
                        آخرین بروزرسانی:{" "}
                        {project.updated_at ? new Date(project.updated_at).toLocaleString("fa-IR") : "-"}
                    </p>
                </div>
            ))}
        </div>
    );
}

function SectionTitle({ children }) {
    return (
        <h3
            style={{
                margin: "18px 0 8px",
                fontSize: "15px",
                fontWeight: 900,
                color: "#1d4ed8",
            }}
        >
            {children}
        </h3>
    );
}

function AccordionSection({ title, isOpen, onToggle, children }) {
    return (
        <div
            style={{
                marginTop: "12px",
                borderRadius: "14px",
                border: "1px solid rgba(226,232,240,0.9)",
                overflow: "hidden",
                background: "#ffffff",
            }}
        >
            <button
                type="button"
                onClick={onToggle}
                style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "none",
                    background: "#f9fafb",
                    color: "#111827",
                    fontSize: "14px",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "right",
                }}
            >
                <span>{title}</span>
                <span>{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && (
                <div
                    style={{
                        padding: "12px",
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}


function InfoBlock({ title, value }) {
    return (
        <div style={infoBlockStyle}>
            <div style={infoTitleStyle}>{title}</div>
            <div style={infoValueStyle}>{value || "ثبت نشده"}</div>
        </div>
    );
}

function ProjectSnapshot({ snapshot }) {
    let fields = [];

    try {
        fields =
            typeof snapshot === "string"
                ? JSON.parse(snapshot)
                : snapshot || [];
    } catch (e) {
        fields = [];
    }

    if (!fields.length) {
        return (
            <div style={emptySmallStyle}>
                اطلاعات فرم پروژه ثبت نشده است.
            </div>
        );
    }

    return (
        <>
            {fields.map((field, index) => (
                <InfoBlock
                    key={field.key || index}
                    title={field.label}
                    value={field.value}
                />
            ))}
        </>
    );
}


function WeeklyEntry({ entry, index }) {
    const tasks = entry.tasks || {};

    const visibleTasks = Object.entries(tasks).filter(
        ([key, item]) => item && item.text
    );

    const totalCount = visibleTasks.length;
    const doneCount = visibleTasks.filter(([key, item]) => item.done).length;


    return (
        <div style={subCardStyle}>
            <div style={subCardHeaderStyle}>
                <div
                    style={{
                        fontSize: "12px",
                        color: "#374151",
                        marginBottom: "8px",
                        lineHeight: 1.8,
                    }}
                >
                    تسک‌های تعریف‌شده: {totalCount}
                    <br />
                    تسک‌های انجام‌شده: {doneCount}
                </div>

                <strong>{entry.week_label || `عملکرد هفتگی ${index + 1}`}</strong>
                <span>{entry.created_at ? new Date(entry.created_at).toLocaleString("fa-IR") : ""}</span>
            </div>

            {Object.entries(tasks).map(([key, item]) => {
                if (!item?.text) return null;

                return (
                    <div key={key} style={miniItemStyle}>
                        <strong>{taskLabel(key)}:</strong>
                        <div style={preWrapStyle}>{item.text}</div>

                        <label
                            style={{
                                marginTop: "4px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                fontSize: "11px",
                                color: "#374151",
                                background: item.done ? "#dcfce7" : "#f3f4f6",
                                padding: "3px 8px",
                                borderRadius: "999px",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={!!item.done}
                                readOnly
                            />
                            {item.done ? "انجام شده" : "انجام نشده"}
                        </label>


                    </div>
                );
            })}

            {entry.share_targets && (
                <div style={miniItemStyle}>
                    <strong>افرادی که پروژه به آن‌ها معرفی شده:</strong>
                    <div style={preWrapStyle}>{entry.share_targets}</div>
                </div>
            )}
        </div>
    );
}

function MilestoneEntry({ entry, index }) {
    const answers = entry.answers || {};

    return (
        <div style={subCardStyle}>
            <div style={subCardHeaderStyle}>
                <strong>
                    {milestonePeriodLabel(entry.period_label) || `مایل‌ستون ${index + 1}`}
                </strong>

                <span>{entry.created_at ? new Date(entry.created_at).toLocaleString("fa-IR") : ""}</span>
            </div>

            {Object.entries(answers).map(([key, value]) => {
                const text =
                    typeof value === "object"
                        ? [value.date ? `تاریخ: ${value.date}` : "", value.text ? `متن: ${value.text}` : ""]
                            .filter(Boolean)
                            .join("\n")
                        : value;

                if (!text) return null;

                return (
                    <div key={key} style={miniItemStyle}>
                        <strong>{milestoneLabel(key)}:</strong>
                        <div style={preWrapStyle}>{text}</div>
                    </div>
                );
            })}
        </div>
    );
}

function taskLabel(key) {
    const labels = {
        vital: "اقدام حیاتی",
        important1: "اقدام مهم ۱",
        important2: "اقدام مهم ۲",
        important3: "اقدام مهم ۳",
        normal1: "اقدام معمولی ۱",
        normal2: "اقدام معمولی ۲",
        normal3: "اقدام معمولی ۳",
        normal4: "اقدام معمولی ۴",
        normal5: "اقدام معمولی ۵",
    };

    return labels[key] || key;
}

function milestoneLabel(key) {
    const labels = {
        vision_beyond_8months: "چشم‌انداز فراتر از ۸ ماه",

        m8_month_end: "پایان ماه هشتم",
        m8_w3: "ماه هشتم - هفته سوم",
        m8_w2: "ماه هشتم - هفته دوم",
        m8_w1: "ماه هشتم - هفته اول",

        m7_month_end: "پایان ماه هفتم",
        m7_w3: "ماه هفتم - هفته سوم",
        m7_w2: "ماه هفتم - هفته دوم",
        m7_w1: "ماه هفتم - هفته اول",

        m6_month_end: "پایان ماه ششم",
        m6_w3: "ماه ششم - هفته سوم",
        m6_w2: "ماه ششم - هفته دوم",
        m6_w1: "ماه ششم - هفته اول",

        m5_month_end: "پایان ماه پنجم",
        m5_w3: "ماه پنجم - هفته سوم",
        m5_w2: "ماه پنجم - هفته دوم",
        m5_w1: "ماه پنجم - هفته اول",

        m4_month_end: "پایان ماه چهارم",
        m4_w3: "ماه چهارم - هفته سوم",
        m4_w2: "ماه چهارم - هفته دوم",
        m4_w1: "ماه چهارم - هفته اول",

        m3_month_end: "پایان ماه سوم",
        m3_w3: "ماه سوم - هفته سوم",
        m3_w2: "ماه سوم - هفته دوم",
        m3_w1: "ماه سوم - هفته اول",

        m2_month_end: "پایان ماه دوم",
        m2_w3: "ماه دوم - هفته سوم",
        m2_w2: "ماه دوم - هفته دوم",
        m2_w1: "ماه دوم - هفته اول",

        m1_month_end: "پایان ماه اول",
        m1_w3: "ماه اول - هفته سوم",
        m1_w2: "ماه اول - هفته دوم",
        m1_w1: "ماه اول - هفته اول",
    };

    return labels[key] || key;
}



function milestonePeriodLabel(key) {
    const labels = {
        custom_milestone: "مایل‌ستون سفارشی",

        m1_w1: "ماه اول - هفته اول",
        m1_w2: "ماه اول - هفته دوم",
        m1_w3: "ماه اول - هفته سوم",

        m2_w1: "ماه دوم - هفته اول",
        m2_w2: "ماه دوم - هفته دوم",
        m2_w3: "ماه دوم - هفته سوم",

        m3_w1: "ماه سوم - هفته اول",
        m3_w2: "ماه سوم - هفته دوم",
        m3_w3: "ماه سوم - هفته سوم",

        m4_w1: "ماه چهارم - هفته اول",
        m4_w2: "ماه چهارم - هفته دوم",
        m4_w3: "ماه چهارم - هفته سوم",

        m5_w1: "ماه پنجم - هفته اول",
        m5_w2: "ماه پنجم - هفته دوم",
        m5_w3: "ماه پنجم - هفته سوم",

        m6_w1: "ماه ششم - هفته اول",
        m6_w2: "ماه ششم - هفته دوم",
        m6_w3: "ماه ششم - هفته سوم",

        m7_w1: "ماه هفتم - هفته اول",
        m7_w2: "ماه هفتم - هفته دوم",
        m7_w3: "ماه هفتم - هفته سوم",

        m8_w1: "ماه هشتم - هفته اول",
        m8_w2: "ماه هشتم - هفته دوم",
        m8_w3: "ماه هشتم - هفته سوم",
    };

    return labels[key] || key;
}


const projectCardStyle = {
    marginBottom: "22px",
    padding: "20px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(226,232,240,0.9)",
    boxShadow: "0 8px 22px rgba(148,163,184,0.28)",
};

const infoBlockStyle = {
    marginTop: "10px",
    paddingTop: "8px",
    borderTop: "1px dashed rgba(209,213,219,0.9)",
};

const infoTitleStyle = {
    fontSize: "13px",
    fontWeight: 800,
    color: "#111827",
    marginBottom: "4px",
};

const infoValueStyle = {
    fontSize: "13px",
    color: "#374151",
    lineHeight: 1.8,
    whiteSpace: "pre-wrap",
};

const subCardStyle = {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "14px",
    background: "#f9fafb",
    border: "1px solid rgba(226,232,240,0.9)",
};

const subCardHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    fontSize: "12px",
    color: "#374151",
    marginBottom: "8px",
};

const miniItemStyle = {
    marginTop: "8px",
    paddingTop: "6px",
    borderTop: "1px dashed rgba(209,213,219,0.9)",
    fontSize: "12px",
    color: "#111827",
    lineHeight: 1.8,
};

const preWrapStyle = {
    whiteSpace: "pre-wrap",
    marginTop: "2px",
};

const emptyStyle = {
    padding: "18px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.92)",
    fontSize: "14px",
    color: "#4b5563",
};

const emptySmallStyle = {
    padding: "10px",
    borderRadius: "12px",
    background: "#f9fafb",
    fontSize: "12px",
    color: "#6b7280",
};
