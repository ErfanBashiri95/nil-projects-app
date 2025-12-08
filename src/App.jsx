import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MyProjectsPage from "./pages/MyProjectsPage";
import MentorLogin from "./pages/MentorLogin";
import MentorDashboard from "./pages/MentorDashboard";
import MentorParticipantPage from "./pages/MentorParticipantPage";
import NilLogoFixed from "./components/NilLogoFixed";

export default function App() {
  return (
    <Router>
      <NilLogoFixed />

      <Routes>
        {/* ورود شرکت‌کننده */}
        <Route path="/" element={<LoginPage />} />

        {/* پنل شرکت‌کننده */}
        <Route path="/my-projects" element={<MyProjectsPage />} />

        {/* ورود رهیار */}
        <Route path="/mentor-login" element={<MentorLoginWrapper />} />

        {/* داشبورد رهیار */}
        <Route path="/mentor" element={<MentorDashboardWrapper />} />

        {/* صفحه جزئیات یک شرکت‌کننده برای رهیار */}
        <Route
          path="/mentor/user/:id"
          element={<MentorParticipantWrapper />}
        />
      </Routes>
    </Router>
  );
}

/* --- رپرها برای مدیریت state لاگین رهیار --- */

function MentorLoginWrapper() {
  return (
    <MentorLogin
      onLogin={(mentorInfo) => {
        localStorage.setItem("mentorInfo", JSON.stringify(mentorInfo));
        window.location.href = "/mentor";
      }}
    />
  );
}

function MentorDashboardWrapper() {
  const saved = localStorage.getItem("mentorInfo");
  if (!saved) {
    window.location.href = "/mentor-login";
    return null;
  }

  const mentor = JSON.parse(saved);
  return <MentorDashboard mentor={mentor} />;
}

function MentorParticipantWrapper() {
  const saved = localStorage.getItem("mentorInfo");
  const { id } = useParams();

  if (!saved) {
    window.location.href = "/mentor-login";
    return null;
  }

  const mentor = JSON.parse(saved);
  return <MentorParticipantPage mentor={mentor} participantId={id} />;
}
