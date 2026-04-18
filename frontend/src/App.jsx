import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import AdoptionPage from "./pages/AdoptionPage";
import MatchingPage from "./pages/MatchingPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import MyPetsPage from "./pages/MyPetsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ScreeningPage from "./pages/ScreeningPage";
import AuthPage from "./pages/AuthPage";
import Website from "./pages/Website_Page";
import HomePage from "./pages/Home_Page";
import AboutPage from "./pages/About_Page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/website" element={<Website />} />
        <Route path="/website/home" element={<HomePage />} />
        <Route path="/website/about" element={<AboutPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/website" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="adoption" element={<AdoptionPage />} />
          <Route path="matching" element={<MatchingPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="my-pets" element={<MyPetsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="adoption-status" element={<ScreeningPage />} />
          <Route path="*" element={<Navigate to="/website" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
