import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyProjectsPage from "./pages/MyProjectsPage";
import NilLogoFixed from "./components/NilLogoFixed";
import ProjectsOverviewPage from "./pages/ProjectsOverviewPage";
import ParticipantProjectsPage from "./pages/ParticipantProjectsPage";


export default function App() {
  return (
    <Router basename="/nil-project-v2">
      <NilLogoFixed />

      <Routes>
        <Route path="/" element={<MyProjectsPage />} />
        <Route path="/overview" element={<ProjectsOverviewPage />} />
        <Route
          path="/participant-projects/:userId/:courseId"
          element={<ParticipantProjectsPage />}
        />
      </Routes>
    </Router>
  );
}
