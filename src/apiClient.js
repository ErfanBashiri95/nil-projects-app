const API_BASE_URL = "https://nilpapd.com/nil-project-v2/api";

function getToken() {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
        localStorage.setItem("nil_token", tokenFromUrl);

        params.delete("token");

        const remainingQuery = params.toString();

        const cleanUrl =
            window.location.origin +
            window.location.pathname +
            (remainingQuery ? `?${remainingQuery}` : "") +
            window.location.hash;

        window.history.replaceState({}, document.title, cleanUrl);

        return tokenFromUrl;
    }

    return localStorage.getItem("nil_token");
}



export async function apiGet(fileName) {
    const response = await fetch(`${API_BASE_URL}/${fileName}.php`, {
        headers: {
            Authorization: "Bearer " + getToken(),
        },
    });

    return response.json();
}

export async function apiPost(fileName, payload = {}) {
    const response = await fetch(`${API_BASE_URL}/${fileName}.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken(),
        },
        body: JSON.stringify(payload),
    });

    return response.json();
}

export default {
    me: () => apiGet("me"),
    myProjectCourses: () => apiGet("my-project-courses"),
    projects: async (courseId) => {
        const response = await fetch(
            `${API_BASE_URL}/projects.php?course_id=${encodeURIComponent(courseId)}`,
            {
                headers: {
                    Authorization: "Bearer " + getToken(),
                },
            }
        );

        return response.json();
    },


    saveProject: (courseId, values, projectId = null) =>
        apiPost("save-project", {
            course_id: courseId,
            project_id: projectId,
            values,
        }),

    deleteProject: (projectId) =>
        apiPost("delete-project", {
            project_id: projectId,
        }),

    saveMilestone: (projectId, answers, periodLabel = "year1_full_plan", periodStart = null) =>
        apiPost("save-milestone", {
            project_id: projectId,
            period_start: periodStart,
            period_label: periodLabel,
            answers,
        }),

    milestones: async (projectId) => {
        const response = await fetch(
            `${API_BASE_URL}/milestones-list.php?project_id=${encodeURIComponent(projectId)}`,
            {
                headers: {
                    Authorization: "Bearer " + getToken(),
                },
            }
        );

        return response.json();
    },

    saveWeekly: (
        projectId,
        tasks,
        shareTargets,
        weekLabel = "",
        weekStart = null
    ) =>
        apiPost("save-weekly", {
            project_id: projectId,
            week_start: weekStart,
            week_label: weekLabel,
            tasks,
            share_targets: shareTargets,
        }),

    weeklyEntries: async (projectId) => {
        const response = await fetch(
            `${API_BASE_URL}/weekly-list.php?project_id=${encodeURIComponent(projectId)}`,
            {
                headers: {
                    Authorization: "Bearer " + getToken(),
                },
            }
        );

        return response.json();
    },

    allProjects: async (courseId = null) => {
        const query = courseId
            ? `?course_id=${encodeURIComponent(courseId)}`
            : "";

        const response = await fetch(
            `${API_BASE_URL}/all-projects.php${query}`,
            {
                headers: {
                    Authorization: "Bearer " + getToken(),
                },
            }
        );

        return response.json();
    },


    participantProjects: async (userId, courseId) => {
        const response = await fetch(
            `${API_BASE_URL}/participant-projects.php?user_id=${encodeURIComponent(userId)}&course_id=${encodeURIComponent(courseId)}`,
            {
                headers: {
                    Authorization: "Bearer " + getToken(),
                },
            }
        );

        return response.json();
    },

    updateWeekly: (
        entryId,
        tasks,
        shareTargets,
        weekLabel = "",
        weekStart = null
    ) =>
        apiPost("update-weekly", {
            entry_id: entryId,
            week_start: weekStart,
            week_label: weekLabel,
            tasks,
            share_targets: shareTargets,
        }),


    deleteWeekly: (entryId) =>
        apiPost("delete-weekly", {
            entry_id: entryId,
        }),

    updateMilestone: (
        entryId,
        answers,
        periodLabel = "custom_milestone",
        periodStart = null
    ) =>
        apiPost("update-milestone", {
            entry_id: entryId,
            period_start: periodStart,
            period_label: periodLabel,
            answers,
        }),


    deleteMilestone: (entryId) =>
        apiPost("delete-milestone", {
            entry_id: entryId,
        }),


    updateWeeklyTask: (entryId, tasks) =>
        apiPost("update-weekly-task", {
            entry_id: entryId,
            tasks,
        }),









};
